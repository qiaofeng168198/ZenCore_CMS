import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

@Entity('system_logs')
@Index(['level', 'createdAt'])
@Index(['context', 'createdAt'])
export class SystemLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({
    type: 'enum',
    enum: LogLevel,
  })
  level: LogLevel;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 100, nullable: true })
  context: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
