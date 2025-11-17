import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AuditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('content_audits')
export class ContentAudit {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'content_id', type: 'bigint', unsigned: true })
  contentId: number;

  @Column({ name: 'auditor_id', type: 'bigint', unsigned: true })
  auditorId: number;

  @Column({
    type: 'enum',
    enum: AuditStatus,
    default: AuditStatus.PENDING,
  })
  status: AuditStatus;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ name: 'audited_at', type: 'datetime', nullable: true })
  auditedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
