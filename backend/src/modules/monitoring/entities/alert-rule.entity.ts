import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlertSeverity } from './alert.entity';

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.WARNING,
  })
  severity: AlertSeverity;

  @Column({ name: 'alert_types', type: 'json', nullable: true })
  alertTypes: string[];

  @Column({ name: 'notify_email', type: 'boolean', default: true })
  notifyEmail: boolean;

  @Column({ name: 'email_recipients', type: 'text', nullable: true })
  emailRecipients: string;

  @Column({ name: 'notify_webhook', type: 'boolean', default: false })
  notifyWebhook: boolean;

  @Column({ name: 'webhook_url', type: 'text', nullable: true })
  webhookUrl: string;

  @Column({ name: 'notify_sms', type: 'boolean', default: false })
  notifySms: boolean;

  @Column({ name: 'sms_recipients', type: 'text', nullable: true })
  smsRecipients: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
