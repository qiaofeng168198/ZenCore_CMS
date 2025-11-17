import request from './request'

// 获取超级管理员仪表板统计
export function getAdminDashboard() {
  return request({
    url: '/stats/admin/dashboard',
    method: 'get',
  })
}

// 获取租户仪表板统计
export function getTenantDashboard() {
  return request({
    url: '/stats/tenant/dashboard',
    method: 'get',
  })
}

// 获取代理商仪表板统计
export function getAgentDashboard(agentId: number) {
  return request({
    url: '/stats/agent/dashboard',
    method: 'get',
    params: { agentId },
  })
}

// 获取内容统计报表
export function getContentReport(startDate?: string, endDate?: string) {
  return request({
    url: '/stats/content/report',
    method: 'get',
    params: { startDate, endDate },
  })
}

// 获取收入报表
export function getRevenueReport(startDate?: string, endDate?: string) {
  return request({
    url: '/stats/revenue/report',
    method: 'get',
    params: { startDate, endDate },
  })
}

// 获取模板统计
export function getTemplateStats() {
  return request({
    url: '/stats/template/stats',
    method: 'get',
  })
}
