import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailJob } from '../queue.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send')
  async handleSendEmail(job: Job<EmailJob>) {
    this.logger.log(`Processing email job ${job.id}`);

    try {
      const { to, subject, template, data } = job.data;

      // 这里集成实际的邮件发送服务
      // 例如: await this.emailService.send(to, subject, template, data);

      this.logger.log(`Email sent to ${to}: ${subject}`);

      // 更新进度
      await job.progress(100);

      return { success: true, to, subject };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }
}
