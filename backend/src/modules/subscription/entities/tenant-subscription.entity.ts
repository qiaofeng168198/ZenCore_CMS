import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { BillingCycle } from '../dto/subscribe.dto';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

@Entity('tenant_subscriptions')
export class TenantSubscription {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true })
  tenantId: number;

  @Column({ name: 'plan_id', type: 'bigint', unsigned: true })
  planId: number;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @Column({
    name: 'billing_cycle',
    type: 'enum',
    enum: BillingCycle,
  })
  billingCycle: BillingCycle;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'auto_renew', type: 'boolean', default: true })
  autoRenew: boolean;

  @Column({ name: 'current_users', type: 'int', default: 0 })
  currentUsers: number;

  @Column({ name: 'current_storage', type: 'bigint', default: 0, comment: '当前使用存储(MB)' })
  currentStorage: number;

  @Column({ name: 'current_bandwidth', type: 'bigint', default: 0, comment: '当前月度带宽使用(GB)' })
  currentBandwidth: number;

  @Column({ name: 'current_contents', type: 'int', default: 0 })
  currentContents: number;

  @Column({ name: 'last_billing_date', type: 'timestamp', nullable: true })
  lastBillingDate: Date;

  @Column({ name: 'next_billing_date', type: 'timestamp', nullable: true })
  nextBillingDate: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
