import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as tenantApi from '@/api/tenant'
import type { Tenant, CreateTenantDto, UpdateTenantDto } from '@/types/tenant'

export const useTenantStore = defineStore('tenant', () => {
  const tenants = ref<Tenant[]>([])
  const currentTenant = ref<Tenant | null>(null)
  const loading = ref(false)
  const total = ref(0)

  // 获取租户列表
  async function fetchTenants(params?: any) {
    loading.value = true
    try {
      const { data, total: t } = await tenantApi.getTenants(params)
      tenants.value = data
      total.value = t
      return { data, total: t }
    } finally {
      loading.value = false
    }
  }

  // 获取租户详情
  async function fetchTenantDetail(id: number) {
    loading.value = true
    try {
      const data = await tenantApi.getTenantDetail(id)
      currentTenant.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 创建租户
  async function createTenant(data: CreateTenantDto) {
    loading.value = true
    try {
      const result = await tenantApi.createTenant(data)
      await fetchTenants()
      return result
    } finally {
      loading.value = false
    }
  }

  // 更新租户
  async function updateTenant(id: number, data: UpdateTenantDto) {
    loading.value = true
    try {
      const result = await tenantApi.updateTenant(id, data)
      await fetchTenants()
      return result
    } finally {
      loading.value = false
    }
  }

  // 删除租户
  async function deleteTenant(id: number) {
    loading.value = true
    try {
      await tenantApi.deleteTenant(id)
      await fetchTenants()
    } finally {
      loading.value = false
    }
  }

  return {
    tenants,
    currentTenant,
    loading,
    total,
    fetchTenants,
    fetchTenantDetail,
    createTenant,
    updateTenant,
    deleteTenant
  }
})
