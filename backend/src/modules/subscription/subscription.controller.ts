import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('订阅计费')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // ==================== 套餐管理 ====================

  @Post('plans')
  @ApiOperation({ summary: '创建套餐' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.subscriptionService.createPlan(createPlanDto);
  }

  @Get('plans')
  @ApiOperation({ summary: '获取套餐列表' })
  @ApiQuery({ name: 'activeOnly', required: false, description: '只显示启用的套餐' })
  findAllPlans(@Query('activeOnly') activeOnly?: boolean) {
    return this.subscriptionService.findAllPlans(activeOnly === true || activeOnly === 'true');
  }

  @Get('plans/:id')
  @ApiOperation({ summary: '获取套餐详情' })
  @ApiParam({ name: 'id', description: '套餐ID' })
  findPlan(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.findPlan(id);
  }

  @Patch('plans/:id')
  @ApiOperation({ summary: '更新套餐' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '套餐ID' })
  updatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.subscriptionService.updatePlan(id, updatePlanDto);
  }

  @Delete('plans/:id')
  @ApiOperation({ summary: '删除套餐' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '套餐ID' })
  removePlan(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.removePlan(id);
  }

  // ==================== 订阅管理 ====================

  @Post('subscribe')
  @ApiOperation({ summary: '订阅套餐' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  subscribe(@Request() req, @Body() subscribeDto: SubscribeDto) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.subscribe(tenantId, subscribeDto);
  }

  @Get('current')
  @ApiOperation({ summary: '获取当前订阅' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getCurrentSubscription(@Request() req) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.getTenantSubscription(tenantId);
  }

  @Post('change-plan')
  @ApiOperation({ summary: '变更套餐' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  changePlan(@Request() req, @Body('planId', ParseIntPipe) planId: number) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.changePlan(tenantId, planId);
  }

  @Post('cancel')
  @ApiOperation({ summary: '取消订阅' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  cancelSubscription(@Request() req) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.cancelSubscription(tenantId);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: '续费订阅' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '订阅ID' })
  renewSubscription(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.renewSubscription(id);
  }

  @Post('auto-renew')
  @ApiOperation({ summary: '设置自动续费' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateAutoRenew(@Request() req, @Body('autoRenew') autoRenew: boolean) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.updateAutoRenew(tenantId, autoRenew);
  }

  @Get('history')
  @ApiOperation({ summary: '获取订阅历史' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  getHistory(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.getSubscriptionHistory(tenantId, page, pageSize);
  }

  // ==================== 配额管理 ====================

  @Get('quota/check')
  @ApiOperation({ summary: '检查配额' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'type', description: '配额类型: users/storage/bandwidth/contents' })
  @ApiQuery({ name: 'value', description: '当前值' })
  checkQuota(
    @Request() req,
    @Query('type') type: string,
    @Query('value', ParseIntPipe) value: number,
  ) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.checkQuota(tenantId, type, value);
  }

  @Post('usage')
  @ApiOperation({ summary: '更新使用量' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateUsage(
    @Request() req,
    @Body() usage: {
      users?: number;
      storage?: number;
      bandwidth?: number;
      contents?: number;
    },
  ) {
    const tenantId = req.user.tenantId;
    return this.subscriptionService.updateUsage(tenantId, usage);
  }
}
