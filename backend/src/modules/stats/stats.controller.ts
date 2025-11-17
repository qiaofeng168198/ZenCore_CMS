import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('数据统计')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('admin/dashboard')
  @ApiOperation({ summary: '超级管理员仪表板统计' })
  getAdminDashboard() {
    return this.statsService.getAdminDashboard();
  }

  @Get('tenant/dashboard')
  @ApiOperation({ summary: '租户仪表板统计' })
  getTenantDashboard(@Request() req) {
    const { tenantId } = req.user;
    return this.statsService.getTenantDashboard(tenantId);
  }

  @Get('agent/dashboard')
  @ApiOperation({ summary: '代理商仪表板统计' })
  @ApiQuery({ name: 'agentId', required: true, description: '代理商ID' })
  getAgentDashboard(@Query('agentId', ParseIntPipe) agentId: number) {
    return this.statsService.getAgentDashboard(agentId);
  }

  @Get('content/report')
  @ApiOperation({ summary: '内容统计报表' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期' })
  getContentReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const { tenantId } = req.user;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.statsService.getContentReport(tenantId, start, end);
  }

  @Get('revenue/report')
  @ApiOperation({ summary: '收入报表' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期' })
  getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.statsService.getRevenueReport(start, end);
  }

  @Get('template/stats')
  @ApiOperation({ summary: '模板统计' })
  getTemplateStats() {
    return this.statsService.getTemplateStats();
  }
}
