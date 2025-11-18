<template>
  <div class="templates-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的模板</span>
          <el-button type="primary" @click="handleCreate">上传新模板</el-button>
        </div>
      </template>

      <el-table :data="templateList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="模板名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="downloads" label="下载量" width="100" />
        <el-table-column prop="rating" label="评分" width="120">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="revenue" label="收益" width="120">
          <template #default="{ row }">
            ¥{{ row.revenue.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleViewStats(row)">数据</el-button>
            <el-button type="text" @click="handleVersions(row)">版本</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchTemplates"
        @current-change="fetchTemplates"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const templateList = ref<any[]>([])
const total = ref(0)

const queryParams = ref({
  page: 1,
  pageSize: 10
})

onMounted(() => {
  fetchTemplates()
})

async function fetchTemplates() {
  loading.value = true
  try {
    // 模拟数据
    templateList.value = [
      {
        id: 1,
        name: '企业官网模板',
        category: '企业',
        version: '1.2.0',
        downloads: 156,
        rating: 4.5,
        revenue: 4680,
        status: 'published',
        createdAt: '2024-01-10 10:00:00'
      }
    ]
    total.value = 1
  } catch (error) {
    console.error('获取模板列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  ElMessage.info('上传新模板功能开发中')
}

function handleEdit(row: any) {
  ElMessage.info('编辑模板：' + row.name)
}

function handleViewStats(row: any) {
  ElMessage.info('查看模板数据：' + row.name)
}

function handleVersions(row: any) {
  ElMessage.info('查看版本历史：' + row.name)
}

function getStatusType(status: string) {
  const typeMap: any = {
    draft: '',
    pending: 'warning',
    published: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || ''
}

function getStatusText(status: string) {
  const textMap: any = {
    draft: '草稿',
    pending: '审核中',
    published: '已发布',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
