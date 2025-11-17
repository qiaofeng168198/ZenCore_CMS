import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum StorageType {
  LOCAL = 'local',
  OSS = 'oss',
  MINIO = 'minio',
  CDN = 'cdn',
}

export enum UseType {
  CONTENT = 'content',
  TEMPLATE = 'template',
  AVATAR = 'avatar',
  OTHER = 'other',
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, nullable: true })
  tenantId: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_url', length: 500 })
  fileUrl: string;

  @Column({ name: 'file_type', length: 50 })
  fileType: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({
    name: 'storage_type',
    type: 'enum',
    enum: StorageType,
    default: StorageType.LOCAL,
  })
  storageType: StorageType;

  @Column({
    name: 'use_type',
    type: 'enum',
    enum: UseType,
    default: UseType.OTHER,
  })
  useType: UseType;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
