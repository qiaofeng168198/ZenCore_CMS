import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { RefundOrderDto } from './dto/refund-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from './entities/order.entity';

@ApiTags('支付管理')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ==================== 订单管理 ====================

  @Post('orders')
  @ApiOperation({ summary: '创建订单' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const { tenantId, userId } = req.user;
    return this.paymentService.createOrder(tenantId, userId, createOrderDto);
  }

  @Get('orders')
  @ApiOperation({ summary: '获取订单列表' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: '订单状态' })
  findOrders(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: OrderStatus,
  ) {
    const { tenantId } = req.user;
    return this.paymentService.findOrders(tenantId, page, pageSize, status);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: '获取订单详情' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '订单ID' })
  findOrder(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOrder(id);
  }

  @Post('orders/:id/pay')
  @ApiOperation({ summary: '支付订单' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '订单ID' })
  payOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() payOrderDto: PayOrderDto,
  ) {
    return this.paymentService.payOrder(id, payOrderDto);
  }

  @Post('orders/:id/cancel')
  @ApiOperation({ summary: '取消订单' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '订单ID' })
  cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.cancelOrder(id);
  }

  @Post('orders/:id/refund')
  @ApiOperation({ summary: '退款' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '订单ID' })
  refundOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() refundDto: RefundOrderDto,
  ) {
    return this.paymentService.refundOrder(id, refundDto);
  }

  // ==================== 支付回调 ====================

  @Post('callback/alipay')
  @ApiOperation({ summary: '支付宝支付回调' })
  async alipayCallback(@Body() callbackData: any) {
    // 实际使用时需要验证支付宝的签名
    const paymentNo = callbackData.out_trade_no;
    return this.paymentService.handlePaymentCallback(paymentNo, callbackData);
  }

  @Post('callback/wechat')
  @ApiOperation({ summary: '微信支付回调' })
  async wechatCallback(@Body() callbackData: any) {
    // 实际使用时需要验证微信的签名
    const paymentNo = callbackData.out_trade_no;
    return this.paymentService.handlePaymentCallback(paymentNo, callbackData);
  }

  // ==================== 支付查询 ====================

  @Get('records/:paymentNo')
  @ApiOperation({ summary: '查询支付状态' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'paymentNo', description: '支付流水号' })
  queryPaymentStatus(@Param('paymentNo') paymentNo: string) {
    return this.paymentService.queryPaymentStatus(paymentNo);
  }

  @Get('orders/:id/records')
  @ApiOperation({ summary: '获取订单支付记录' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: '订单ID' })
  getPaymentRecords(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.getPaymentRecords(id);
  }

  // ==================== 统计 ====================

  @Get('stats')
  @ApiOperation({ summary: '获取订单统计' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getOrderStats(@Request() req) {
    const { tenantId } = req.user;
    return this.paymentService.getOrderStats(tenantId);
  }
}
