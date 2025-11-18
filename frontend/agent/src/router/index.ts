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
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/Customers.vue'),
        meta: { title: '客户管理', icon: 'User' }
      },
      {
        path: 'commission',
        name: 'Commission',
        component: () => import('@/views/Commission.vue'),
        meta: { title: '佣金管理', icon: 'Money' }
      },
      {
        path: 'performance',
        name: 'Performance',
        component: () => import('@/views/Performance.vue'),
        meta: { title: '业绩统计', icon: 'TrendCharts' }
      },
      {
        path: 'team',
        name: 'Team',
        component: () => import('@/views/Team.vue'),
        meta: { title: '团队管理', icon: 'Connection' }
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
  document.title = to.meta.title ? `${to.meta.title} - ZenCore 代理商后台` : 'ZenCore 代理商后台'

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

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
