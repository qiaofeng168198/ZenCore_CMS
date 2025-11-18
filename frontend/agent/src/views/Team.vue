<template>
  <div class="team-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>团队管理</span>
          <el-button type="primary" @click="handleInvite">邀请成员</el-button>
        </div>
      </template>

      <el-table :data="teamMembers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customers" label="客户数" width="100" />
        <el-table-column prop="monthlyRevenue" label="本月收益" width="120">
          <template #default="{ row }">
            ¥{{ row.monthlyRevenue.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinedAt" label="加入时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="handleViewDetail(row)">查看</el-button>
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="inviteVisible" title="邀请团队成员" width="500px">
      <el-form :model="inviteForm" :rules="inviteRules" ref="inviteFormRef" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="inviteForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="inviteForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="inviteForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="inviteForm.role" placeholder="选择角色" style="width: 100%">
            <el-option label="普通成员" value="member" />
            <el-option label="组长" value="leader" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inviteVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSendInvite">发送邀请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { mockTeamMembers } from '@/mock/data'
import { inviteTeamMember } from '@/api/customer'

const inviteVisible = ref(false)
const inviteFormRef = ref<FormInstance>()

const teamMembers = ref<any[]>([])

const inviteForm = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

const inviteRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

onMounted(() => {
  fetchTeamMembers()
})

async function fetchTeamMembers() {
  try {
    // 使用Mock数据
    teamMembers.value = [...mockTeamMembers]
  } catch (error) {
    console.error('加载团队成员失败:', error)
  }
}

function handleInvite() {
  inviteForm.value = { name: '', email: '', phone: '', role: '' }
  inviteVisible.value = true
}

function handleViewDetail(row: any) {
  ElMessage.info('查看成员详情：' + row.name)
}

function handleEdit(row: any) {
  ElMessage.info('编辑成员：' + row.name)
}

async function handleSendInvite() {
  if (!inviteFormRef.value) return

  await inviteFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用API发送邀请
        // await inviteTeamMember(inviteForm.value)
        ElMessage.success('邀请已发送')
        inviteVisible.value = false
        fetchTeamMembers()
      } catch (error) {
        ElMessage.error('发送失败')
      }
    }
  })
}

function getRoleType(role: string) {
  return role === 'leader' ? 'warning' : ''
}

function getRoleText(role: string) {
  const textMap: any = {
    leader: '组长',
    member: '普通成员'
  }
  return textMap[role] || role
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
