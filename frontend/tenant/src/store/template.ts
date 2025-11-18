import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as templateApi from '@/api/template'
import type { Template } from '@/types/template'

export const useTemplateStore = defineStore('template', () => {
  const templates = ref<Template[]>([])
  const currentTemplate = ref<Template | null>(null)
  const loading = ref(false)
  const total = ref(0)

  // 获取模板列表
  async function fetchTemplates(params?: any) {
    loading.value = true
    try {
      const { data, total: t } = await templateApi.getTemplates(params)
      templates.value = data
      total.value = t
      return { data, total: t }
    } finally {
      loading.value = false
    }
  }

  // 获取模板详情
  async function fetchTemplateDetail(id: number) {
    loading.value = true
    try {
      const data = await templateApi.getTemplateDetail(id)
      currentTemplate.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 安装模板
  async function installTemplate(id: number) {
    loading.value = true
    try {
      await templateApi.installTemplate(id)
      await fetchTemplates()
    } finally {
      loading.value = false
    }
  }

  // 卸载模板
  async function uninstallTemplate(id: number) {
    loading.value = true
    try {
      await templateApi.uninstallTemplate(id)
      await fetchTemplates()
    } finally {
      loading.value = false
    }
  }

  return {
    templates,
    currentTemplate,
    loading,
    total,
    fetchTemplates,
    fetchTemplateDetail,
    installTemplate,
    uninstallTemplate
  }
})
