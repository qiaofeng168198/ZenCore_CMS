import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

export interface EmailJob {
  to: string;
  subject: string;
  template: string;
  data: any;
}

export interface NotificationJob {
  userId: number;
  type: string;
  title: string;
  content: string;
  data?: any;
}

export interface ReportJob {
  type: string;
  params: any;
  userId: number;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('notification') private notificationQueue: Queue,
    @InjectQueue('report') private reportQueue: Queue,
  ) {}

  /**
   * 添加邮件发送任务
   */
  async sendEmail(job: EmailJob, priority: number = 0): Promise<Job> {
    return this.emailQueue.add('send', job, {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  /**
   * 批量发送邮件
   */
  async sendBulkEmails(jobs: EmailJob[]): Promise<Job[]> {
    const bulkJobs = jobs.map(job => ({
      name: 'send',
      data: job,
      opts: {
        priority: 1,
        attempts: 3,
      },
    }));

    return this.emailQueue.addBulk(bulkJobs);
  }

  /**
   * 添加通知任务
   */
  async sendNotification(job: NotificationJob): Promise<Job> {
    return this.notificationQueue.add('send', job, {
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
    });
  }

  /**
   * 批量发送通知
   */
  async sendBulkNotifications(jobs: NotificationJob[]): Promise<Job[]> {
    const bulkJobs = jobs.map(job => ({
      name: 'send',
      data: job,
    }));

    return this.notificationQueue.addBulk(bulkJobs);
  }

  /**
   * 生成报表（延迟执行）
   */
  async generateReport(job: ReportJob, delay: number = 0): Promise<Job> {
    return this.reportQueue.add('generate', job, {
      delay,
      attempts: 2,
      timeout: 300000, // 5分钟超时
    });
  }

  /**
   * 定时生成报表
   */
  async scheduleReport(job: ReportJob, cron: string): Promise<Job> {
    return this.reportQueue.add('generate', job, {
      repeat: {
        cron,
      },
    });
  }

  /**
   * 获取队列状态
   */
  async getQueueStats(queueName: 'email' | 'notification' | 'report') {
    const queue = this.getQueue(queueName);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * 获取失败的任务
   */
  async getFailedJobs(queueName: 'email' | 'notification' | 'report', start = 0, end = 10) {
    const queue = this.getQueue(queueName);
    return queue.getFailed(start, end);
  }

  /**
   * 重试失败的任务
   */
  async retryFailedJob(queueName: 'email' | 'notification' | 'report', jobId: string) {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);

    if (job) {
      await job.retry();
      return true;
    }

    return false;
  }

  /**
   * 清理已完成的任务
   */
  async cleanCompleted(queueName: 'email' | 'notification' | 'report', grace: number = 3600000) {
    const queue = this.getQueue(queueName);
    await queue.clean(grace, 'completed');
  }

  /**
   * 清空队列
   */
  async emptyQueue(queueName: 'email' | 'notification' | 'report') {
    const queue = this.getQueue(queueName);
    await queue.empty();
  }

  /**
   * 暂停队列
   */
  async pauseQueue(queueName: 'email' | 'notification' | 'report') {
    const queue = this.getQueue(queueName);
    await queue.pause();
  }

  /**
   * 恢复队列
   */
  async resumeQueue(queueName: 'email' | 'notification' | 'report') {
    const queue = this.getQueue(queueName);
    await queue.resume();
  }

  /**
   * 获取队列实例
   */
  private getQueue(queueName: 'email' | 'notification' | 'report'): Queue {
    switch (queueName) {
      case 'email':
        return this.emailQueue;
      case 'notification':
        return this.notificationQueue;
      case 'report':
        return this.reportQueue;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }
  }
}
