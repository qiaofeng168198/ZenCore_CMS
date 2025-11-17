<template>
  <div class="tenants-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>租户列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建租户
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="租户名称">
          <el-input v-model="queryForm.keyword" placeholder="请输入租户名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="正常" value="active" />
            <el-option label="已暂停" value="suspended" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="租户名称" min-width="150" />
        <el-table-column prop="slug" label="标识" min-width="120" />
        <el-table-column prop="domain" label="域名" min-width="180">
          <template #default="{ row }">
            {{ row.domain || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'suspended' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '正常' : row.status === 'suspended' ? '暂停' : '过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contactName" label="联系人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryForm.page"
          v-model:page-size="queryForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="fetchData"
          @size-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="currentId ? '编辑租户' : '新建租户'" width="600px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入租户名称" />
        </el-form-item>
        <el-form-item label="标识" prop="slug">
          <el-input v-model="formData.slug" placeholder="请输入标识（英文）" />
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="formData.domain" placeholder="请输入域名（可选）" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="formData.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="contactEmail">
          <el-input v-model="formData.contactEmail" placeholder="请输入联系邮箱" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useTenantStore } from '@/store/tenant'

const tenantStore = useTenantStore()

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const queryForm = reactive({ page: 1, pageSize: 10, keyword: '', status: '' })

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const currentId = ref<number>()
const formData = reactive({ name: '', slug: '', domain: '', contactName: '', contactEmail: '', contactPhone: '' })

const formRules = {
  name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入标识', trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contactEmail: [{ required: true, message: '请输入联系邮箱', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

onMounted(() => fetchData())

async function fetchData() {
  loading.value = true
  try {
    const { data, total: t } = await tenantStore.fetchTenants(queryForm)
    tableData.value = data
    total.value = t
  } finally {
    loading.value = false
  }
}

function handleReset() {
  queryForm.keyword = ''
  queryForm.status = ''
  queryForm.page = 1
  fetchData()
}

function handleCreate() {
  currentId.value = undefined
  Object.assign(formData, { name: '', slug: '', domain: '', contactName: '', contactEmail: '', contactPhone: '' })
  dialogVisible.value = true
}

function handleEdit(row: any) {
  currentId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确定要删除该租户吗?', '警告', { type: 'error' })
    await tenantStore.deleteTenant(row.id)
    ElMessage.success('删除成功')
    await fetchData()
  } catch {}
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (currentId.value) {
        await tenantStore.updateTenant(currentId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await tenantStore.createTenant(formData)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      await fetchData()
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
