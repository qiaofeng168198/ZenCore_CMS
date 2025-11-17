<template>
  <div class="tenants-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>租户列表</span>
          <el-button type="primary" @click="handleCreate">新建租户</el-button>
        </div>
      </template>
      <el-empty description="租户管理功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const handleCreate = () => {
  ElMessage.info('新建租户功能开发中...')
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
