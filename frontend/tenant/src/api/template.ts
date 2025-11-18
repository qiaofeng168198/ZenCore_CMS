import request from './request'

export interface Template {
  id: number
  developerId: number
  name: string
  code: string
  description?: string
  version: string
  coverImage?: string
  previewUrl?: string
  price: number
  isFree: boolean
  category?: string
  tags?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline'
  isResponsive: boolean
  supportMobile: boolean
  supportMiniprogram: boolean
  downloadCount: number
  ratingScore: number
  ratingCount: number
  commissionRate: number
  createdAt: string
  updatedAt: string
}

// 获取模板列表
export function getTemplates(params?: { status?: string }) {
  return request<Template[]>({
    url: '/templates',
    method: 'get',
    params,
  })
}

// 获取模板市场
export function getMarketTemplates() {
  return request<Template[]>({
    url: '/templates/market',
    method: 'get',
  })
}

// 获取模板详情
export function getTemplateDetail(id: number) {
  return request<Template>({
    url: `/templates/${id}`,
    method: 'get',
  })
}

// 创建模板
export function createTemplate(data: any) {
  return request<Template>({
    url: '/templates',
    method: 'post',
    data,
  })
}

// 更新模板
export function updateTemplate(id: number, data: any) {
  return request<Template>({
    url: `/templates/${id}`,
    method: 'patch',
    data,
  })
}

// 删除模板
export function deleteTemplate(id: number) {
  return request({
    url: `/templates/${id}`,
    method: 'delete',
  })
}

// 提交审核
export function submitTemplate(id: number) {
  return request({
    url: `/templates/${id}/submit`,
    method: 'post',
  })
}

// 审核模板
export function auditTemplate(id: number, data: { approved: boolean; comment?: string }) {
  return request({
    url: `/templates/${id}/audit`,
    method: 'post',
    data,
  })
}

// 下载模板
export function downloadTemplate(id: number) {
  return request({
    url: `/templates/${id}/download`,
    method: 'post',
  })
}

// 评分
export function rateTemplate(id: number, score: number) {
  return request({
    url: `/templates/${id}/rate`,
    method: 'post',
    data: { score },
  })
}

// 安装模板
export function installTemplate(id: number) {
  return request({
    url: `/templates/${id}/install`,
    method: 'post',
  })
}

// 卸载模板
export function uninstallTemplate(id: number) {
  return request({
    url: `/templates/${id}/uninstall`,
    method: 'post',
  })
}
