import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AgentLevel } from '../dto/create-agent.dto';

export enum AgentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: AgentLevel,
    default: AgentLevel.PARTNER,
  })
  level: AgentLevel;

  @Column({ name: 'parent_id', type: 'bigint', unsigned: true, nullable: true })
  parentId: number;

  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Agent;

  @OneToMany(() => Agent, agent => agent.parent)
  children: Agent[];

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, nullable: true })
  userId: number;

  @Column({ name: 'contact_name', length: 100 })
  contactName: string;

  @Column({ name: 'contact_phone', length: 20 })
  contactPhone: string;

  @Column({ name: 'contact_email', length: 100, nullable: true })
  contactEmail: string;

  @Column({ name: 'region_province', length: 50, nullable: true })
  regionProvince: string;

  @Column({ name: 'region_city', length: 50, nullable: true })
  regionCity: string;

  @Column({ name: 'region_district', length: 50, nullable: true })
  regionDistrict: string;

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

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ name: 'contract_start', type: 'date', nullable: true })
  contractStart: Date;

  @Column({ name: 'contract_end', type: 'date', nullable: true })
  contractEnd: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
