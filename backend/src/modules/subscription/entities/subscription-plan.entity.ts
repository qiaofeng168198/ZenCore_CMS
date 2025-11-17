import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'monthly_price', type: 'decimal', precision: 10, scale: 2 })
  monthlyPrice: number;

  @Column({ name: 'yearly_price', type: 'decimal', precision: 10, scale: 2 })
  yearlyPrice: number;

  @Column({ name: 'max_users', type: 'int', default: -1, comment: '-1表示不限制' })
  maxUsers: number;

  @Column({ name: 'max_storage', type: 'bigint', default: -1, comment: '存储空间(MB)，-1表示不限制' })
  maxStorage: number;

  @Column({ name: 'max_bandwidth', type: 'bigint', default: -1, comment: '带宽(GB/月)，-1表示不限制' })
  maxBandwidth: number;

  @Column({ name: 'max_contents', type: 'int', default: -1, comment: '最大内容数，-1表示不限制' })
  maxContents: number;

  @Column({ name: 'custom_domain', type: 'boolean', default: false })
  customDomain: boolean;

  @Column({ name: 'api_access', type: 'boolean', default: false })
  apiAccess: boolean;

  @Column({ name: 'cdn_support', type: 'boolean', default: false })
  cdnSupport: boolean;

  @Column({ name: 'multi_language', type: 'boolean', default: false })
  multiLanguage: boolean;

  @Column({ type: 'int', default: 0, comment: '优先级，数字越大越靠前' })
  priority: number;

  @Column({ name: 'is_recommended', type: 'boolean', default: false })
  isRecommended: boolean;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.ACTIVE,
  })
  status: PlanStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
