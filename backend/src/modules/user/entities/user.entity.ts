import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  LOCKED = 'locked',
}

export enum UserType {
  SUPER_ADMIN = 'super_admin',
  AGENT = 'agent',
  TENANT_ADMIN = 'tenant_admin',
  TENANT_USER = 'tenant_user',
  DEVELOPER = 'developer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, nullable: true })
  tenantId: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'last_login_ip', length: 45, nullable: true })
  lastLoginIp: string;

  @Column({ name: 'login_failed_count', type: 'int', default: 0 })
  loginFailedCount: number;

  @Column({ name: 'locked_until', type: 'datetime', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'two_factor_enabled', type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', length: 255, nullable: true })
  twoFactorSecret: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
