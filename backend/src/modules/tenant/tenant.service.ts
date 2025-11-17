import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, TenantStatus } from './entities/tenant.entity';
import { TenantQuota, QuotaType } from './entities/tenant-quota.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantQuota)
    private readonly quotaRepository: Repository<TenantQuota>,
  ) {}

  /**
   * 创建租户
   */
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // 检查租户代码是否已存在
    const existing = await this.tenantRepository.findOne({
      where: { code: createTenantDto.code },
    });

    if (existing) {
      throw new ConflictException('租户代码已存在');
    }

    // 创建租户
    const tenant = this.tenantRepository.create({
      ...createTenantDto,
      status: TenantStatus.ACTIVE,
      subdomain: createTenantDto.code,
    });

    const savedTenant = await this.tenantRepository.save(tenant);

    // 初始化默认配额
    await this.initDefaultQuotas(savedTenant.id);

    return savedTenant;
  }

  /**
   * 初始化默认配额
   */
  private async initDefaultQuotas(tenantId: number): Promise<void> {
    const defaultQuotas = [
      {
        tenantId,
        quotaType: QuotaType.STORAGE,
        quotaLimit: 1024 * 1024 * 1024, // 1GB
      },
      {
        tenantId,
        quotaType: QuotaType.BANDWIDTH,
        quotaLimit: 10 * 1024 * 1024 * 1024, // 10GB
      },
      {
        tenantId,
        quotaType: QuotaType.USERS,
        quotaLimit: 10,
      },
      {
        tenantId,
        quotaType: QuotaType.CONTENTS,
        quotaLimit: 1000,
      },
      {
        tenantId,
        quotaType: QuotaType.API_CALLS,
        quotaLimit: 10000,
      },
    ];

    await this.quotaRepository.save(defaultQuotas);
  }

  /**
   * 查询所有租户
   */
  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID查询租户
   */
  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException('租户不存在');
    }

    return tenant;
  }

  /**
   * 根据代码查询租户
   */
  async findByCode(code: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { code } });

    if (!tenant) {
      throw new NotFoundException('租户不存在');
    }

    return tenant;
  }

  /**
   * 检查配额是否超限
   */
  async checkQuota(
    tenantId: number,
    quotaType: QuotaType,
    increment: number = 1,
  ): Promise<boolean> {
    const quota = await this.quotaRepository.findOne({
      where: { tenantId, quotaType },
    });

    if (!quota) {
      return false;
    }

    return quota.quotaUsed + increment <= quota.quotaLimit;
  }

  /**
   * 增加配额使用量
   */
  async incrementQuota(
    tenantId: number,
    quotaType: QuotaType,
    increment: number = 1,
  ): Promise<void> {
    await this.quotaRepository.increment(
      { tenantId, quotaType },
      'quotaUsed',
      increment,
    );
  }

  /**
   * 减少配额使用量
   */
  async decrementQuota(
    tenantId: number,
    quotaType: QuotaType,
    decrement: number = 1,
  ): Promise<void> {
    await this.quotaRepository.decrement(
      { tenantId, quotaType },
      'quotaUsed',
      decrement,
    );
  }
}
