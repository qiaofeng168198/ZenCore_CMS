import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
  DELETED = 'deleted',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.ACTIVE,
  })
  status: TenantStatus;

  @Column({ length: 255, nullable: true, unique: true })
  domain: string;

  @Column({ length: 100, nullable: true, unique: true })
  subdomain: string;

  @Column({ length: 500, nullable: true })
  logo: string;

  @Column({ name: 'contact_name', length: 50, nullable: true })
  contactName: string;

  @Column({ name: 'contact_email', length: 100, nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'agent_id', type: 'bigint', unsigned: true, nullable: true })
  agentId: number;

  @Column({ name: 'expired_at', type: 'datetime', nullable: true })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
