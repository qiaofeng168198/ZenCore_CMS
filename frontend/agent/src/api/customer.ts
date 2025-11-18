import request from './request'

// 客户管理API
export function getCustomers(params: any) {
  return request({
    url: '/agent/customers',
    method: 'get',
    params
  })
}

export function getCustomer(id: number) {
  return request({
    url: `/agent/customers/${id}`,
    method: 'get'
  })
}

export function createCustomer(data: any) {
  return request({
    url: '/agent/customers',
    method: 'post',
    data
  })
}

export function updateCustomer(id: number, data: any) {
  return request({
    url: `/agent/customers/${id}`,
    method: 'put',
    data
  })
}

export function deleteCustomer(id: number) {
  return request({
    url: `/agent/customers/${id}`,
    method: 'delete'
  })
}

// 佣金API
export function getCommissions(params: any) {
  return request({
    url: '/agent/commissions',
    method: 'get',
    params
  })
}

export function getCommissionStats() {
  return request({
    url: '/agent/commissions/stats',
    method: 'get'
  })
}

export function requestWithdrawal(data: any) {
  return request({
    url: '/agent/withdrawals',
    method: 'post',
    data
  })
}

// 业绩统计API
export function getPerformanceStats() {
  return request({
    url: '/agent/performance/stats',
    method: 'get'
  })
}

export function getPerformanceRankings() {
  return request({
    url: '/agent/performance/rankings',
    method: 'get'
  })
}

export function getPerformanceChart(period: string) {
  return request({
    url: '/agent/performance/chart',
    method: 'get',
    params: { period }
  })
}

// 团队管理API
export function getTeamMembers(params?: any) {
  return request({
    url: '/agent/team/members',
    method: 'get',
    params
  })
}

export function inviteTeamMember(data: any) {
  return request({
    url: '/agent/team/invite',
    method: 'post',
    data
  })
}

export function updateTeamMember(id: number, data: any) {
  return request({
    url: `/agent/team/members/${id}`,
    method: 'put',
    data
  })
}

export function removeTeamMember(id: number) {
  return request({
    url: `/agent/team/members/${id}`,
    method: 'delete'
  })
}
