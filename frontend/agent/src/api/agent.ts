import request from './request'

export interface Agent {
  id: number
  name: string
  code: string
  level: 'province' | 'city' | 'district' | 'partner'
  parentId?: number
  contactName: string
  contactPhone: string
  contactEmail?: string
  regionProvince?: string
  regionCity?: string
  regionDistrict?: string
  status: 'active' | 'suspended' | 'terminated'
  commissionRate: number
  totalCustomers: number
  activeCustomers: number
  totalRevenue: number
  totalCommission: number
  remark?: string
  createdAt: string
  updatedAt: string
}

export interface QueryAgentParams {
  page?: number
  pageSize?: number
  level?: string
  parentId?: number
  keyword?: string
  province?: string
  city?: string
}

// 获取代理商列表
export function getAgents(params?: QueryAgentParams) {
  return request<{ data: Agent[]; total: number }>({
    url: '/agents',
    method: 'get',
    params,
  })
}

// 获取代理商详情
export function getAgent(id: number) {
  return request<Agent>({
    url: `/agents/${id}`,
    method: 'get',
  })
}

// 创建代理商
export function createAgent(data: any) {
  return request<Agent>({
    url: '/agents',
    method: 'post',
    data,
  })
}

// 更新代理商
export function updateAgent(id: number, data: any) {
  return request<Agent>({
    url: `/agents/${id}`,
    method: 'patch',
    data,
  })
}

// 删除代理商
export function deleteAgent(id: number) {
  return request({
    url: `/agents/${id}`,
    method: 'delete',
  })
}

// 获取代理商客户列表
export function getAgentCustomers(id: number, page?: number, pageSize?: number) {
  return request({
    url: `/agents/${id}/customers`,
    method: 'get',
    params: { page, pageSize },
  })
}

// 获取代理商佣金记录
export function getAgentCommissions(id: number, page?: number, pageSize?: number) {
  return request({
    url: `/agents/${id}/commissions`,
    method: 'get',
    params: { page, pageSize },
  })
}

// 获取代理商统计数据
export function getAgentStats(id: number) {
  return request({
    url: `/agents/${id}/stats`,
    method: 'get',
  })
}

// 获取代理商层级树
export function getAgentTree(parentId?: number) {
  return request<Agent[]>({
    url: '/agents/tree',
    method: 'get',
    params: { parentId },
  })
}

// 获取佣金列表
export function getCommissions(params?: any) {
  return request({
    url: '/agents/commissions',
    method: 'get',
    params,
  })
}

// 申请提现
export function requestWithdrawal(amount: number) {
  return request({
    url: '/agents/withdrawal',
    method: 'post',
    data: { amount },
  })
}
