import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';
import { User } from '../user/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { Template } from '../template/entities/template.entity';
import { Agent } from '../agent/entities/agent.entity';
import { Order, OrderStatus } from '../payment/entities/order.entity';
import { TenantSubscription, SubscriptionStatus } from '../subscription/entities/tenant-subscription.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(TenantSubscription)
    private readonly subscriptionRepository: Repository<TenantSubscription>,
  ) {}

  /**
   * 获取超级管理员仪表板统计
   */
  async getAdminDashboard(): Promise<any> {
    // 租户统计
    const totalTenants = await this.tenantRepository.count();
    const activeTenants = await this.tenantRepository.count({
      where: { status: 'active' },
    });

    // 用户统计
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({
      where: { status: 'active' },
    });

    // 内容统计
    const totalContents = await this.contentRepository.count();
    const publishedContents = await this.contentRepository.count({
      where: { status: 'published' },
    });

    // 模板统计
    const totalTemplates = await this.templateRepository.count();
    const approvedTemplates = await this.templateRepository.count({
      where: { status: 'approved' },
    });

    // 代理商统计
    const totalAgents = await this.agentRepository.count();
    const activeAgents = await this.agentRepository.count({
      where: { status: 'active' },
    });

    // 订阅统计
    const activeSubscriptions = await this.subscriptionRepository.count({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    // 订单统计
    const totalOrders = await this.orderRepository.count();
    const paidOrders = await this.orderRepository.count({
      where: { status: OrderStatus.PAID },
    });

    // 收入统计
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .getRawOne();

    // 本月收入
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.paidAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    // 今日新增租户
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTenants = await this.tenantRepository.count({
      where: { createdAt: MoreThan(today) },
    });

    // 今日新增用户
    const todayUsers = await this.userRepository.count({
      where: { createdAt: MoreThan(today) },
    });

    return {
      tenants: {
        total: totalTenants,
        active: activeTenants,
        today: todayTenants,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        today: todayUsers,
      },
      contents: {
        total: totalContents,
        published: publishedContents,
      },
      templates: {
        total: totalTemplates,
        approved: approvedTemplates,
      },
      agents: {
        total: totalAgents,
        active: activeAgents,
      },
      subscriptions: {
        active: activeSubscriptions,
      },
      orders: {
        total: totalOrders,
        paid: paidOrders,
      },
      revenue: {
        total: totalRevenue?.total || 0,
        monthly: monthlyRevenue?.total || 0,
      },
    };
  }

  /**
   * 获取租户仪表板统计
   */
  async getTenantDashboard(tenantId: number): Promise<any> {
    // 用户统计
    const totalUsers = await this.userRepository.count({
      where: { tenantId },
    });
    const activeUsers = await this.userRepository.count({
      where: { tenantId, status: 'active' },
    });

    // 内容统计
    const totalContents = await this.contentRepository.count({
      where: { tenantId },
    });
    const publishedContents = await this.contentRepository.count({
      where: { tenantId, status: 'published' },
    });
    const draftContents = await this.contentRepository.count({
      where: { tenantId, status: 'draft' },
    });

    // 内容浏览和点赞统计
    const contentStats = await this.contentRepository
      .createQueryBuilder('content')
      .select('SUM(content.viewCount)', 'totalViews')
      .addSelect('SUM(content.likeCount)', 'totalLikes')
      .where('content.tenantId = :tenantId', { tenantId })
      .getRawOne();

    // 订阅信息
    const subscription = await this.subscriptionRepository.findOne({
      where: { tenantId, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    // 订单统计
    const totalOrders = await this.orderRepository.count({
      where: { tenantId },
    });
    const paidOrders = await this.orderRepository.count({
      where: { tenantId, status: OrderStatus.PAID },
    });

    // 支出统计
    const totalSpending = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .getRawOne();

    // 本月新增内容
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyContents = await this.contentRepository.count({
      where: {
        tenantId,
        createdAt: MoreThan(startOfMonth),
      },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      contents: {
        total: totalContents,
        published: publishedContents,
        draft: draftContents,
        monthly: monthlyContents,
      },
      engagement: {
        totalViews: contentStats?.totalViews || 0,
        totalLikes: contentStats?.totalLikes || 0,
      },
      subscription: subscription
        ? {
            planName: subscription.plan.name,
            status: subscription.status,
            endDate: subscription.endDate,
            usage: {
              users: `${subscription.currentUsers}/${subscription.plan.maxUsers === -1 ? '∞' : subscription.plan.maxUsers}`,
              storage: `${subscription.currentStorage}/${subscription.plan.maxStorage === -1 ? '∞' : subscription.plan.maxStorage}MB`,
              bandwidth: `${subscription.currentBandwidth}/${subscription.plan.maxBandwidth === -1 ? '∞' : subscription.plan.maxBandwidth}GB`,
              contents: `${subscription.currentContents}/${subscription.plan.maxContents === -1 ? '∞' : subscription.plan.maxContents}`,
            },
          }
        : null,
      orders: {
        total: totalOrders,
        paid: paidOrders,
      },
      spending: {
        total: totalSpending?.total || 0,
      },
    };
  }

  /**
   * 获取代理商仪表板统计
   */
  async getAgentDashboard(agentId: number): Promise<any> {
    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
    });

    if (!agent) {
      throw new Error('代理商不存在');
    }

    // 下级代理商统计
    const totalChildren = await this.agentRepository.count({
      where: { parentId: agentId },
    });
    const activeChildren = await this.agentRepository.count({
      where: { parentId: agentId, status: 'active' },
    });

    // 本月业绩
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyOrders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('tenants', 'tenant', 'tenant.id = order.tenantId')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(order.finalAmount)', 'total')
      .where('tenant.agentId = :agentId', { agentId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.paidAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    return {
      agent: {
        name: agent.name,
        level: agent.level,
        status: agent.status,
      },
      customers: {
        total: agent.totalCustomers,
        active: agent.activeCustomers,
      },
      children: {
        total: totalChildren,
        active: activeChildren,
      },
      performance: {
        totalRevenue: agent.totalRevenue,
        totalCommission: agent.totalCommission,
        monthlyOrders: monthlyOrders?.count || 0,
        monthlyRevenue: monthlyOrders?.total || 0,
      },
    };
  }

  /**
   * 获取内容统计报表
   */
  async getContentReport(
    tenantId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .where('content.tenantId = :tenantId', { tenantId });

    if (startDate) {
      queryBuilder.andWhere('content.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('content.createdAt <= :endDate', { endDate });
    }

    // 按状态统计
    const statusStats = await queryBuilder
      .select('content.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('content.status')
      .getRawMany();

    // 按日期统计
    const dailyStats = await queryBuilder
      .select('DATE(content.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(content.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // 热门内容（按浏览量）
    const topByViews = await this.contentRepository.find({
      where: { tenantId, status: 'published' },
      order: { viewCount: 'DESC' },
      take: 10,
      select: ['id', 'title', 'viewCount', 'likeCount', 'createdAt'],
    });

    // 热门内容（按点赞）
    const topByLikes = await this.contentRepository.find({
      where: { tenantId, status: 'published' },
      order: { likeCount: 'DESC' },
      take: 10,
      select: ['id', 'title', 'viewCount', 'likeCount', 'createdAt'],
    });

    return {
      statusStats,
      dailyStats,
      topByViews,
      topByLikes,
    };
  }

  /**
   * 获取收入报表
   */
  async getRevenueReport(startDate?: Date, endDate?: Date): Promise<any> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.PAID });

    if (startDate) {
      queryBuilder.andWhere('order.paidAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('order.paidAt <= :endDate', { endDate });
    }

    // 按订单类型统计
    const typeStats = await queryBuilder
      .select('order.orderType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.finalAmount)', 'total')
      .groupBy('order.orderType')
      .getRawMany();

    // 按支付方式统计
    const methodStats = await queryBuilder
      .select('order.paymentMethod', 'method')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.finalAmount)', 'total')
      .groupBy('order.paymentMethod')
      .getRawMany();

    // 按日期统计
    const dailyStats = await queryBuilder
      .select('DATE(order.paidAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.finalAmount)', 'total')
      .groupBy('DATE(order.paidAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // 总计
    const total = await queryBuilder
      .select('COUNT(*)', 'count')
      .addSelect('SUM(order.finalAmount)', 'total')
      .getRawOne();

    return {
      total,
      typeStats,
      methodStats,
      dailyStats,
    };
  }

  /**
   * 获取模板统计
   */
  async getTemplateStats(): Promise<any> {
    // 按状态统计
    const statusStats = await this.templateRepository
      .createQueryBuilder('template')
      .select('template.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('template.status')
      .getRawMany();

    // 按分类统计
    const categoryStats = await this.templateRepository
      .createQueryBuilder('template')
      .select('template.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('template.category IS NOT NULL')
      .groupBy('template.category')
      .getRawMany();

    // 热门模板（按下载量）
    const topByDownloads = await this.templateRepository.find({
      where: { status: 'approved' },
      order: { downloadCount: 'DESC' },
      take: 10,
      select: ['id', 'name', 'downloadCount', 'ratingScore', 'price'],
    });

    // 热门模板（按评分）
    const topByRating = await this.templateRepository.find({
      where: { status: 'approved' },
      order: { ratingScore: 'DESC', ratingCount: 'DESC' },
      take: 10,
      select: ['id', 'name', 'downloadCount', 'ratingScore', 'ratingCount'],
    });

    return {
      statusStats,
      categoryStats,
      topByDownloads,
      topByRating,
    };
  }
}
