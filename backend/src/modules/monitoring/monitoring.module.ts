import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { Alert } from './entities/alert.entity';
import { AlertRule } from './entities/alert-rule.entity';
import { SystemLog } from './entities/system-log.entity';
import { MonitoringService } from './monitoring.service';
import { MetricsService } from './metrics.service';
import { AlertService } from './alert.service';
import { LoggerService } from './logger.service';
import { MonitoringController } from './monitoring.controller';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Alert, AlertRule, SystemLog]),
    TerminusModule,
    HttpModule,
  ],
  providers: [
    MonitoringService,
    MetricsService,
    AlertService,
    LoggerService,
    PerformanceInterceptor,
  ],
  controllers: [MonitoringController],
  exports: [
    MonitoringService,
    MetricsService,
    AlertService,
    LoggerService,
    PerformanceInterceptor,
  ],
})
export class MonitoringModule {}
