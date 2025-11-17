import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum TemplateStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OFFLINE = 'offline',
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'developer_id', type: 'bigint', unsigned: true })
  developerId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20 })
  version: string;

  @Column({ name: 'cover_image', length: 500, nullable: true })
  coverImage: string;

  @Column({ name: 'preview_url', length: 500, nullable: true })
  previewUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ length: 255, nullable: true })
  tags: string;

  @Column({
    type: 'enum',
    enum: TemplateStatus,
    default: TemplateStatus.DRAFT,
  })
  status: TemplateStatus;

  @Column({ name: 'is_responsive', type: 'boolean', default: true })
  isResponsive: boolean;

  @Column({ name: 'support_mobile', type: 'boolean', default: true })
  supportMobile: boolean;

  @Column({ name: 'support_miniprogram', type: 'boolean', default: false })
  supportMiniprogram: boolean;

  @Column({ name: 'download_count', type: 'int', default: 0 })
  downloadCount: number;

  @Column({ name: 'rating_score', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingScore: number;

  @Column({ name: 'rating_count', type: 'int', default: 0 })
  ratingCount: number;

  @Column({ name: 'file_path', length: 500, nullable: true })
  filePath: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 30 })
  commissionRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
