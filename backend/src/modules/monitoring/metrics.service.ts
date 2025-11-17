import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly registry: Registry;

  // HTTP请求指标
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDuration: Histogram;
  private readonly httpRequestSize: Histogram;
  private readonly httpResponseSize: Histogram;

  // 业务指标
  private readonly activeUsers: Gauge;
  private readonly activeTenants: Gauge;
  private readonly totalContents: Gauge;
  private readonly totalOrders: Gauge;

  // 系统指标
  private readonly cpuUsage: Gauge;
  private readonly memoryUsage: Gauge;
  private readonly diskUsage: Gauge;

  // 错误指标
  private readonly errorCount: Counter;
  private readonly errorRate: Gauge;

  constructor() {
    this.registry = new Registry();

    // HTTP指标
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
      registers: [this.registry],
    });

    this.httpRequestSize = new Histogram({
      name: 'http_request_size_bytes',
      help: 'Size of HTTP requests in bytes',
      labelNames: ['method', 'route'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
      registers: [this.registry],
    });

    this.httpResponseSize = new Histogram({
      name: 'http_response_size_bytes',
      help: 'Size of HTTP responses in bytes',
      labelNames: ['method', 'route'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
      registers: [this.registry],
    });

    // 业务指标
    this.activeUsers = new Gauge({
      name: 'active_users_total',
      help: 'Total number of active users',
      registers: [this.registry],
    });

    this.activeTenants = new Gauge({
      name: 'active_tenants_total',
      help: 'Total number of active tenants',
      registers: [this.registry],
    });

    this.totalContents = new Gauge({
      name: 'total_contents',
      help: 'Total number of contents',
      registers: [this.registry],
    });

    this.totalOrders = new Gauge({
      name: 'total_orders',
      help: 'Total number of orders',
      registers: [this.registry],
    });

    // 系统指标
    this.cpuUsage = new Gauge({
      name: 'system_cpu_usage_percent',
      help: 'System CPU usage percentage',
      registers: [this.registry],
    });

    this.memoryUsage = new Gauge({
      name: 'system_memory_usage_percent',
      help: 'System memory usage percentage',
      registers: [this.registry],
    });

    this.diskUsage = new Gauge({
      name: 'system_disk_usage_percent',
      help: 'System disk usage percentage',
      registers: [this.registry],
    });

    // 错误指标
    this.errorCount = new Counter({
      name: 'errors_total',
      help: 'Total number of errors',
      labelNames: ['type', 'route'],
      registers: [this.registry],
    });

    this.errorRate = new Gauge({
      name: 'error_rate',
      help: 'Error rate (errors per second)',
      registers: [this.registry],
    });
  }

  /**
   * 记录HTTP请求
   */
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number, requestSize: number, responseSize: number) {
    this.httpRequestsTotal.labels(method, route, statusCode.toString()).inc();
    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(duration);
    this.httpRequestSize.labels(method, route).observe(requestSize);
    this.httpResponseSize.labels(method, route).observe(responseSize);
  }

  /**
   * 更新业务指标
   */
  updateBusinessMetrics(metrics: {
    activeUsers?: number;
    activeTenants?: number;
    totalContents?: number;
    totalOrders?: number;
  }) {
    if (metrics.activeUsers !== undefined) {
      this.activeUsers.set(metrics.activeUsers);
    }
    if (metrics.activeTenants !== undefined) {
      this.activeTenants.set(metrics.activeTenants);
    }
    if (metrics.totalContents !== undefined) {
      this.totalContents.set(metrics.totalContents);
    }
    if (metrics.totalOrders !== undefined) {
      this.totalOrders.set(metrics.totalOrders);
    }
  }

  /**
   * 更新系统指标
   */
  updateSystemMetrics(metrics: {
    cpuUsage?: number;
    memoryUsage?: number;
    diskUsage?: number;
  }) {
    if (metrics.cpuUsage !== undefined) {
      this.cpuUsage.set(metrics.cpuUsage);
    }
    if (metrics.memoryUsage !== undefined) {
      this.memoryUsage.set(metrics.memoryUsage);
    }
    if (metrics.diskUsage !== undefined) {
      this.diskUsage.set(metrics.diskUsage);
    }
  }

  /**
   * 记录错误
   */
  recordError(type: string, route: string) {
    this.errorCount.labels(type, route).inc();
  }

  /**
   * 更新错误率
   */
  updateErrorRate(rate: number) {
    this.errorRate.set(rate);
  }

  /**
   * 获取所有指标
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * 获取指标的JSON格式
   */
  async getMetricsJSON(): Promise<any> {
    const metrics = await this.registry.getMetricsAsJSON();
    return metrics;
  }
}
