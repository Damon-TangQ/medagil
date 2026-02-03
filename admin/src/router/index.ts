import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/UserManagement.vue'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '内容管理'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '系统设置'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Medagil管理后台`
  }
  next()
})

export default router
