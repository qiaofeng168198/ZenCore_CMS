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
        path: 'templates',
        name: 'Templates',
        component: () => import('@/views/Templates.vue'),
        meta: { title: '我的模板', icon: 'Box' }
      },
      {
        path: 'revenue',
        name: 'Revenue',
        component: () => import('@/views/Revenue.vue'),
        meta: { title: '收益统计', icon: 'Money' }
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: () => import('@/views/Reviews.vue'),
        meta: { title: '用户评价', icon: 'ChatDotSquare' }
      },
      {
        path: 'documentation',
        name: 'Documentation',
        component: () => import('@/views/Documentation.vue'),
        meta: { title: '开发文档', icon: 'Document' }
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
  document.title = to.meta.title ? `${to.meta.title} - ZenCore 开发者后台` : 'ZenCore 开发者后台'

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
