import request from './request'
import type { Tenant, CreateTenantDto, UpdateTenantDto } from '@/types/tenant'

export function getTenants(params?: any) {
  return request({
    url: '/tenants',
    method: 'get',
    params
  })
}

export function getTenantDetail(id: number) {
  return request({
    url: `/tenants/${id}`,
    method: 'get'
  })
}

export function createTenant(data: CreateTenantDto) {
  return request({
    url: '/tenants',
    method: 'post',
    data
  })
}

export function updateTenant(id: number, data: UpdateTenantDto) {
  return request({
    url: `/tenants/${id}`,
    method: 'put',
    data
  })
}

export function deleteTenant(id: number) {
  return request({
    url: `/tenants/${id}`,
    method: 'delete'
  })
}
