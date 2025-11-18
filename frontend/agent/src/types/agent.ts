export interface Agent {
  id: number
  userId: number
  username: string
  email: string
  level: number
  parentId: number | null
  region: string | null
  commissionRate: number
  totalEarnings: number
  availableBalance: number
  totalCustomers: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface AgentCommission {
  id: number
  agentId: number
  orderId: number
  orderAmount: number
  commissionAmount: number
  commissionRate: number
  status: 'pending' | 'paid' | 'cancelled'
  paidAt: string | null
  createdAt: string
}

export interface WithdrawalRequest {
  id: number
  agentId: number
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  processedAt: string | null
}
