import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as agentApi from '@/api/agent'
import type { Agent, AgentCommission } from '@/types/agent'

export const useAgentStore = defineStore('agent', () => {
  const agents = ref<Agent[]>([])
  const commissions = ref<AgentCommission[]>([])
  const loading = ref(false)
  const total = ref(0)

  // 获取代理商列表
  async function fetchAgents(params?: any) {
    loading.value = true
    try {
      const { data, total: t } = await agentApi.getAgents(params)
      agents.value = data
      total.value = t
      return { data, total: t }
    } finally {
      loading.value = false
    }
  }

  // 获取佣金记录
  async function fetchCommissions(params?: any) {
    loading.value = true
    try {
      const { data, total: t } = await agentApi.getCommissions(params)
      commissions.value = data
      total.value = t
      return { data, total: t }
    } finally {
      loading.value = false
    }
  }

  // 申请提现
  async function requestWithdrawal(amount: number) {
    loading.value = true
    try {
      await agentApi.requestWithdrawal(amount)
      await fetchCommissions()
    } finally {
      loading.value = false
    }
  }

  return {
    agents,
    commissions,
    loading,
    total,
    fetchAgents,
    fetchCommissions,
    requestWithdrawal
  }
})
