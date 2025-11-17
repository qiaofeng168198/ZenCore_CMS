import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertSeverity, AlertStatus } from './entities/alert.entity';
import { AlertRule } from './entities/alert-rule.entity';
import { MonitoringService } from './monitoring.service';
import * as nodemailer from 'nodemailer';

export interface AlertNotification {
  type: string;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  metadata?: any;
}

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly emailTransporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
    private readonly monitoringService: MonitoringService,
  ) {
    // 配置邮件发送器（实际使用时从配置文件读取）
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'alerts@example.com',
        pass: process.env.SMTP_PASS || 'password',
      },
    });
  }

  /**
   * 定时检查系统告警（每分钟执行一次）
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkSystemAlerts() {
    try {
      const alerts = await this.monitoringService.checkAlerts();

      for (const alert of alerts) {
        await this.createAlert({
          type: alert.type,
          severity: alert.severity as AlertSeverity,
          message: alert.message,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Failed to check system alerts', error);
    }
  }

  /**
   * 创建告警
   */
  async createAlert(notification: AlertNotification): Promise<Alert> {
    // 检查是否存在相同的未解决告警（防止重复告警）
    const existingAlert = await this.alertRepository.findOne({
      where: {
        type: notification.type,
        status: AlertStatus.OPEN,
      },
      order: { createdAt: 'DESC' },
    });

    // 如果5分钟内有相同的告警，不创建新告警
    if (existingAlert) {
      const timeDiff = Date.now() - existingAlert.createdAt.getTime();
      if (timeDiff < 5 * 60 * 1000) {
        this.logger.debug(`Skipping duplicate alert: ${notification.type}`);
        return existingAlert;
      }
    }

    // 创建新告警
    const alert = this.alertRepository.create({
      type: notification.type,
      severity: notification.severity,
      message: notification.message,
      metadata: notification.metadata,
      status: AlertStatus.OPEN,
    });

    const savedAlert = await this.alertRepository.save(alert);

    // 发送通知
    await this.sendNotifications(savedAlert);

    this.logger.warn(
      `Alert created: [${savedAlert.severity}] ${savedAlert.type} - ${savedAlert.message}`,
    );

    return savedAlert;
  }

  /**
   * 发送告警通知
   */
  private async sendNotifications(alert: Alert) {
    // 获取告警规则
    const rules = await this.alertRuleRepository.find({
      where: { enabled: true },
    });

    for (const rule of rules) {
      // 检查告警类型和严重程度是否匹配规则
      if (this.matchesRule(alert, rule)) {
        // 发送邮件通知
        if (rule.notifyEmail && rule.emailRecipients) {
          await this.sendEmailNotification(alert, rule.emailRecipients);
        }

        // 发送Webhook通知
        if (rule.notifyWebhook && rule.webhookUrl) {
          await this.sendWebhookNotification(alert, rule.webhookUrl);
        }

        // 发送短信通知（需要集成短信服务）
        if (rule.notifySms && rule.smsRecipients) {
          // await this.sendSmsNotification(alert, rule.smsRecipients);
          this.logger.log('SMS notification skipped (not implemented)');
        }
      }
    }
  }

  /**
   * 检查告警是否匹配规则
   */
  private matchesRule(alert: Alert, rule: AlertRule): boolean {
    // 检查严重程度
    const severityOrder = ['info', 'warning', 'critical'];
    const alertSeverityLevel = severityOrder.indexOf(alert.severity);
    const ruleSeverityLevel = severityOrder.indexOf(rule.severity);

    if (alertSeverityLevel < ruleSeverityLevel) {
      return false;
    }

    // 检查告警类型（如果规则指定了类型）
    if (rule.alertTypes && rule.alertTypes.length > 0) {
      if (!rule.alertTypes.includes(alert.type)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 发送邮件通知
   */
  private async sendEmailNotification(alert: Alert, recipients: string) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'alerts@example.com',
        to: recipients,
        subject: `[${alert.severity.toUpperCase()}] ${alert.type} Alert`,
        html: `
          <h2>系统告警通知</h2>
          <p><strong>告警类型:</strong> ${alert.type}</p>
          <p><strong>严重程度:</strong> ${alert.severity}</p>
          <p><strong>告警消息:</strong> ${alert.message}</p>
          <p><strong>发生时间:</strong> ${alert.createdAt.toLocaleString()}</p>
          ${alert.metadata ? `<p><strong>详细信息:</strong> <pre>${JSON.stringify(alert.metadata, null, 2)}</pre></p>` : ''}
        `,
      };

      await this.emailTransporter.sendMail(mailOptions);
      this.logger.log(`Email notification sent for alert ${alert.id}`);
    } catch (error) {
      this.logger.error('Failed to send email notification', error);
    }
  }

  /**
   * 发送Webhook通知
   */
  private async sendWebhookNotification(alert: Alert, webhookUrl: string) {
    try {
      const payload = {
        alert_id: alert.id,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.createdAt.toISOString(),
        metadata: alert.metadata,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        this.logger.log(`Webhook notification sent for alert ${alert.id}`);
      } else {
        this.logger.error(`Webhook notification failed: ${response.statusText}`);
      }
    } catch (error) {
      this.logger.error('Failed to send webhook notification', error);
    }
  }

  /**
   * 获取告警列表
   */
  async getAlerts(
    page: number = 1,
    pageSize: number = 20,
    status?: AlertStatus,
    severity?: AlertSeverity,
  ): Promise<{ data: Alert[]; total: number }> {
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (severity) {
      where.severity = severity;
    }

    const [data, total] = await this.alertRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total };
  }

  /**
   * 确认告警
   */
  async acknowledgeAlert(id: number, acknowledgedBy: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();

    return this.alertRepository.save(alert);
  }

  /**
   * 解决告警
   */
  async resolveAlert(id: number, resolvedBy: string, resolution: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedBy = resolvedBy;
    alert.resolvedAt = new Date();
    alert.resolution = resolution;

    return this.alertRepository.save(alert);
  }

  /**
   * 获取告警统计
   */
  async getAlertStats() {
    const total = await this.alertRepository.count();
    const open = await this.alertRepository.count({
      where: { status: AlertStatus.OPEN },
    });
    const acknowledged = await this.alertRepository.count({
      where: { status: AlertStatus.ACKNOWLEDGED },
    });
    const resolved = await this.alertRepository.count({
      where: { status: AlertStatus.RESOLVED },
    });

    const bySeverity = await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where('alert.status != :status', { status: AlertStatus.RESOLVED })
      .groupBy('alert.severity')
      .getRawMany();

    return {
      total,
      open,
      acknowledged,
      resolved,
      bySeverity,
    };
  }

  /**
   * 清理旧告警（保留30天）
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldAlerts() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.alertRepository
        .createQueryBuilder()
        .delete()
        .where('status = :status', { status: AlertStatus.RESOLVED })
        .andWhere('resolvedAt < :date', { date: thirtyDaysAgo })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} old alerts`);
    } catch (error) {
      this.logger.error('Failed to cleanup old alerts', error);
    }
  }
}
