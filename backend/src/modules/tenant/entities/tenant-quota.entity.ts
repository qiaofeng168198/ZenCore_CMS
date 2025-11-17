import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export enum QuotaType {
  STORAGE = 'storage',
  BANDWIDTH = 'bandwidth',
  USERS = 'users',
  CONTENTS = 'contents',
  API_CALLS = 'api_calls',
}

export enum ResetCycle {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  NEVER = 'never',
}

@Entity('tenant_quotas')
export class TenantQuota {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true })
  tenantId: number;

  @Column({
    name: 'quota_type',
    type: 'enum',
    enum: QuotaType,
  })
  quotaType: QuotaType;

  @Column({ name: 'quota_limit', type: 'bigint', default: 0 })
  quotaLimit: number;

  @Column({ name: 'quota_used', type: 'bigint', default: 0 })
  quotaUsed: number;

  @Column({
    name: 'reset_cycle',
    type: 'enum',
    enum: ResetCycle,
    default: ResetCycle.MONTHLY,
  })
  resetCycle: ResetCycle;

  @Column({ name: 'last_reset_at', type: 'datetime', nullable: true })
  lastResetAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
