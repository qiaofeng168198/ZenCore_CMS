import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as contentApi from '@/api/content'
import type { Content, CreateContentDto, UpdateContentDto } from '@/types/content'

export const useContentStore = defineStore('content', () => {
  const contents = ref<Content[]>([])
  const currentContent = ref<Content | null>(null)
  const loading = ref(false)
  const total = ref(0)

  // 获取内容列表
  async function fetchContents(params?: any) {
    loading.value = true
    try {
      const { data, total: t } = await contentApi.getContents(params)
      contents.value = data
      total.value = t
      return { data, total: t }
    } finally {
      loading.value = false
    }
  }

  // 获取内容详情
  async function fetchContentDetail(id: number) {
    loading.value = true
    try {
      const data = await contentApi.getContentDetail(id)
      currentContent.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 创建内容
  async function createContent(data: CreateContentDto) {
    loading.value = true
    try {
      const result = await contentApi.createContent(data)
      await fetchContents()
      return result
    } finally {
      loading.value = false
    }
  }

  // 更新内容
  async function updateContent(id: number, data: UpdateContentDto) {
    loading.value = true
    try {
      const result = await contentApi.updateContent(id, data)
      await fetchContents()
      return result
    } finally {
      loading.value = false
    }
  }

  // 删除内容
  async function deleteContent(id: number) {
    loading.value = true
    try {
      await contentApi.deleteContent(id)
      await fetchContents()
    } finally {
      loading.value = false
    }
  }

  // 发布内容
  async function publishContent(id: number) {
    loading.value = true
    try {
      await contentApi.publishContent(id)
      await fetchContents()
    } finally {
      loading.value = false
    }
  }

  return {
    contents,
    currentContent,
    loading,
    total,
    fetchContents,
    fetchContentDetail,
    createContent,
    updateContent,
    deleteContent,
    publishContent
  }
})
