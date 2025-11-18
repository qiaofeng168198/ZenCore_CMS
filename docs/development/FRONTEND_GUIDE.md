# 前端开发指南

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript的超集，提供类型安全
- **Vite** - 下一代前端构建工具
- **Element Plus** - 基于Vue 3的组件库
- **Pinia** - Vue 3官方状态管理库
- **Vue Router** - Vue.js官方路由管理器
- **Axios** - Promise based HTTP客户端

## 项目结构

```
frontend/admin/src/
├── api/              # API服务层
│   ├── request.ts    # Axios封装
│   ├── auth.ts       # 认证相关API
│   ├── tenant.ts     # 租户相关API
│   ├── content.ts    # 内容相关API
│   ├── template.ts   # 模板相关API
│   ├── agent.ts      # 代理相关API
│   └── subscription.ts # 订阅相关API
├── assets/           # 静态资源
├── components/       # 通用组件
│   ├── PageContainer.vue
│   └── SearchForm.vue
├── layouts/          # 布局组件
│   └── MainLayout.vue
├── router/           # 路由配置
│   └── index.ts
├── store/            # Pinia状态管理
│   ├── user.ts       # 用户状态
│   ├── tenant.ts     # 租户状态
│   ├── content.ts    # 内容状态
│   ├── template.ts   # 模板状态
│   ├── agent.ts      # 代理状态
│   └── subscription.ts # 订阅状态
├── styles/           # 全局样式
├── types/            # TypeScript类型定义
│   ├── user.ts
│   ├── tenant.ts
│   ├── content.ts
│   ├── template.ts
│   ├── agent.ts
│   └── subscription.ts
├── utils/            # 工具函数
├── views/            # 页面组件
│   ├── auth/         # 认证相关页面
│   ├── super-admin/  # 超级管理员页面
│   ├── tenant/       # 租户页面
│   └── agent/        # 代理商页面
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 开发规范

### 1. 命名规范

#### 文件命名
- 组件文件：PascalCase（如 `UserList.vue`）
- 工具文件：camelCase（如 `formatDate.ts`）
- 样式文件：kebab-case（如 `global-styles.scss`）

#### 变量命名
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- 变量/函数：camelCase（如 `userName`, `fetchData`）
- 组件名：PascalCase（如 `UserList`）
- 类型/接口：PascalCase（如 `UserInfo`, `ApiResponse`）

### 2. 代码风格

```typescript
// ✅ 推荐
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const users = ref<User[]>([])

    const fetchUsers = async () => {
      loading.value = true
      try {
        users.value = await getUserList()
      } catch (error) {
        ElMessage.error('获取用户列表失败')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      loading,
      users,
      fetchUsers
    }
  }
}
```

### 3. 组件开发

#### 使用 `<script setup>` 语法

```vue
<template>
  <div class="user-list">
    <el-table :data="users" v-loading="loading">
      <!-- ... -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList } from '@/api/user'
import type { User } from '@/types/user'

const loading = ref(false)
const users = ref<User[]>([])

const fetchUsers = async () => {
  loading.value = true
  try {
    users.value = await getUserList()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
.user-list {
  padding: 20px;
}
</style>
```

### 4. 状态管理 (Pinia)

#### Store 定义

```typescript
// store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as userApi from '@/api/user'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref<User[]>([])
  const loading = ref(false)
  const total = ref(0)

  // 方法
  async function fetchUsers(params?: any) {
    loading.value = true
    try {
      const { data, total: t } = await userApi.getUsers(params)
      users.value = data
      total.value = t
      return { data, total: t }
    } finally {
      loading.value = false
    }
  }

  async function createUser(data: CreateUserDto) {
    await userApi.createUser(data)
    await fetchUsers()
  }

  // 返回
  return {
    users,
    loading,
    total,
    fetchUsers,
    createUser
  }
})
```

#### Store 使用

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers()
})
</script>
```

### 5. API 调用

#### API 定义

```typescript
// api/user.ts
import request from './request'
import type { User, CreateUserDto } from '@/types/user'

export function getUsers(params?: any) {
  return request<{ data: User[]; total: number }>({
    url: '/users',
    method: 'get',
    params
  })
}

export function getUserDetail(id: number) {
  return request<User>({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function createUser(data: CreateUserDto) {
  return request<User>({
    url: '/users',
    method: 'post',
    data
  })
}
```

#### 错误处理

```typescript
// 在组件中
try {
  await userStore.createUser(formData)
  ElMessage.success('创建成功')
} catch (error) {
  // 错误已在拦截器中处理，这里可以做额外处理
  console.error('创建用户失败:', error)
}
```

### 6. 类型定义

```typescript
// types/user.ts
export interface User {
  id: number
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  username: string
  email: string
  password: string
  role: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  status?: 'active' | 'inactive'
}
```

### 7. 路由配置

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'DataLine' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/super-admin/Users.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          roles: ['super_admin']
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 检查认证
  if (to.meta.requiresAuth !== false && !userStore.token) {
    next('/login')
    return
  }

  // 检查权限
  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    const userType = userStore.userType
    if (!to.meta.roles.includes(userType)) {
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
```

## 常见模式

### 1. 列表页面模式

```vue
<template>
  <div class="list-page">
    <el-card>
      <template #header>
        <div class="header">
          <span>{{ title }}</span>
          <el-button type="primary" @click="handleCreate">新建</el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.pageSize"
        :total="total"
        @current-change="fetchData"
        @size-change="fetchData"
      />
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="currentId ? '编辑' : '新建'">
      <el-form ref="formRef" :model="formData" :rules="formRules">
        <!-- 表单项 -->
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const queryForm = reactive({ page: 1, pageSize: 10, keyword: '' })

const dialogVisible = ref(false)
const formRef = ref()
const currentId = ref()
const formData = reactive({})

async function fetchData() {
  loading.value = true
  try {
    // 获取数据
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  currentId.value = undefined
  dialogVisible.value = true
}

function handleEdit(row: any) {
  currentId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm('确定要删除吗?', '警告', { type: 'warning' })
  // 删除逻辑
  ElMessage.success('删除成功')
  await fetchData()
}

onMounted(() => {
  fetchData()
})
</script>
```

### 2. 表单验证

```typescript
import type { FormRules } from 'element-plus'

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
}
```

### 3. 权限控制

```vue
<template>
  <!-- 基于角色显示 -->
  <el-button v-if="hasRole('admin')" type="danger">删除</el-button>

  <!-- 基于权限显示 -->
  <el-button v-if="hasPermission('user:delete')" type="danger">删除</el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const hasRole = (role: string) => {
  return userStore.userInfo?.roles?.includes(role)
}

const hasPermission = (permission: string) => {
  return userStore.userInfo?.permissions?.includes(permission)
}
</script>
```

## 性能优化

### 1. 组件懒加载

```typescript
const UserList = () => import('@/views/UserList.vue')
```

### 2. 计算属性缓存

```typescript
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name.includes(keyword.value)
  )
})
```

### 3. v-memo 优化

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.status]">
  <!-- 只有id或status变化时才重新渲染 -->
</div>
```

## 调试技巧

### 1. Vue Devtools

安装 Vue Devtools 浏览器扩展，可以查看组件树、状态、路由等。

### 2. 网络请求调试

```typescript
// request.ts 中添加
service.interceptors.request.use(config => {
  console.log('Request:', config)
  return config
})

service.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
})
```

### 3. 性能监控

```typescript
// main.ts
if (process.env.NODE_ENV === 'development') {
  app.config.performance = true
}
```

## 部署

### 构建生产版本

```bash
npm run build
```

### 环境变量

```env
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=ZenCore CMS
```

### Nginx 配置

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://backend:3000;
  }
}
```

## 常见问题

### 1. 404 刷新问题

使用 `createWebHistory` 时，需要配置服务器将所有路由重定向到 `index.html`。

### 2. 跨域问题

开发环境在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

### 3. 类型错误

确保安装了必要的类型声明：

```bash
npm install -D @types/node
```

## 资源链接

- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
