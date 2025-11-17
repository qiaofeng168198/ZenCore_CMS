import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog, LogLevel } from './entities/system-log.entity';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly winstonLogger: winston.Logger;

  constructor(
    @InjectRepository(SystemLog)
    private readonly logRepository: Repository<SystemLog>,
  ) {
    // 配置Winston日志记录器
    this.winstonLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        // 控制台输出
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, context, trace }) => {
              return `${timestamp} [${context}] ${level}: ${message}${trace ? '\n' + trace : ''}`;
            }),
          ),
        }),

        // 按日期轮转的文件日志 - 所有级别
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),

        // 错误日志单独文件
        new DailyRotateFile({
          level: 'error',
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  /**
   * 记录日志到数据库
   */
  private async saveToDatabase(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: any,
  ) {
    try {
      const log = this.logRepository.create({
        level,
        message,
        context,
        metadata,
      });
      await this.logRepository.save(log);
    } catch (error) {
      // 如果数据库保存失败，只记录到文件，避免循环错误
      this.winstonLogger.error('Failed to save log to database', { error });
    }
  }

  log(message: any, context?: string) {
    this.winstonLogger.info(message, { context });
    // 不将普通日志保存到数据库，避免过多
  }

  error(message: any, trace?: string, context?: string) {
    this.winstonLogger.error(message, { trace, context });
    this.saveToDatabase(LogLevel.ERROR, message, context, { trace });
  }

  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, { context });
    // 警告级别选择性保存
    if (this.shouldSaveToDatabase(message)) {
      this.saveToDatabase(LogLevel.WARN, message, context);
    }
  }

  debug(message: any, context?: string) {
    this.winstonLogger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.winstonLogger.verbose(message, { context });
  }

  /**
   * 判断是否应该保存到数据库
   */
  private shouldSaveToDatabase(message: string): boolean {
    // 可以根据消息内容决定是否保存
    const keywords = ['failed', 'error', 'critical', 'timeout', 'exception'];
    return keywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  /**
   * 查询日志
   */
  async getLogs(
    page: number = 1,
    pageSize: number = 50,
    level?: LogLevel,
    context?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ data: SystemLog[]; total: number }> {
    const queryBuilder = this.logRepository.createQueryBuilder('log');

    if (level) {
      queryBuilder.andWhere('log.level = :level', { level });
    }

    if (context) {
      queryBuilder.andWhere('log.context LIKE :context', { context: `%${context}%` });
    }

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    queryBuilder.orderBy('log.createdAt', 'DESC');

    const [data, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * 获取日志统计
   */
  async getLogStats(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.logRepository.createQueryBuilder('log');

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    // 按级别统计
    const byLevel = await queryBuilder
      .select('log.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.level')
      .getRawMany();

    // 按上下文统计
    const byContext = await queryBuilder
      .select('log.context', 'context')
      .addSelect('COUNT(*)', 'count')
      .where('log.context IS NOT NULL')
      .groupBy('log.context')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // 按时间统计（每小时）
    const byHour = await queryBuilder
      .select('DATE_FORMAT(log.createdAt, "%Y-%m-%d %H:00:00")', 'hour')
      .addSelect('COUNT(*)', 'count')
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return {
      byLevel,
      byContext,
      byHour,
    };
  }

  /**
   * 搜索错误日志
   */
  async searchErrors(
    keyword: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ data: SystemLog[]; total: number }> {
    const [data, total] = await this.logRepository.findAndCount({
      where: [
        { level: LogLevel.ERROR },
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 过滤包含关键词的日志
    const filtered = data.filter(log =>
      log.message.toLowerCase().includes(keyword.toLowerCase()),
    );

    return {
      data: filtered,
      total: filtered.length,
    };
  }

  /**
   * 清理旧日志（保留90天）
   */
  async cleanupOldLogs() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await this.logRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :date', { date: ninetyDaysAgo })
      .execute();

    this.winstonLogger.info(`Cleaned up ${result.affected} old logs`);
  }
}
