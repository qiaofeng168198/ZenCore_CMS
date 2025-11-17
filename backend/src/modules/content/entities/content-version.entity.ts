import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ContentType } from './content.entity';

@Entity('content_versions')
export class ContentVersion {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'content_id', type: 'bigint', unsigned: true })
  contentId: number;

  @Column({ type: 'int' })
  version: number;

  @Column({ length: 255 })
  title: string;

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

  @Column({ name: 'created_by', type: 'bigint', unsigned: true })
  createdBy: number;

  @Column({ name: 'change_log', type: 'text', nullable: true })
  changeLog: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
