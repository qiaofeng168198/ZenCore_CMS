import request from './request'

export interface Order {
  id: number
  orderNo: string
  tenantId: number
  userId: number
  orderType: 'subscription' | 'template' | 'value_added' | 'renewal'
  itemId: number
  itemName: string
  amount: number
  discountAmount: number
  finalAmount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  paymentMethod?: string
  paymentNo?: string
  paidAt?: string
  expiredAt?: string
  remark?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentRecord {
  id: number
  orderId: number
  paymentNo: string
  paymentMethod: 'alipay' | 'wechat' | 'bank' | 'balance'
  amount: number
  status: 'pending' | 'success' | 'failed' | 'refunded'
  transactionId?: string
  paymentUrl?: string
  qrCode?: string
  paidAt?: string
  createdAt: string
}

// 创建订单
export function createOrder(data: any) {
  return request<Order>({
    url: '/payments/orders',
    method: 'post',
    data,
  })
}

// 获取订单列表
export function getOrders(params?: { page?: number; pageSize?: number; status?: string }) {
  return request<{ data: Order[]; total: number }>({
    url: '/payments/orders',
    method: 'get',
    params,
  })
}

// 获取订单详情
export function getOrder(id: number) {
  return request<Order>({
    url: `/payments/orders/${id}`,
    method: 'get',
  })
}

// 支付订单
export function payOrder(id: number, paymentMethod: string) {
  return request<PaymentRecord>({
    url: `/payments/orders/${id}/pay`,
    method: 'post',
    data: { paymentMethod },
  })
}

// 取消订单
export function cancelOrder(id: number) {
  return request<Order>({
    url: `/payments/orders/${id}/cancel`,
    method: 'post',
  })
}

// 退款
export function refundOrder(id: number, data: { amount: number; reason?: string }) {
  return request<PaymentRecord>({
    url: `/payments/orders/${id}/refund`,
    method: 'post',
    data,
  })
}

// 查询支付状态
export function queryPaymentStatus(paymentNo: string) {
  return request<PaymentRecord>({
    url: `/payments/records/${paymentNo}`,
    method: 'get',
  })
}

// 获取订单统计
export function getOrderStats() {
  return request({
    url: '/payments/stats',
    method: 'get',
  })
}
