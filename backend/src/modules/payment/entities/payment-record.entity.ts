import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  BANK = 'bank',
  BALANCE = 'balance',
}

@Entity('payment_records')
export class PaymentRecord {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'order_id', type: 'bigint', unsigned: true })
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'payment_no', length: 100, unique: true })
  paymentNo: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'transaction_id', length: 100, nullable: true })
  transactionId: string;

  @Column({ name: 'payment_url', type: 'text', nullable: true })
  paymentUrl: string;

  @Column({ name: 'qr_code', type: 'text', nullable: true })
  qrCode: string;

  @Column({ name: 'callback_data', type: 'json', nullable: true })
  callbackData: any;

  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ name: 'refund_no', length: 100, nullable: true })
  refundNo: string;

  @Column({ name: 'refund_at', type: 'timestamp', nullable: true })
  refundAt: Date;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
