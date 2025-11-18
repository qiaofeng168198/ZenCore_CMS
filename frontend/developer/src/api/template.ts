import request from './request'

// 模板管理API
export function getTemplates(params: any) {
  return request({
    url: '/developer/templates',
    method: 'get',
    params
  })
}

export function getTemplate(id: number) {
  return request({
    url: `/developer/templates/${id}`,
    method: 'get'
  })
}

export function createTemplate(data: any) {
  return request({
    url: '/developer/templates',
    method: 'post',
    data
  })
}

export function updateTemplate(id: number, data: any) {
  return request({
    url: `/developer/templates/${id}`,
    method: 'put',
    data
  })
}

export function deleteTemplate(id: number) {
  return request({
    url: `/developer/templates/${id}`,
    method: 'delete'
  })
}

export function getTemplateStats(id: number) {
  return request({
    url: `/developer/templates/${id}/stats`,
    method: 'get'
  })
}

export function getTemplateVersions(id: number) {
  return request({
    url: `/developer/templates/${id}/versions`,
    method: 'get'
  })
}

// 收益统计API
export function getRevenueStats() {
  return request({
    url: '/developer/revenue/stats',
    method: 'get'
  })
}

export function getRevenueList(params: any) {
  return request({
    url: '/developer/revenue/list',
    method: 'get',
    params
  })
}

export function requestWithdrawal(data: any) {
  return request({
    url: '/developer/withdrawals',
    method: 'post',
    data
  })
}

// 评价管理API
export function getReviews(params: any) {
  return request({
    url: '/developer/reviews',
    method: 'get',
    params
  })
}

export function replyReview(id: number, data: any) {
  return request({
    url: `/developer/reviews/${id}/reply`,
    method: 'post',
    data
  })
}
