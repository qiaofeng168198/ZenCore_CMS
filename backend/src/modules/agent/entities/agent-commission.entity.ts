import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agent } from './agent.entity';

export enum CommissionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('agent_commissions')
export class AgentCommission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'agent_id' })
  agentId: number;

  @ManyToOne(() => Agent)
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number;

  @Column({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2 })
  commissionAmount: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ name: 'settled_at', type: 'timestamp', nullable: true })
  settledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
