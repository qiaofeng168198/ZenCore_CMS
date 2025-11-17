import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ContentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  OFFLINE = 'offline',
}

export enum ContentType {
  RICHTEXT = 'richtext',
  MARKDOWN = 'markdown',
  HTML = 'html',
}

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true })
  tenantId: number;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true, nullable: true })
  categoryId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @Column({
    name: 'content_type',
    type: 'enum',
    enum: ContentType,
    default: ContentType.RICHTEXT,
  })
  contentType: ContentType;

  @Column({ name: 'cover_image', length: 500, nullable: true })
  coverImage: string;

  @Column({ name: 'author_id', type: 'bigint', unsigned: true })
  authorId: number;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ name: 'publish_at', type: 'datetime', nullable: true })
  publishAt: Date;

  @Column({ name: 'offline_at', type: 'datetime', nullable: true })
  offlineAt: Date;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', type: 'int', default: 0 })
  likeCount: number;

  @Column({ name: 'is_top', type: 'boolean', default: false })
  isTop: boolean;

  @Column({ name: 'is_recommended', type: 'boolean', default: false })
  isRecommended: boolean;

  @Column({ name: 'seo_title', length: 255, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_keywords', length: 255, nullable: true })
  seoKeywords: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string;

  @Column({ length: 10, default: 'zh-CN' })
  language: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
