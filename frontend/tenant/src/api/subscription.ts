import request from './request'

export interface SubscriptionPlan {
  id: number
  name: string
  code: string
  description?: string
  monthlyPrice: number
  yearlyPrice: number
  maxUsers: number
  maxStorage: number
  maxBandwidth: number
  maxContents: number
  customDomain: boolean
  apiAccess: boolean
  cdnSupport: boolean
  multiLanguage: boolean
  priority: number
  isRecommended: boolean
  status: 'active' | 'inactive' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface TenantSubscription {
  id: number
  tenantId: number
  planId: number
  plan: SubscriptionPlan
  billingCycle: 'monthly' | 'yearly'
  status: 'active' | 'expired' | 'cancelled' | 'suspended'
  startDate: string
  endDate: string
  autoRenew: boolean
  currentUsers: number
  currentStorage: number
  currentBandwidth: number
  currentContents: number
  createdAt: string
  updatedAt: string
}

// 获取套餐列表
export function getPlans(activeOnly?: boolean) {
  return request<SubscriptionPlan[]>({
    url: '/subscriptions/plans',
    method: 'get',
    params: { activeOnly },
  })
}

// 获取套餐详情
export function getPlan(id: number) {
  return request<SubscriptionPlan>({
    url: `/subscriptions/plans/${id}`,
    method: 'get',
  })
}

// 创建套餐
export function createPlan(data: any) {
  return request<SubscriptionPlan>({
    url: '/subscriptions/plans',
    method: 'post',
    data,
  })
}

// 更新套餐
export function updatePlan(id: number, data: any) {
  return request<SubscriptionPlan>({
    url: `/subscriptions/plans/${id}`,
    method: 'patch',
    data,
  })
}

// 删除套餐
export function deletePlan(id: number) {
  return request({
    url: `/subscriptions/plans/${id}`,
    method: 'delete',
  })
}

// 订阅套餐
export function subscribe(data: { planId: number; billingCycle: 'monthly' | 'yearly' }) {
  return request<TenantSubscription>({
    url: '/subscriptions/subscribe',
    method: 'post',
    data,
  })
}

// 获取当前订阅
export function getCurrentSubscription() {
  return request<TenantSubscription>({
    url: '/subscriptions/current',
    method: 'get',
  })
}

// 变更套餐
export function changePlan(planId: number) {
  return request<TenantSubscription>({
    url: '/subscriptions/change-plan',
    method: 'post',
    data: { planId },
  })
}

// 取消订阅
export function cancelSubscription() {
  return request<TenantSubscription>({
    url: '/subscriptions/cancel',
    method: 'post',
  })
}

// 设置自动续费
export function updateAutoRenew(autoRenew: boolean) {
  return request<TenantSubscription>({
    url: '/subscriptions/auto-renew',
    method: 'post',
    data: { autoRenew },
  })
}

// 获取订阅历史
export function getSubscriptionHistory(page?: number, pageSize?: number) {
  return request<{ data: TenantSubscription[]; total: number }>({
    url: '/subscriptions/history',
    method: 'get',
    params: { page, pageSize },
  })
}
