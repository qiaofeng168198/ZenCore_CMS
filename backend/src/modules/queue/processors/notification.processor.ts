import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationJob } from '../queue.service';

@Processor('notification')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process('send')
  async handleSendNotification(job: Job<NotificationJob>) {
    this.logger.log(`Processing notification job ${job.id}`);

    try {
      const { userId, type, title, content, data } = job.data;

      // 这里实现通知逻辑
      // 可以是站内通知、推送通知等

      this.logger.log(`Notification sent to user ${userId}: ${title}`);

      await job.progress(100);

      return { success: true, userId, type };
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
      throw error;
    }
  }
}
