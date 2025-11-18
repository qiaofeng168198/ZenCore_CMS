import request from './request'

export interface Content {
  id: number
  tenantId: number
  categoryId?: number
  title: string
  slug: string
  summary?: string
  content: string
  contentType: 'richtext' | 'markdown' | 'html'
  coverImage?: string
  authorId: number
  status: 'draft' | 'pending' | 'published' | 'offline'
  publishAt?: string
  viewCount: number
  likeCount: number
  isTop: boolean
  isRecommended: boolean
  version: number
  createdAt: string
  updatedAt: string
}

export interface ContentQuery {
  page?: number
  pageSize?: number
  status?: string
  categoryId?: number
  keyword?: string
  language?: string
}

// 获取内容列表
export function getContents(params: ContentQuery) {
  return request<{ data: Content[]; total: number }>({
    url: '/contents',
    method: 'get',
    params,
  })
}

// 获取内容详情
export function getContentDetail(id: number) {
  return request<Content>({
    url: `/contents/${id}`,
    method: 'get',
  })
}

// 创建内容
export function createContent(data: any) {
  return request<Content>({
    url: '/contents',
    method: 'post',
    data,
  })
}

// 更新内容
export function updateContent(id: number, data: any) {
  return request<Content>({
    url: `/contents/${id}`,
    method: 'patch',
    data,
  })
}

// 删除内容
export function deleteContent(id: number) {
  return request({
    url: `/contents/${id}`,
    method: 'delete',
  })
}

// 获取版本历史
export function getVersions(id: number) {
  return request({
    url: `/contents/${id}/versions`,
    method: 'get',
  })
}

// 回滚到指定版本
export function rollbackVersion(id: number, version: number) {
  return request({
    url: `/contents/${id}/rollback/${version}`,
    method: 'post',
  })
}

// 提交审核
export function submitContent(id: number) {
  return request({
    url: `/contents/${id}/submit`,
    method: 'post',
  })
}

// 审核内容
export function auditContent(id: number, data: { approved: boolean; comment?: string }) {
  return request({
    url: `/contents/${id}/audit`,
    method: 'post',
    data,
  })
}

// 发布内容
export function publishContent(id: number) {
  return request({
    url: `/contents/${id}/publish`,
    method: 'post',
  })
}

// 下线内容
export function offlineContent(id: number) {
  return request({
    url: `/contents/${id}/offline`,
    method: 'post',
  })
}
