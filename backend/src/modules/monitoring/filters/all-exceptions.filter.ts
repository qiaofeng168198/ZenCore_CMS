import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger.service';
import { AlertService } from '../alert.service';
import { AlertSeverity } from '../entities/alert.entity';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly alertService: AlertService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const stack =
      exception instanceof Error ? exception.stack : undefined;

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${message}`,
      stack,
      'ExceptionFilter',
    );

    // 对于严重错误创建告警
    if (status >= 500) {
      this.alertService.createAlert({
        type: 'application_error',
        severity: AlertSeverity.CRITICAL,
        message: `Server error: ${message}`,
        timestamp: new Date(),
        metadata: {
          url: request.url,
          method: request.method,
          statusCode: status,
          stack,
        },
      }).catch(err => {
        console.error('Failed to create alert:', err);
      });
    }

    // 返回错误响应
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack }),
    };

    response.status(status).json(errorResponse);
  }
}
