import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as subscriptionApi from '@/api/subscription'
import type { SubscriptionPlan, TenantSubscription } from '@/types/subscription'

export const useSubscriptionStore = defineStore('subscription', () => {
  const plans = ref<SubscriptionPlan[]>([])
  const currentSubscription = ref<TenantSubscription | null>(null)
  const loading = ref(false)

  // 获取订阅套餐列表
  async function fetchPlans() {
    loading.value = true
    try {
      const data = await subscriptionApi.getPlans()
      plans.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 获取当前订阅
  async function fetchCurrentSubscription() {
    loading.value = true
    try {
      const data = await subscriptionApi.getCurrentSubscription()
      currentSubscription.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 订阅套餐
  async function subscribe(planId: number) {
    loading.value = true
    try {
      const result = await subscriptionApi.subscribe(planId)
      await fetchCurrentSubscription()
      return result
    } finally {
      loading.value = false
    }
  }

  // 取消订阅
  async function cancelSubscription() {
    loading.value = true
    try {
      await subscriptionApi.cancelSubscription()
      await fetchCurrentSubscription()
    } finally {
      loading.value = false
    }
  }

  return {
    plans,
    currentSubscription,
    loading,
    fetchPlans,
    fetchCurrentSubscription,
    subscribe,
    cancelSubscription
  }
})
