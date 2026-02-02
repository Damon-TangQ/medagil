<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-left">
        <div class="logo">
          <el-icon :size="28" color="#667eea"><Promotion /></el-icon>
          <span class="logo-text">Medagil AI</span>
        </div>
      </div>
      <div class="header-right">
        <template v-if="!isLoggedIn">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="handleRegister">注册</el-button>
        </template>
        <template v-else>
          <el-dropdown @command="handleUserCommand" trigger="click">
            <div class="user-dropdown">
              <el-avatar :size="36" :src="userInfo.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userInfo.username }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="subscription">
                  <el-icon><Wallet /></el-icon>
                  订阅管理
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="main-body">
      <!-- 左侧导航栏 -->
      <aside class="sidebar" :class="{ 'sidebar-visible': sidebarVisible }">
        <nav class="sidebar-nav">
          <div
            v-for="item in menuItems"
            :key="item.path"
            class="nav-item"
            :class="{ 'nav-item-active': isActive(item.path) }"
            @click="handleNavClick(item.path)"
          >
            <el-icon :size="20">
              <component :is="item.icon" />
            </el-icon>
            <span class="nav-text">{{ item.title }}</span>
            <el-tag v-if="item.isNew" size="small" type="danger" effect="dark" class="new-tag">
              新
            </el-tag>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>

    <!-- 移动端导航切换按钮 -->
    <div v-if="isMobile" class="mobile-nav-toggle" @click="toggleSidebar">
      <el-icon :size="24"><Menu /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Promotion,
  User,
  ArrowDown,
  Wallet,
  SwitchButton,
  Menu,
  House,
  Message,
  Folder,
  Document,
  List,
  Setting
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 登录状态
const isLoggedIn = computed(() => authStore.isAuthenticated)

// 用户信息
const userInfo = computed(() => authStore.user || { username: '用户', avatar: '' })

// 移动端检测
const isMobile = ref(false)
const sidebarVisible = ref(true)

// 菜单项
const menuItems = [
  {
    path: '/',
    title: '首页',
    icon: House
  },
  {
    path: '/inbox',
    title: 'AI收件箱',
    icon: Message,
    isNew: true
  },
  {
    path: '/workspace',
    title: '工作区',
    icon: Folder
  },
  {
    path: '/achievements',
    title: '成果库',
    icon: Document
  },
  {
    path: '/tasks',
    title: '所有任务',
    icon: List
  },
  {
    path: '/settings',
    title: '设置',
    icon: Setting
  }
]

// 判断是否激活
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// 导航点击
const handleNavClick = (path: string) => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }
  router.push(path)
}

// 用户菜单命令
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'subscription':
      router.push('/subscription')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 登录
const handleLogin = () => {
  router.push('/login')
}

// 注册
const handleRegister = () => {
  router.push('/register')
}

// 退出登录
const handleLogout = () => {
  authStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  sidebarVisible.value = !isMobile.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F9FAFB;
}

/* 顶部导航栏 */
.top-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 1000;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  letter-spacing: -0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-dropdown:hover {
  background-color: #F3F4F6;
}

.username {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: #9CA3AF;
}

/* 主体内容 */
.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧导航栏 */
.sidebar {
  width: 260px;
  background-color: #F9FAFB;
  padding: 24px 12px;
  overflow-y: auto;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-item:hover {
  background-color: #F3F4F6;
}

.nav-item-active {
  background-color: #EEF2FF;
  color: #667eea;
}

.nav-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.nav-item-active .nav-text {
  color: #667eea;
  font-weight: 600;
}

.new-tag {
  margin-left: auto;
  padding: 2px 6px;
  font-size: 12px;
}

/* 主内容区域 */
.main-content {
  background-color: white;
  overflow-y: auto;
  flex: 1;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

/* 移动端导航切换按钮 */
.mobile-nav-toggle {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s;
}

.mobile-nav-toggle:hover {
  transform: scale(1.1);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .sidebar.sidebar-visible {
    transform: translateX(0);
  }

  .mobile-nav-toggle {
    display: flex;
  }

  .content-wrapper {
    padding: 16px;
  }
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background-color: #D1D5DB;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
