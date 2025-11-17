<template>
  <el-container class="main-layout">
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <h2>ZenCore CMS</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        :router="true"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>

        <!-- 超级管理员菜单 -->
        <template v-if="userType === 'super_admin'">
          <el-menu-item index="/tenants">
            <el-icon><OfficeBuilding /></el-icon>
            <span>租户管理</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/agents">
            <el-icon><Connection /></el-icon>
            <span>代理商管理</span>
          </el-menu-item>
        </template>

        <!-- 租户菜单 -->
        <template v-if="userType === 'tenant_admin' || userType === 'tenant_user'">
          <el-menu-item index="/contents">
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </el-menu-item>
          <el-menu-item index="/templates" v-if="userType === 'tenant_admin'">
            <el-icon><Box /></el-icon>
            <span>模板管理</span>
          </el-menu-item>
          <el-menu-item index="/subscription" v-if="userType === 'tenant_admin'">
            <el-icon><CreditCard /></el-icon>
            <span>订阅管理</span>
          </el-menu-item>
        </template>

        <!-- 代理商菜单 -->
        <template v-if="userType === 'agent'">
          <el-menu-item index="/agent/customers">
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </el-menu-item>
          <el-menu-item index="/agent/commission">
            <el-icon><Money /></el-icon>
            <span>佣金管理</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userInfo?.avatar" />
              <span class="username">{{ userInfo?.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const userType = computed(() => userStore.userType)
const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta.title as string || '')

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      userStore.logout()
      router.push('/login')
      ElMessage.success('退出成功')
    } catch (error) {
      // 用户取消
    }
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中...')
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
}

.sidebar {
  background-color: #304156;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background-color: #2b3a4a;

    h2 {
      margin: 0;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .el-menu {
    border-right: none;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    .username {
      font-size: 14px;
      color: #333;
    }
  }
}

.main-content {
  background: #f0f2f5;
  padding: 20px;
}
</style>
