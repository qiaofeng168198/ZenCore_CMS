import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionPlan, PlanStatus } from './entities/subscription-plan.entity';
import { TenantSubscription, SubscriptionStatus } from './entities/tenant-subscription.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscribeDto, BillingCycle } from './dto/subscribe.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(TenantSubscription)
    private readonly subscriptionRepository: Repository<TenantSubscription>,
  ) {}

  /**
   * 创建套餐
   */
  async createPlan(createPlanDto: CreatePlanDto): Promise<SubscriptionPlan> {
    // 检查编码是否已存在
    const existingPlan = await this.planRepository.findOne({
      where: { code: createPlanDto.code },
    });
    if (existingPlan) {
      throw new BadRequestException('套餐编码已存在');
    }

    const plan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  /**
   * 获取所有套餐
   */
  async findAllPlans(activeOnly: boolean = false): Promise<SubscriptionPlan[]> {
    const where: any = {};
    if (activeOnly) {
      where.status = PlanStatus.ACTIVE;
    }

    return this.planRepository.find({
      where,
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
  }

  /**
   * 获取套餐详情
   */
  async findPlan(id: number): Promise<SubscriptionPlan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('套餐不存在');
    }
    return plan;
  }

  /**
   * 更新套餐
   */
  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<SubscriptionPlan> {
    const plan = await this.findPlan(id);

    // 如果修改了编码，检查是否冲突
    if (updatePlanDto.code && updatePlanDto.code !== plan.code) {
      const existingPlan = await this.planRepository.findOne({
        where: { code: updatePlanDto.code },
      });
      if (existingPlan) {
        throw new BadRequestException('套餐编码已存在');
      }
    }

    Object.assign(plan, updatePlanDto);
    return this.planRepository.save(plan);
  }

  /**
   * 删除套餐
   */
  async removePlan(id: number): Promise<void> {
    const plan = await this.findPlan(id);

    // 检查是否有租户正在使用
    const activeSubscriptions = await this.subscriptionRepository.count({
      where: {
        planId: id,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (activeSubscriptions > 0) {
      throw new BadRequestException('该套餐正在被使用，无法删除');
    }

    await this.planRepository.remove(plan);
  }

  /**
   * 租户订阅套餐
   */
  async subscribe(tenantId: number, subscribeDto: SubscribeDto): Promise<TenantSubscription> {
    const plan = await this.findPlan(subscribeDto.planId);

    if (plan.status !== PlanStatus.ACTIVE) {
      throw new BadRequestException('该套餐不可用');
    }

    // 检查租户是否已有活跃订阅
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        tenantId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('您已有活跃的订阅，请先取消或等待过期');
    }

    // 计算订阅时间
    const startDate = new Date();
    const endDate = this.calculateEndDate(startDate, subscribeDto.billingCycle);
    const nextBillingDate = new Date(endDate);

    const subscription = this.subscriptionRepository.create({
      tenantId,
      planId: plan.id,
      billingCycle: subscribeDto.billingCycle,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      nextBillingDate,
      lastBillingDate: startDate,
      autoRenew: true,
    });

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 计算订阅结束日期
   */
  private calculateEndDate(startDate: Date, billingCycle: BillingCycle): Date {
    const endDate = new Date(startDate);

    if (billingCycle === BillingCycle.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === BillingCycle.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return endDate;
  }

  /**
   * 获取租户当前订阅
   */
  async getTenantSubscription(tenantId: number): Promise<TenantSubscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        tenantId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    });
  }

  /**
   * 升级/降级套餐
   */
  async changePlan(tenantId: number, newPlanId: number): Promise<TenantSubscription> {
    const subscription = await this.getTenantSubscription(tenantId);
    if (!subscription) {
      throw new NotFoundException('未找到活跃订阅');
    }

    const newPlan = await this.findPlan(newPlanId);
    if (newPlan.status !== PlanStatus.ACTIVE) {
      throw new BadRequestException('目标套餐不可用');
    }

    const oldPlan = subscription.plan;

    // 检查是否为升级
    const isUpgrade = this.isUpgrade(oldPlan, newPlan);

    // 立即切换到新套餐
    subscription.planId = newPlan.id;

    // 如果是升级，保持当前结束时间；如果是降级，在下个周期生效
    if (!isUpgrade) {
      // 降级在当前周期结束后生效，这里可以创建一个pending subscription
      // 简化处理：直接更新
    }

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 判断是否为升级
   */
  private isUpgrade(oldPlan: SubscriptionPlan, newPlan: SubscriptionPlan): boolean {
    // 简单判断：比较月费价格
    return newPlan.monthlyPrice > oldPlan.monthlyPrice;
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(tenantId: number): Promise<TenantSubscription> {
    const subscription = await this.getTenantSubscription(tenantId);
    if (!subscription) {
      throw new NotFoundException('未找到活跃订阅');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 续费订阅
   */
  async renewSubscription(subscriptionId: number): Promise<TenantSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new NotFoundException('订阅不存在');
    }

    // 延长订阅时间
    const newEndDate = this.calculateEndDate(subscription.endDate, subscription.billingCycle);
    subscription.endDate = newEndDate;
    subscription.nextBillingDate = newEndDate;
    subscription.lastBillingDate = new Date();
    subscription.status = SubscriptionStatus.ACTIVE;

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 更新自动续费设置
   */
  async updateAutoRenew(tenantId: number, autoRenew: boolean): Promise<TenantSubscription> {
    const subscription = await this.getTenantSubscription(tenantId);
    if (!subscription) {
      throw new NotFoundException('未找到活跃订阅');
    }

    subscription.autoRenew = autoRenew;
    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 检查配额是否超限
   */
  async checkQuota(tenantId: number, quotaType: string, currentValue: number): Promise<boolean> {
    const subscription = await this.getTenantSubscription(tenantId);
    if (!subscription) {
      return false; // 没有订阅，不允许使用
    }

    const plan = subscription.plan;
    let limit = -1;

    switch (quotaType) {
      case 'users':
        limit = plan.maxUsers;
        break;
      case 'storage':
        limit = plan.maxStorage;
        break;
      case 'bandwidth':
        limit = plan.maxBandwidth;
        break;
      case 'contents':
        limit = plan.maxContents;
        break;
    }

    // -1 表示不限制
    if (limit === -1) {
      return true;
    }

    return currentValue < limit;
  }

  /**
   * 更新使用量
   */
  async updateUsage(
    tenantId: number,
    usage: {
      users?: number;
      storage?: number;
      bandwidth?: number;
      contents?: number;
    },
  ): Promise<TenantSubscription> {
    const subscription = await this.getTenantSubscription(tenantId);
    if (!subscription) {
      throw new NotFoundException('未找到活跃订阅');
    }

    if (usage.users !== undefined) {
      subscription.currentUsers = usage.users;
    }
    if (usage.storage !== undefined) {
      subscription.currentStorage = usage.storage;
    }
    if (usage.bandwidth !== undefined) {
      subscription.currentBandwidth = usage.bandwidth;
    }
    if (usage.contents !== undefined) {
      subscription.currentContents = usage.contents;
    }

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * 定时任务：处理过期订阅
   * 每天凌晨1点执行
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleExpiredSubscriptions(): Promise<void> {
    const now = new Date();

    // 查找已过期的订阅
    const expiredSubscriptions = await this.subscriptionRepository.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: LessThan(now),
      },
      relations: ['plan'],
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.autoRenew) {
        // 自动续费
        try {
          await this.renewSubscription(subscription.id);
          // 这里应该创建订单并调用支付系统
          console.log(`订阅 ${subscription.id} 自动续费成功`);
        } catch (error) {
          console.error(`订阅 ${subscription.id} 自动续费失败:`, error);
          subscription.status = SubscriptionStatus.EXPIRED;
          await this.subscriptionRepository.save(subscription);
        }
      } else {
        // 标记为过期
        subscription.status = SubscriptionStatus.EXPIRED;
        await this.subscriptionRepository.save(subscription);
      }
    }
  }

  /**
   * 获取租户订阅历史
   */
  async getSubscriptionHistory(
    tenantId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: TenantSubscription[]; total: number }> {
    const [data, total] = await this.subscriptionRepository.findAndCount({
      where: { tenantId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total };
  }
}
