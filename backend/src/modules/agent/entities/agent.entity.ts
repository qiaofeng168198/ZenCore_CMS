import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AgentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, unique: true })
  userId: number;

  @Column({ name: 'parent_id', type: 'bigint', unsigned: true, nullable: true })
  parentId: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ name: 'company_name', length: 200, nullable: true })
  companyName: string;

  @Column({ length: 100, nullable: true })
  region: string;

  @Column({
    type: 'enum',
    enum: AgentStatus,
    default: AgentStatus.ACTIVE,
  })
  status: AgentStatus;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 20 })
  commissionRate: number;

  @Column({ name: 'total_customers', type: 'int', default: 0 })
  totalCustomers: number;

  @Column({ name: 'active_customers', type: 'int', default: 0 })
  activeCustomers: number;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ name: 'total_commission', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCommission: number;

  @Column({ name: 'contract_start', type: 'date', nullable: true })
  contractStart: Date;

  @Column({ name: 'contract_end', type: 'date', nullable: true })
  contractEnd: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
