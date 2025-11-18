<template>
  <div class="customers-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户列表</span>
          <el-button type="primary" @click="handleCreate">新增客户</el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-form :model="queryParams" inline>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
              <el-option label="正常" value="active" />
              <el-option label="暂停" value="suspended" />
              <el-option label="过期" value="expired" />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索">
            <el-input v-model="queryParams.keyword" placeholder="客户名称或邮箱" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 数据表格 -->
      <el-table :data="customerList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="客户名称" min-width="150" />
        <el-table-column prop="email" label="联系邮箱" min-width="180" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subscriptionPlan" label="当前套餐" width="120" />
        <el-table-column prop="monthlyRevenue" label="月均收益" width="120">
          <template #default="{ row }">
            ¥{{ row.monthlyRevenue?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="加入时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="handleView(row)">查看</el-button>
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleContact(row)">联系</el-button>
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

    <!-- 新增/编辑客户对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="customerForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="customerForm.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="customerForm.email" placeholder="请输入联系邮箱" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="customerForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="推荐套餐">
          <el-select v-model="customerForm.recommendedPlan" placeholder="选择推荐套餐" style="width: 100%">
            <el-option label="基础版" value="basic" />
            <el-option label="专业版" value="professional" />
            <el-option label="企业版" value="enterprise" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="customerForm.notes" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { mockCustomers } from '@/mock/data'
import { getCustomers, createCustomer, updateCustomer } from '@/api/customer'

const loading = ref(false)
const customerList = ref<any[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增客户')
const formRef = ref<FormInstance>()

const queryParams = ref({
  page: 1,
  pageSize: 10,
  status: '',
  keyword: ''
})

const customerForm = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  recommendedPlan: '',
  notes: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

onMounted(() => {
  fetchCustomers()
})

async function fetchCustomers() {
  loading.value = true
  try {
    // 尝试调用真实API
    // const res = await getCustomers(queryParams.value)
    // customerList.value = res.data
    // total.value = res.total

    // 使用Mock数据（开发环境）
    let filteredData = [...mockCustomers]

    // 状态筛选
    if (queryParams.value.status) {
      filteredData = filteredData.filter(item => item.status === queryParams.value.status)
    }

    // 关键字搜索
    if (queryParams.value.keyword) {
      const keyword = queryParams.value.keyword.toLowerCase()
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword)
      )
    }

    total.value = filteredData.length

    // 分页
    const start = (queryParams.value.page - 1) * queryParams.value.pageSize
    const end = start + queryParams.value.pageSize
    customerList.value = filteredData.slice(start, end)
  } catch (error) {
    console.error('获取客户列表失败:', error)
    ElMessage.error('获取客户列表失败')
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.value.page = 1
  fetchCustomers()
}

function handleReset() {
  queryParams.value = { page: 1, pageSize: 10, status: '', keyword: '' }
  fetchCustomers()
}

function handleCreate() {
  dialogTitle.value = '新增客户'
  customerForm.value = { id: null, name: '', email: '', phone: '', recommendedPlan: '', notes: '' }
  dialogVisible.value = true
}

function handleView(row: any) {
  ElMessage.info('查看客户详情：' + row.name)
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑客户'
  customerForm.value = { ...row }
  dialogVisible.value = true
}

function handleContact(row: any) {
  ElMessage.info('联系客户：' + row.email)
}

async function handleSave() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用API保存
        if (customerForm.value.id) {
          // 更新
          // await updateCustomer(customerForm.value.id, customerForm.value)
        } else {
          // 新增
          // await createCustomer(customerForm.value)
        }
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchCustomers()
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

function getStatusType(status: string) {
  const typeMap: any = {
    active: 'success',
    suspended: 'warning',
    expired: 'danger'
  }
  return typeMap[status] || ''
}

function getStatusText(status: string) {
  const textMap: any = {
    active: '正常',
    suspended: '暂停',
    expired: '过期'
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

.search-bar {
  margin-bottom: 20px;
}
</style>
