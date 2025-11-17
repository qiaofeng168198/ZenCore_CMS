import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderType {
  SUBSCRIPTION = 'subscription',
  TEMPLATE = 'template',
  VALUE_ADDED = 'value_added',
  RENEWAL = 'renewal',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'order_no', length: 50, unique: true })
  orderNo: string;

  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true })
  tenantId: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({
    name: 'order_type',
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  @Column({ name: 'item_id', type: 'bigint', unsigned: true })
  itemId: number;

  @Column({ name: 'item_name', length: 200 })
  itemName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'final_amount', type: 'decimal', precision: 10, scale: 2 })
  finalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ name: 'payment_no', length: 100, nullable: true })
  paymentNo: string;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true })
  paidAt: Date;

  @Column({ name: 'expired_at', type: 'datetime', nullable: true })
  expiredAt: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
