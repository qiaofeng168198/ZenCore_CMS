import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ReportJob } from '../queue.service';

@Processor('report')
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  @Process('generate')
  async handleGenerateReport(job: Job<ReportJob>) {
    this.logger.log(`Processing report job ${job.id}`);

    try {
      const { type, params, userId } = job.data;

      // 报表生成逻辑
      await job.progress(10);

      // 模拟数据收集
      this.logger.log(`Collecting data for ${type} report...`);
      await job.progress(30);

      // 模拟数据处理
      this.logger.log(`Processing data...`);
      await job.progress(60);

      // 模拟报表生成
      this.logger.log(`Generating report file...`);
      await job.progress(90);

      this.logger.log(`Report ${type} generated for user ${userId}`);
      await job.progress(100);

      return { success: true, type, userId };
    } catch (error) {
      this.logger.error(`Failed to generate report: ${error.message}`, error.stack);
      throw error;
    }
  }
}
