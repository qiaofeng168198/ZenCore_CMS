export interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  maxUsers: number
  maxStorage: number
  maxBandwidth: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface TenantSubscription {
  id: number
  tenantId: number
  planId: number
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'expired'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: number
  tenantId: number
  orderNo: string
  orderType: 'subscription' | 'template' | 'upgrade'
  amount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  paymentMethod: string | null
  paidAt: string | null
  createdAt: string
}
