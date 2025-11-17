import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../metrics.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const { method, url, body, headers } = request;
    const route = this.extractRoute(url);
    const requestSize = this.calculateSize(JSON.stringify(body || {}));

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          const responseSize = this.calculateSize(JSON.stringify(data || {}));

          // 记录指标
          this.metricsService.recordHttpRequest(
            method,
            route,
            statusCode,
            duration,
            requestSize,
            responseSize,
          );

          // 记录慢请求
          if (duration > 1000) {
            this.logger.warn(
              `Slow request detected: ${method} ${route} took ${duration}ms`,
            );
          }

          // 记录大响应
          if (responseSize > 1000000) {
            this.logger.warn(
              `Large response detected: ${method} ${route} size ${responseSize} bytes`,
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode || 500;

          // 记录错误指标
          this.metricsService.recordHttpRequest(
            method,
            route,
            statusCode,
            duration,
            requestSize,
            0,
          );

          this.metricsService.recordError(
            error.name || 'UnknownError',
            route,
          );

          this.logger.error(
            `Request failed: ${method} ${route} - ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }

  private extractRoute(url: string): string {
    // 移除查询参数
    const path = url.split('?')[0];

    // 替换数字ID为占位符
    const route = path.replace(/\/\d+/g, '/:id');

    return route;
  }

  private calculateSize(data: string): number {
    return Buffer.byteLength(data, 'utf8');
  }
}
