import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, OrderType } from './entities/order.entity';
import { PaymentRecord, PaymentStatus, PaymentMethod } from './entities/payment-record.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { RefundOrderDto } from './dto/refund-order.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentRecord)
    private readonly paymentRecordRepository: Repository<PaymentRecord>,
  ) {}

  /**
   * 创建订单
   */
  async createOrder(
    tenantId: number,
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    // 生成订单号
    const orderNo = this.generateOrderNo();

    // 计算最终金额
    const discountAmount = createOrderDto.discountAmount || 0;
    const finalAmount = createOrderDto.amount - discountAmount;

    if (finalAmount < 0) {
      throw new BadRequestException('优惠金额不能大于订单金额');
    }

    // 创建订单
    const order = this.orderRepository.create({
      orderNo,
      tenantId,
      userId,
      orderType: createOrderDto.orderType,
      itemId: createOrderDto.itemId,
      itemName: createOrderDto.itemName,
      amount: createOrderDto.amount,
      discountAmount,
      finalAmount,
      status: OrderStatus.PENDING,
      remark: createOrderDto.remark,
      // 设置订单过期时间为24小时后
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return this.orderRepository.save(order);
  }

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ORD${timestamp}${random}`;
  }

  /**
   * 获取订单列表
   */
  async findOrders(
    tenantId: number,
    page: number = 1,
    pageSize: number = 10,
    status?: OrderStatus,
  ): Promise<{ data: Order[]; total: number }> {
    const where: any = { tenantId };

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.orderRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total };
  }

  /**
   * 获取订单详情
   */
  async findOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  /**
   * 通过订单号获取订单
   */
  async findOrderByNo(orderNo: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { orderNo } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  /**
   * 支付订单
   */
  async payOrder(orderId: number, payOrderDto: PayOrderDto): Promise<PaymentRecord> {
    const order = await this.findOrder(orderId);

    // 检查订单状态
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('订单状态不正确');
    }

    // 检查订单是否过期
    if (order.expiredAt && new Date() > order.expiredAt) {
      order.status = OrderStatus.CANCELLED;
      await this.orderRepository.save(order);
      throw new BadRequestException('订单已过期');
    }

    // 生成支付流水号
    const paymentNo = this.generatePaymentNo();

    // 创建支付记录
    const paymentRecord = this.paymentRecordRepository.create({
      orderId: order.id,
      paymentNo,
      paymentMethod: payOrderDto.paymentMethod,
      amount: order.finalAmount,
      status: PaymentStatus.PENDING,
    });

    // 调用支付网关
    const paymentResult = await this.callPaymentGateway(paymentRecord);

    paymentRecord.paymentUrl = paymentResult.paymentUrl;
    paymentRecord.qrCode = paymentResult.qrCode;
    paymentRecord.transactionId = paymentResult.transactionId;

    return this.paymentRecordRepository.save(paymentRecord);
  }

  /**
   * 生成支付流水号
   */
  private generatePaymentNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `PAY${timestamp}${random}`;
  }

  /**
   * 调用支付网关（模拟实现）
   * 实际使用时需要集成真实的支付宝、微信支付SDK
   */
  private async callPaymentGateway(
    paymentRecord: PaymentRecord,
  ): Promise<{ paymentUrl: string; qrCode?: string; transactionId: string }> {
    // 这里是模拟实现，实际需要根据不同的支付方式调用对应的SDK

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    switch (paymentRecord.paymentMethod) {
      case PaymentMethod.ALIPAY:
        // 调用支付宝SDK
        return {
          paymentUrl: `https://alipay.example.com/pay?order=${paymentRecord.paymentNo}`,
          qrCode: `https://qr.alipay.com/${paymentRecord.paymentNo}`,
          transactionId,
        };

      case PaymentMethod.WECHAT:
        // 调用微信支付SDK
        return {
          paymentUrl: `https://wechat.example.com/pay?order=${paymentRecord.paymentNo}`,
          qrCode: `weixin://wxpay/bizpayurl?pr=${paymentRecord.paymentNo}`,
          transactionId,
        };

      case PaymentMethod.BANK:
        // 调用银行网关
        return {
          paymentUrl: `https://bank.example.com/pay?order=${paymentRecord.paymentNo}`,
          transactionId,
        };

      case PaymentMethod.BALANCE:
        // 使用账户余额支付（需要实现账户余额系统）
        return {
          paymentUrl: '',
          transactionId,
        };

      default:
        throw new BadRequestException('不支持的支付方式');
    }
  }

  /**
   * 支付回调处理
   */
  async handlePaymentCallback(
    paymentNo: string,
    callbackData: any,
  ): Promise<PaymentRecord> {
    const paymentRecord = await this.paymentRecordRepository.findOne({
      where: { paymentNo },
      relations: ['order'],
    });

    if (!paymentRecord) {
      throw new NotFoundException('支付记录不存在');
    }

    // 验证回调签名（实际使用时需要验证支付平台的签名）
    // const isValid = this.verifyCallback(callbackData);
    // if (!isValid) {
    //   throw new BadRequestException('回调签名验证失败');
    // }

    // 更新支付记录
    paymentRecord.status = PaymentStatus.SUCCESS;
    paymentRecord.paidAt = new Date();
    paymentRecord.callbackData = callbackData;

    await this.paymentRecordRepository.save(paymentRecord);

    // 更新订单状态
    const order = paymentRecord.order;
    order.status = OrderStatus.PAID;
    order.paymentMethod = paymentRecord.paymentMethod;
    order.paymentNo = paymentRecord.paymentNo;
    order.paidAt = new Date();

    await this.orderRepository.save(order);

    // 触发业务逻辑（如激活订阅、发放模板等）
    await this.handleOrderPaid(order);

    return paymentRecord;
  }

  /**
   * 处理订单支付成功后的业务逻辑
   */
  private async handleOrderPaid(order: Order): Promise<void> {
    // 根据订单类型执行不同的业务逻辑
    switch (order.orderType) {
      case OrderType.SUBSCRIPTION:
      case OrderType.RENEWAL:
        // 激活或续费订阅
        // 这里需要调用订阅服务
        console.log(`订单 ${order.orderNo} 支付成功，激活订阅`);
        break;

      case OrderType.TEMPLATE:
        // 发放模板
        console.log(`订单 ${order.orderNo} 支付成功，发放模板`);
        break;

      case OrderType.VALUE_ADDED:
        // 发放增值服务
        console.log(`订单 ${order.orderNo} 支付成功，发放增值服务`);
        break;

      default:
        console.log(`订单 ${order.orderNo} 支付成功`);
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.findOrder(orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('只能取消待支付订单');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  /**
   * 退款
   */
  async refundOrder(orderId: number, refundDto: RefundOrderDto): Promise<PaymentRecord> {
    const order = await this.findOrder(orderId);

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException('只能对已支付订单退款');
    }

    // 查找支付记录
    const paymentRecord = await this.paymentRecordRepository.findOne({
      where: {
        orderId: order.id,
        status: PaymentStatus.SUCCESS,
      },
    });

    if (!paymentRecord) {
      throw new NotFoundException('未找到支付记录');
    }

    // 检查退款金额
    if (refundDto.amount > Number(paymentRecord.amount)) {
      throw new BadRequestException('退款金额不能大于支付金额');
    }

    // 调用支付平台退款接口（模拟）
    const refundNo = `REF${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 更新支付记录
    paymentRecord.status = PaymentStatus.REFUNDED;
    paymentRecord.refundAmount = refundDto.amount;
    paymentRecord.refundNo = refundNo;
    paymentRecord.refundAt = new Date();
    paymentRecord.remark = refundDto.reason;

    await this.paymentRecordRepository.save(paymentRecord);

    // 更新订单状态
    order.status = OrderStatus.REFUNDED;
    await this.orderRepository.save(order);

    return paymentRecord;
  }

  /**
   * 获取支付记录
   */
  async getPaymentRecords(
    orderId: number,
  ): Promise<PaymentRecord[]> {
    return this.paymentRecordRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询支付状态
   */
  async queryPaymentStatus(paymentNo: string): Promise<PaymentRecord> {
    const paymentRecord = await this.paymentRecordRepository.findOne({
      where: { paymentNo },
      relations: ['order'],
    });

    if (!paymentRecord) {
      throw new NotFoundException('支付记录不存在');
    }

    // 如果支付状态为待支付，查询支付平台状态（实际使用时）
    if (paymentRecord.status === PaymentStatus.PENDING) {
      // const status = await this.queryFromPaymentGateway(paymentNo);
      // 更新本地状态
    }

    return paymentRecord;
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(tenantId: number): Promise<any> {
    // 总订单数
    const totalOrders = await this.orderRepository.count({
      where: { tenantId },
    });

    // 待支付订单数
    const pendingOrders = await this.orderRepository.count({
      where: { tenantId, status: OrderStatus.PENDING },
    });

    // 已支付订单数
    const paidOrders = await this.orderRepository.count({
      where: { tenantId, status: OrderStatus.PAID },
    });

    // 总金额
    const totalAmount = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.finalAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .getRawOne();

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
      totalAmount: totalAmount?.total || 0,
    };
  }
}
