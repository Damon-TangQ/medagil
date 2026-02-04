import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于我们'
    }
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: () => import('@/views/ProjectList.vue'),
    meta: {
      title: '项目列表',
      requiresAuth: false
    }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: {
      title: '项目详情',
      requiresAuth: false
    }
  },
  {
    path: '/projects/create',
    name: 'CreateProject',
    component: () => import('@/views/CreateProject.vue'),
    meta: {
      title: '创建项目',
      requiresAuth: false
    }
  },
  {
    path: '/projects/:id/edit',
    name: 'EditProject',
    component: () => import('@/views/EditProject.vue'),
    meta: {
      title: '编辑项目',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '个人中心',
      requiresAuth: false
    }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: () => import('@/views/Subscription.vue'),
    meta: {
      title: '订阅管理',
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '控制台',
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '设置',
      requiresAuth: false
    }
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: () => import('@/views/Inbox.vue'),
    meta: {
      title: 'AI收件箱',
      requiresAuth: false
    }
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/views/Workspace.vue'),
    meta: {
      title: '工作区',
      requiresAuth: false
    }
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('@/views/Achievements.vue'),
    meta: {
      title: '成果库',
      requiresAuth: false
    }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/Tasks.vue'),
    meta: {
      title: '所有任务',
      requiresAuth: false
    }
  },
  {
    path: '/my-tasks',
    name: 'MyTasks',
    component: () => import('@/views/MyTasks.vue'),
    meta: {
      title: '我的任务',
      requiresAuth: false
    }
  },
  {
    path: '/agents/clinical-paper',
    name: 'ClinicalPaper',
    component: () => import('@/views/agents/ClinicalPaper.vue'),
    meta: {
      title: '临床论文',
      requiresAuth: false
    }
  },
  {
    path: '/agents/journal-selection',
    name: 'JournalSelection',
    component: () => import('@/views/agents/JournalSelection.vue'),
    meta: {
      title: '期刊选择',
      requiresAuth: false
    }
  },
  {
    path: '/agents/literature-analysis',
    name: 'LiteratureAnalysis',
    component: () => import('@/views/agents/LiteratureAnalysis.vue'),
    meta: {
      title: '文献分析',
      requiresAuth: false
    }
  },
  {
    path: '/project-view',
    name: 'ProjectView',
    component: () => import('@/views/ProjectView.vue'),
    meta: {
      title: '项目视图',
      requiresAuth: false
    }
  },
  {
    path: '/task-chat',
    name: 'TaskChat',
    component: () => import('@/views/TaskChat.vue'),
    meta: {
      title: '任务对话',
      requiresAuth: false
    }
  },
  {
    path: '/mobile',
    name: 'Mobile',
    component: () => import('@/views/mobile/Mobile.vue'),
    meta: {
      title: '移动端',
      requiresAuth: false
    }
  },
  {
    path: '/mobile/home',
    name: 'MobileHome',
    component: () => import('@/views/mobile/Home.vue'),
    meta: {
      title: '移动端首页',
      requiresAuth: false
    }
  },
  {
    path: '/mobile/projects',
    name: 'MobileProjects',
    component: () => import('@/views/mobile/Projects.vue'),
    meta: {
      title: '移动端项目',
      requiresAuth: false
    }
  },
  {
    path: '/mobile/profile',
    name: 'MobileProfile',
    component: () => import('@/views/mobile/Profile.vue'),
    meta: {
      title: '移动端个人中心',
      requiresAuth: false
    }
  },
  {
    path: '/outputs',
    name: 'Outputs',
    component: () => import('@/views/Outputs.vue'),
    meta: {
      title: '我的成果',
      requiresAuth: false
    }
  },
  {
    path: '/recent',
    name: 'Recent',
    component: () => import('@/views/Recent.vue'),
    meta: {
      title: '最近使用',
      requiresAuth: false
    }
  },
  {
    path: '/tools/literature',
    name: 'LiteratureTools',
    component: () => import('@/views/tools/Literature.vue'),
    meta: {
      title: '文献工具',
      requiresAuth: false
    }
  },
  {
    path: '/tools/format',
    name: 'FormatTools',
    component: () => import('@/views/tools/Format.vue'),
    meta: {
      title: '格式工具',
      requiresAuth: false
    }
  },
  {
    path: '/tools/translate',
    name: 'TranslateTools',
    component: () => import('@/views/tools/Translate.vue'),
    meta: {
      title: '翻译工具',
      requiresAuth: false
    }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/Member.vue'),
    meta: {
      title: '会员中心',
      requiresAuth: false
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/Help.vue'),
    meta: {
      title: '帮助反馈',
      requiresAuth: false
    }
  },
  {
    path: '/settings/account',
    name: 'AccountSettings',
    component: () => import('@/views/settings/Account.vue'),
    meta: {
      title: '账户设置',
      requiresAuth: false
    }
  },
  {
    path: '/settings/appearance',
    name: 'AppearanceSettings',
    component: () => import('@/views/settings/Appearance.vue'),
    meta: {
      title: '界面设置',
      requiresAuth: false
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
    document.title = `${to.meta.title} - Medagil AI平台`
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  next()
})

export default router
