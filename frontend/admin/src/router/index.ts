import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

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
        path: 'tenants',
        name: 'Tenants',
        component: () => import('@/views/super-admin/Tenants.vue'),
        meta: { title: '租户管理', icon: 'OfficeBuilding', roles: ['super_admin'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/super-admin/Users.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['super_admin'] }
      },
      {
        path: 'agents',
        name: 'Agents',
        component: () => import('@/views/super-admin/Agents.vue'),
        meta: { title: '代理商管理', icon: 'Connection', roles: ['super_admin'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const token = userStore.token

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ZenCore CMS` : 'ZenCore CMS'

  // 如果需要认证但没有token，跳转到登录页
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
    NProgress.done()
    return
  }

  // 如果已登录访问登录页，跳转到首页
  if (to.path === '/login' && token) {
    next('/')
    NProgress.done()
    return
  }

  // 检查角色权限
  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    const userType = userStore.userType
    if (!to.meta.roles.includes(userType)) {
      next('/dashboard')
      NProgress.done()
      return
    }
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
