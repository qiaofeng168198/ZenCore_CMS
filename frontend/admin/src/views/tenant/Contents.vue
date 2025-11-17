<template>
  <div class="contents-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>内容列表</span>
          <el-button type="primary" @click="handleCreate">新建内容</el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-form :model="queryParams" inline>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
              <el-option label="草稿" value="draft" />
              <el-option label="待审核" value="pending" />
              <el-option label="已发布" value="published" />
              <el-option label="已下线" value="offline" />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索">
            <el-input v-model="queryParams.keyword" placeholder="标题或内容" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 数据表格 -->
      <el-table :data="contentList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="80" />
        <el-table-column prop="likeCount" label="点赞" width="80" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="handleView(row)">查看</el-button>
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status === 'draft'" type="text" @click="handleSubmit(row)">提交审核</el-button>
            <el-button v-if="row.status === 'draft'" type="text" @click="handlePublish(row)">发布</el-button>
            <el-button v-if="row.status === 'published'" type="text" @click="handleOffline(row)">下线</el-button>
            <el-button type="text" @click="handleVersions(row)">版本历史</el-button>
            <el-button type="text" @click="handleDelete(row)" style="color: #f56c6c">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery"
        @current-change="handleQuery"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 版本历史对话框 -->
    <el-dialog v-model="versionsVisible" title="版本历史" width="60%">
      <el-table :data="versions">
        <el-table-column prop="version" label="版本号" width="100" />
        <el-table-column prop="changeLog" label="变更日志" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="text" @click="handleRollback(row)">回滚</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  getContents,
  deleteContent,
  submitContent,
  publishContent,
  offlineContent,
  getVersions,
  rollbackVersion,
  type Content,
  type ContentQuery
} from '@/api/content'

const router = useRouter()
const loading = ref(false)
const contentList = ref<Content[]>([])
const total = ref(0)
const queryParams = ref<ContentQuery>({
  page: 1,
  pageSize: 10,
  status: '',
  keyword: '',
})

const versionsVisible = ref(false)
const versions = ref([])
const currentContent = ref<Content | null>(null)

// 获取内容列表
const fetchContents = async () => {
  loading.value = true
  try {
    const res = await getContents(queryParams.value)
    contentList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('获取内容列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryParams.value.page = 1
  fetchContents()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    page: 1,
    pageSize: 10,
    status: '',
    keyword: '',
  }
  fetchContents()
}

// 新建
const handleCreate = () => {
  router.push('/contents/create')
}

// 查看
const handleView = (row: Content) => {
  router.push(`/contents/${row.id}`)
}

// 编辑
const handleEdit = (row: Content) => {
  router.push(`/contents/edit/${row.id}`)
}

// 提交审核
const handleSubmit = async (row: Content) => {
  try {
    await ElMessageBox.confirm('确定要提交审核吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await submitContent(row.id)
    ElMessage.success('提交成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('提交审核失败:', error)
    }
  }
}

// 发布
const handlePublish = async (row: Content) => {
  try {
    await ElMessageBox.confirm('确定要发布吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await publishContent(row.id)
    ElMessage.success('发布成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('发布失败:', error)
    }
  }
}

// 下线
const handleOffline = async (row: Content) => {
  try {
    await ElMessageBox.confirm('确定要下线吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await offlineContent(row.id)
    ElMessage.success('下线成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('下线失败:', error)
    }
  }
}

// 版本历史
const handleVersions = async (row: Content) => {
  currentContent.value = row
  try {
    versions.value = await getVersions(row.id)
    versionsVisible.value = true
  } catch (error) {
    console.error('获取版本历史失败:', error)
  }
}

// 回滚版本
const handleRollback = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要回滚到版本 ${row.version} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await rollbackVersion(currentContent.value!.id, row.version)
    ElMessage.success('回滚成功')
    versionsVisible.value = false
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('回滚失败:', error)
    }
  }
}

// 删除
const handleDelete = async (row: Content) => {
  try {
    await ElMessageBox.confirm('确定要删除吗？删除后无法恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    })
    await deleteContent(row.id)
    ElMessage.success('删除成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 状态类型
const getStatusType = (status: string) => {
  const typeMap: any = {
    draft: '',
    pending: 'warning',
    published: 'success',
    offline: 'info',
  }
  return typeMap[status] || ''
}

// 状态文本
const getStatusText = (status: string) => {
  const textMap: any = {
    draft: '草稿',
    pending: '待审核',
    published: '已发布',
    offline: '已下线',
  }
  return textMap[status] || status
}

onMounted(() => {
  fetchContents()
})
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}
</style>
