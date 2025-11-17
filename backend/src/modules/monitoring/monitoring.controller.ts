import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { MetricsService } from './metrics.service';
import { AlertService } from './alert.service';
import { LoggerService } from './logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertStatus, AlertSeverity } from './entities/alert.entity';
import { LogLevel } from './entities/system-log.entity';

@ApiTags('监控系统')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly metricsService: MetricsService,
    private readonly alertService: AlertService,
    private readonly loggerService: LoggerService,
  ) {}

  // ==================== 健康检查 ====================

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  async health() {
    return this.monitoringService.checkHealth();
  }

  @Get('system/metrics')
  @ApiOperation({ summary: '获取系统指标' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSystemMetrics() {
    return this.monitoringService.getSystemMetrics();
  }

  @Get('database/metrics')
  @ApiOperation({ summary: '获取数据库指标' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getDatabaseMetrics() {
    return this.monitoringService.getDatabaseMetrics();
  }

  @Get('application/metrics')
  @ApiOperation({ summary: '获取应用指标' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getApplicationMetrics() {
    return this.monitoringService.getApplicationMetrics();
  }

  // ==================== Prometheus指标 ====================

  @Get('metrics')
  @ApiOperation({ summary: '获取Prometheus指标' })
  async getMetrics() {
    return this.metricsService.getMetrics();
  }

  @Get('metrics/json')
  @ApiOperation({ summary: '获取指标JSON格式' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMetricsJSON() {
    return this.metricsService.getMetricsJSON();
  }

  // ==================== 告警管理 ====================

  @Get('alerts')
  @ApiOperation({ summary: '获取告警列表' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'status', required: false, enum: AlertStatus, description: '告警状态' })
  @ApiQuery({ name: 'severity', required: false, enum: AlertSeverity, description: '严重程度' })
  async getAlerts(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: AlertStatus,
    @Query('severity') severity?: AlertSeverity,
  ) {
    return this.alertService.getAlerts(page, pageSize, status, severity);
  }

  @Post('alerts/:id/acknowledge')
  @ApiOperation({ summary: '确认告警' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '告警ID' })
  async acknowledgeAlert(
    @Param('id', ParseIntPipe) id: number,
    @Body('acknowledgedBy') acknowledgedBy: string,
  ) {
    return this.alertService.acknowledgeAlert(id, acknowledgedBy);
  }

  @Post('alerts/:id/resolve')
  @ApiOperation({ summary: '解决告警' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '告警ID' })
  async resolveAlert(
    @Param('id', ParseIntPipe) id: number,
    @Body('resolvedBy') resolvedBy: string,
    @Body('resolution') resolution: string,
  ) {
    return this.alertService.resolveAlert(id, resolvedBy, resolution);
  }

  @Get('alerts/stats')
  @ApiOperation({ summary: '获取告警统计' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAlertStats() {
    return this.alertService.getAlertStats();
  }

  // ==================== 日志管理 ====================

  @Get('logs')
  @ApiOperation({ summary: '获取日志列表' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'level', required: false, enum: LogLevel, description: '日志级别' })
  @ApiQuery({ name: 'context', required: false, description: '上下文' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期' })
  async getLogs(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('level') level?: LogLevel,
    @Query('context') context?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.loggerService.getLogs(page, pageSize, level, context, start, end);
  }

  @Get('logs/stats')
  @ApiOperation({ summary: '获取日志统计' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期' })
  async getLogStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.loggerService.getLogStats(start, end);
  }

  @Get('logs/errors')
  @ApiOperation({ summary: '搜索错误日志' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'keyword', required: true, description: '关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  async searchErrors(
    @Query('keyword') keyword: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.loggerService.searchErrors(keyword, page, pageSize);
  }
}
