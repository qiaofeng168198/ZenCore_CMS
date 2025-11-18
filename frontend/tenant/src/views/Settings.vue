<template>
  <div class="settings-page">
    <el-card>
      <template #header>
        <span>系统设置</span>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="basicForm" label-width="120px" style="max-width: 600px">
            <el-form-item label="租户名称">
              <el-input v-model="basicForm.name" placeholder="请输入租户名称" />
            </el-form-item>
            <el-form-item label="域名">
              <el-input v-model="basicForm.domain" placeholder="请输入自定义域名">
                <template #prepend>https://</template>
              </el-input>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="basicForm.contactName" placeholder="请输入联系人姓名" />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicForm.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="basicForm.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 配额信息 -->
        <el-tab-pane label="配额信息" name="quota">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户配额">
              {{ quotaInfo.currentUsers }} / {{ quotaInfo.maxUsers }}
            </el-descriptions-item>
            <el-descriptions-item label="存储配额">
              {{ formatStorage(quotaInfo.currentStorage) }} / {{ formatStorage(quotaInfo.maxStorage) }}
            </el-descriptions-item>
            <el-descriptions-item label="流量配额">
              {{ formatStorage(quotaInfo.currentBandwidth) }} / {{ formatStorage(quotaInfo.maxBandwidth) }}
            </el-descriptions-item>
            <el-descriptions-item label="内容数量">
              {{ quotaInfo.currentContents }} / {{ quotaInfo.maxContents === -1 ? '无限制' : quotaInfo.maxContents }}
            </el-descriptions-item>
          </el-descriptions>
          <el-alert
            v-if="quotaInfo.currentStorage / quotaInfo.maxStorage > 0.8"
            title="存储空间不足"
            type="warning"
            :closable="false"
            style="margin-top: 20px"
          >
            您的存储空间已使用超过80%，请考虑升级套餐
          </el-alert>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form label-width="120px" style="max-width: 600px">
            <el-form-item label="修改密码">
              <el-button type="primary" @click="showPasswordDialog = true">修改密码</el-button>
            </el-form-item>
            <el-form-item label="双因素认证">
              <el-switch v-model="securitySettings.twoFactorEnabled" @change="handleToggle2FA" />
              <div style="color: #909399; font-size: 12px; margin-top: 5px">
                开启后登录需要验证码，提高账户安全性
              </div>
            </el-form-item>
            <el-form-item label="登录通知">
              <el-switch v-model="securitySettings.loginNotification" @change="handleToggleLoginNotif" />
              <div style="color: #909399; font-size: 12px; margin-top: 5px">
                新设备登录时发送邮件通知
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="500px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { mockTenantInfo, mockQuotaInfo, mockSecuritySettings } from '@/mock/data'
import { getTenantInfo, updateTenantInfo, getQuotaInfo, changePassword, toggle2FA, toggleLoginNotification } from '@/api/settings'

const activeTab = ref('basic')
const showPasswordDialog = ref(false)
const passwordFormRef = ref<FormInstance>()

const basicForm = ref({
  name: '',
  domain: '',
  contactName: '',
  contactEmail: '',
  contactPhone: ''
})

const quotaInfo = ref({
  currentUsers: 0,
  maxUsers: 0,
  currentStorage: 0,
  maxStorage: 0,
  currentBandwidth: 0,
  maxBandwidth: 0,
  currentContents: 0,
  maxContents: -1
})

const securitySettings = ref({
  twoFactorEnabled: false,
  loginNotification: true
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  fetchSettings()
})

async function fetchSettings() {
  try {
    // 使用Mock数据
    basicForm.value = { ...mockTenantInfo }
    quotaInfo.value = { ...mockQuotaInfo }
    securitySettings.value = { ...mockSecuritySettings }
  } catch (error) {
    console.error('获取设置信息失败:', error)
    ElMessage.error('获取设置信息失败')
  }
}

async function handleSaveBasic() {
  try {
    // 调用API保存基本信息
    // await updateTenantInfo(basicForm.value)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

async function handleChangePassword() {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用API修改密码
        // await changePassword(passwordForm.value)
        ElMessage.success('密码修改成功')
        showPasswordDialog.value = false
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      } catch (error) {
        ElMessage.error('密码修改失败')
      }
    }
  })
}

async function handleToggle2FA(value: boolean) {
  try {
    // 调用API切换双因素认证
    // await toggle2FA(value)
    ElMessage.success(value ? '双因素认证已开启' : '双因素认证已关闭')
  } catch (error) {
    ElMessage.error('操作失败')
    securitySettings.value.twoFactorEnabled = !value
  }
}

async function handleToggleLoginNotif(value: boolean) {
  try {
    // 调用API切换登录通知
    // await toggleLoginNotification(value)
    ElMessage.success(value ? '登录通知已开启' : '登录通知已关闭')
  } catch (error) {
    ElMessage.error('操作失败')
    securitySettings.value.loginNotification = !value
  }
}

function formatStorage(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
}
</script>

<style scoped lang="scss">
.settings-page {
  .el-alert {
    margin-top: 20px;
  }
}
</style>
