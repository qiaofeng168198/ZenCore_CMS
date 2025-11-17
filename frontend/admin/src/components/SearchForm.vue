<template>
  <el-form :inline="true" :model="formData" class="search-form">
    <slot :data="formData" />
    <el-form-item>
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        搜索
      </el-button>
      <el-button @click="handleReset">
        <el-icon><Refresh /></el-icon>
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const props = defineProps<{
  initialData?: Record<string, any>
}>()

const emit = defineEmits<{
  search: [data: Record<string, any>]
  reset: []
}>()

const formData = reactive(props.initialData || {})

const handleSearch = () => {
  emit('search', formData)
}

const handleReset = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = undefined
  })
  emit('reset')
}
</script>

<style scoped lang="scss">
.search-form {
  margin-bottom: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
