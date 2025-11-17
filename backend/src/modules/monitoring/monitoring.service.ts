import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import * as os from 'os';
import * as fs from 'fs';

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
  };
  disk: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
  };
  uptime: number;
  loadAverage: number[];
}

@Injectable()
export class MonitoringService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private connection: Connection,
  ) {}

  /**
   * 执行健康检查
   */
  @HealthCheck()
  async checkHealth() {
    return this.health.check([
      // 数据库健康检查
      () => this.db.pingCheck('database'),
      // HTTP健康检查（可选外部服务）
      // () => this.http.pingCheck('external-service', 'https://api.example.com'),
    ]);
  }

  /**
   * 获取系统指标
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const cpuUsage = this.getCpuUsage();
    const memoryInfo = this.getMemoryInfo();
    const diskInfo = await this.getDiskInfo();

    return {
      cpu: {
        usage: cpuUsage,
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
      },
      memory: memoryInfo,
      disk: diskInfo,
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
    };
  }

  /**
   * 获取CPU使用率
   */
  private getCpuUsage(): number {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - (100 * idle / total);

    return Math.round(usage * 100) / 100;
  }

  /**
   * 获取内存信息
   */
  private getMemoryInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercent = (usedMemory / totalMemory) * 100;

    return {
      total: Math.round(totalMemory / 1024 / 1024), // MB
      free: Math.round(freeMemory / 1024 / 1024),
      used: Math.round(usedMemory / 1024 / 1024),
      usagePercent: Math.round(usagePercent * 100) / 100,
    };
  }

  /**
   * 获取磁盘信息
   */
  private async getDiskInfo() {
    try {
      const stats = fs.statfsSync('/');
      const total = stats.blocks * stats.bsize;
      const free = stats.bfree * stats.bsize;
      const used = total - free;
      const usagePercent = (used / total) * 100;

      return {
        total: Math.round(total / 1024 / 1024 / 1024), // GB
        free: Math.round(free / 1024 / 1024 / 1024),
        used: Math.round(used / 1024 / 1024 / 1024),
        usagePercent: Math.round(usagePercent * 100) / 100,
      };
    } catch (error) {
      return {
        total: 0,
        free: 0,
        used: 0,
        usagePercent: 0,
      };
    }
  }

  /**
   * 获取数据库状态
   */
  async getDatabaseMetrics() {
    const isConnected = this.connection.isConnected;

    // 获取数据库连接池信息（如果有）
    let poolInfo: any = {};
    try {
      const queryRunner = this.connection.createQueryRunner();

      // 查询数据库大小
      const dbSize = await queryRunner.query(`
        SELECT
          table_schema AS 'database',
          SUM(data_length + index_length) / 1024 / 1024 AS 'size_mb'
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        GROUP BY table_schema
      `);

      // 查询连接数
      const connections = await queryRunner.query(`
        SHOW STATUS WHERE variable_name IN ('Threads_connected', 'Max_used_connections', 'Threads_running')
      `);

      await queryRunner.release();

      poolInfo = {
        size: dbSize[0]?.size_mb || 0,
        connections: connections.reduce((acc, item) => {
          acc[item.Variable_name] = item.Value;
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error('Failed to get database metrics:', error);
    }

    return {
      isConnected,
      ...poolInfo,
    };
  }

  /**
   * 获取应用指标
   */
  async getApplicationMetrics() {
    const processMemory = process.memoryUsage();

    return {
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: {
          rss: Math.round(processMemory.rss / 1024 / 1024), // MB
          heapTotal: Math.round(processMemory.heapTotal / 1024 / 1024),
          heapUsed: Math.round(processMemory.heapUsed / 1024 / 1024),
          external: Math.round(processMemory.external / 1024 / 1024),
        },
        cpu: process.cpuUsage(),
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
  }

  /**
   * 检查系统告警条件
   */
  async checkAlerts(): Promise<Array<{ type: string; message: string; severity: string }>> {
    const alerts: Array<{ type: string; message: string; severity: string }> = [];

    const systemMetrics = await this.getSystemMetrics();
    const dbMetrics = await this.getDatabaseMetrics();

    // CPU告警
    if (systemMetrics.cpu.usage > 90) {
      alerts.push({
        type: 'cpu',
        message: `CPU使用率过高: ${systemMetrics.cpu.usage}%`,
        severity: 'critical',
      });
    } else if (systemMetrics.cpu.usage > 80) {
      alerts.push({
        type: 'cpu',
        message: `CPU使用率较高: ${systemMetrics.cpu.usage}%`,
        severity: 'warning',
      });
    }

    // 内存告警
    if (systemMetrics.memory.usagePercent > 90) {
      alerts.push({
        type: 'memory',
        message: `内存使用率过高: ${systemMetrics.memory.usagePercent}%`,
        severity: 'critical',
      });
    } else if (systemMetrics.memory.usagePercent > 80) {
      alerts.push({
        type: 'memory',
        message: `内存使用率较高: ${systemMetrics.memory.usagePercent}%`,
        severity: 'warning',
      });
    }

    // 磁盘告警
    if (systemMetrics.disk.usagePercent > 90) {
      alerts.push({
        type: 'disk',
        message: `磁盘使用率过高: ${systemMetrics.disk.usagePercent}%`,
        severity: 'critical',
      });
    } else if (systemMetrics.disk.usagePercent > 80) {
      alerts.push({
        type: 'disk',
        message: `磁盘使用率较高: ${systemMetrics.disk.usagePercent}%`,
        severity: 'warning',
      });
    }

    // 数据库连接告警
    if (!dbMetrics.isConnected) {
      alerts.push({
        type: 'database',
        message: '数据库连接断开',
        severity: 'critical',
      });
    }

    return alerts;
  }
}
