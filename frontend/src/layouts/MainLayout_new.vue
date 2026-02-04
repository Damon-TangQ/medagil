<template>
  <div class="main-layout">
    <!-- 主体内容 -->
    <div class="main-body">
      <!-- 左侧导航栏 -->
      <aside class="sidebar" :class="{ 'sidebar-visible': sidebarVisible }">
        <!-- Logo 区域 -->
        <div class="sidebar-logo">
          <div class="logo-icon">M</div>
          <div class="logo-text">
            <span class="logo-name">medagil</span>
            <span class="logo-version">Medagil 2.0</span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="sidebar-nav">
          <!-- 新建项目按钮 -->
          <div class="new-project-section">
            <el-button type="primary" class="new-project-btn" @click="handleNewProject">
              <el-icon :size="20"><Plus /></el-icon>
              <span>新建项目</span>
            </el-button>
          </div>

          <div class="nav-module-divider"></div>

          <!-- 核心功能区 -->
          <div class="nav-item search-entry" @click="handleSearch">
            <el-icon :size="20"><Search /></el-icon>
            <span class="nav-text">搜索</span>
          </div>

          <div class="nav-item library-entry" @click="handleLibrary">
            <el-icon :size="20"><Folder /></el-icon>
            <span class="nav-text">库</span>
          </div>

          <div class="nav-module-divider"></div>

          <!-- 项目管理区 -->
          <div class="nav-item" :class="{ 'nav-item-active': isActive('/projects') }" @click="handleNavClick('/projects')">
            <el-icon :size="20"><Folder /></el-icon>
            <span class="nav-text">我的项目</span>
          </div>

          <div class="nav-item" @click="handleNewProject">
            <el-icon :size="20"><Plus /></el-icon>
            <span class="nav-text">新项目</span>
          </div>

          <div class="nav-item" :class="{ 'nav-item-active': isActive('/all-projects') }" @click="handleNavClick('/all-projects')">
            <el-icon :size="20"><Grid /></el-icon>
            <span class="nav-text">所有项目</span>
          </div>
        </nav>

        <!-- 底部区域 -->
        <div class="sidebar-footer">
          <div class="guide-section">
            <div class="guide-icon">
              <el-icon :size="20"><QuestionFilled /></el-icon>
            </div>
            <div class="guide-text">
              <div class="guide-title">新建一个项目以开始</div>
              <div class="guide-desc">开始您的创作之旅</div>
            </div>
          </div>

          <div class="close-sidebar-btn" @click="toggleSidebar">
            <el-icon :size="18"><Close /></el-icon>
            <span>关闭侧栏</span>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <!-- 顶部登录按钮 -->
        <div class="top-right-actions">
          <template v-if="!isLoggedIn">
            <el-button type="primary" @click="handleLogin" class="login-btn">
              登录
            </el-button>
          </template>
          <template v-else>
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userInfo.username }}</span>
            </div>
            <el-dropdown @command="handleUserCommand" trigger="click" class="user-menu-dropdown">
              <div class="user-dropdown">
                <el-icon><ArrowDown /></el-icon>
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
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    账户设置
                  </el-dropdown-item>
                  <el-dropdown-item command="appearance">
                    <el-icon><Brush /></el-icon>
                    界面设置
                  </el-dropdown-item>
                  <el-dropdown-item command="personalize">
                    <el-icon><User /></el-icon>
                    个性化设置
                  </el-dropdown-item>
                  <el-dropdown-item command="share">
                    <el-icon><Share /></el-icon>
                    分享给好友
                  </el-dropdown-item>
                  <el-dropdown-item command="help">
                    <el-icon><QuestionFilled /></el-icon>
                    帮助反馈
                  </el-dropdown-item>
                  <el-dropdown-item command="member">
                    <el-icon><Star /></el-icon>
                    会员中心
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

        <!-- 历史对话记录面板 -->
        <transition name="panel-slide">
          <aside v-if="historyPanelVisible" class="history-panel">
            <div class="history-panel-header">
              <h2 class="history-panel-title">任务列表</h2>
              <el-button class="refresh-button" :icon="Refresh" circle size="small" @click="refreshHistory" />
            </div>
            <div class="history-panel-body">
              <div class="history-search">
                <el-input
                  v-model="historySearchKeyword"
                  placeholder="搜索对话"
                  clearable
                  prefix-icon="Search"
                />
              </div>
              <div class="history-list">
                <div
                  v-for="item in filteredHistoryItems"
                  :key="item.id"
                  class="history-item"
                  :class="{ 'is-active': activeHistoryId === item.id }"
                  @click="selectHistory(item.id)"
                >
                  <div class="history-item-content">
                    <div class="history-item-name">{{ item.name }}</div>
                    <div class="history-item-time">{{ formatHistoryTime(item.time) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </transition>
        <div class="content-wrapper" :class="{ 'panel-open': historyPanelVisible }">
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
  User,
  ArrowDown,
  Wallet,
  SwitchButton,
  Menu,
  Refresh,
  Share,
  Folder,
  Search,
  Star,
  QuestionFilled,
  Setting,
  Brush,
  Plus,
  Grid,
  Close
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 历史对话记录状态
const historyPanelVisible = ref(false)
const historySearchKeyword = ref('')
const activeHistoryId = ref<number | null>(null)

// 模拟历史对话数据
const historyItems = ref([
  {
    id: 1,
    name: '心血管疾病学术论文大纲',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    messages: []
  },
  {
    id: 2,
    name: '医学影像分析报告',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    messages: []
  },
  {
    id: 3,
    name: '临床数据分析结果',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2天前
    messages: []
  },
  {
    id: 4,
    name: 'AI科研助手对话记录',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7天前
    messages: []
  }
])

// 登录状态
const isLoggedIn = computed(() => authStore.isAuthenticated)

// 用户信息
const userInfo = computed(() => authStore.user || { username: '用户', avatar: '' })

// 移动端检测
const isMobile = ref(false)
const sidebarVisible = ref(true)

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

// 新建项目
const handleNewProject = () => {
  if (!authStore.requireAuth()) {
    return
  }
  router.push('/create-project')
}

// 搜索
const handleSearch = () => {
  ElMessage.info('打开搜索')
  // TODO: 实现搜索功能
}

// 库
const handleLibrary = () => {
  ElMessage.info('打开库')
  // TODO: 实现库功能
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
    case 'settings':
      router.push('/settings/account')
      break
    case 'appearance':
      router.push('/settings/appearance')
      break
    case 'personalize':
      router.push('/settings/personalize')
      break
    case 'share':
      ElMessage.info('分享功能即将上线')
      break
    case 'help':
      router.push('/help')
      break
    case 'member':
      router.push('/member')
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

// 刷新历史记录
const refreshHistory = () => {
  ElMessage.success('历史记录已刷新')
  // 实际项目中这里应该调用API刷新数据
}

// 格式化历史记录时间
const formatHistoryTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// 选择历史记录
const selectHistory = (id: number) => {
  activeHistoryId.value = id
  // 实际项目中这里应该加载对应对话的详细内容
  ElMessage.success('已加载历史对话')
}

// 过滤历史记录
const filteredHistoryItems = computed(() => {
  if (!historySearchKeyword.value) return historyItems.value
  const keyword = historySearchKeyword.value.toLowerCase()
  return historyItems.value.filter(item =>
    item.name.toLowerCase().includes(keyword)
  )
})

// 检测屏幕尺寸
const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
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
  background-color: #f5f5f7;
}

/* 主体内容 */
.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 顶部右侧操作区域 */
.top-right-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
}

/* 登录按钮 */
.login-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border: none;
  border-radius: 8px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.95);
}

.user-avatar {
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.username {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

/* 用户下拉菜单 */
.user-menu-dropdown {
  cursor: pointer;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
}

.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

/* 左侧导航栏 */
.sidebar {
  width: 200px;
  background-color: #f5f5f7;
  padding: 20px 8px;
  overflow-y: auto;
  flex-shrink: 0;
  transition: transform var(--transition-normal, 0.3s), width var(--transition-normal, 0.3s);
  border-right: 1px solid #d2d2d7;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  position: sticky;
  top: 0;
}

/* Logo 区域 */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.logo-version {
  font-size: 11px;
  color: #86868b;
  font-weight: 400;
}

/* 导航菜单 */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* 新建项目按钮区域 */
.new-project-section {
  margin-bottom: 8px;
}

.new-project-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border: none;
  border-radius: 10px;
  transition: all 0.3s;
}

.new-project-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 导航模块分隔线 */
.nav-module-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 14px;
}

/* 导航项 */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  position: relative;
  margin-bottom: 2px;
  font-size: 14px;
  color: #1d1d1f;
  min-height: 40px;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
  transform: translateX(2px);
}

.nav-item-active {
  background-color: #2d2d32;
  color: #ffffff;
  font-weight: 500;
}

.nav-item-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: #8b5cf6;
  border-radius: 0 2px 2px 0;
}

.nav-text {
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1f;
  line-height: 1.4;
}

.nav-item-active .nav-text {
  color: #ffffff;
  font-weight: 500;
}

/* 底部区域 */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: 8px;
  border-top: 1px solid #d2d2d7;
  flex-shrink: 0;
}

/* 引导区域 */
.guide-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: rgba(139, 92, 246, 0.05);
}

.guide-section:hover {
  background-color: rgba(139, 92, 246, 0.1);
}

.guide-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  color: #8b5cf6;
  flex-shrink: 0;
}

.guide-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.guide-title {
  font-size: 13px;
  font-weight: 500;
  color: #1d1d1f;
}

.guide-desc {
  font-size: 11px;
  color: #86868b;
}

/* 关闭侧栏按钮 */
.close-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
  font-size: 13px;
}

.close-sidebar-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

/* 主内容区域 */
.main-content {
  background-color: #f5f5f7;
  overflow-y: auto;
  flex: 1;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.content-wrapper.panel-open {
  max-width: calc(100% - 240px);
}

/* 历史对话记录面板 */
.history-panel {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 240px;
  background-color: var(--bg-secondary, #1a1a1c);
  border-right: 1px solid var(--border-dark, #3a3a3c);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  z-index: 999;
  overflow-y: auto;
  transition: transform var(--transition-normal, 0.3s) var(--ease-out, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.history-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-dark, #3a3a3c);
}

.history-panel-title {
  font-size: 16px;
  font-weight: var(--font-weight-title, 600);
  color: var(--text-sidebar, #e5e5e7);
  margin: 0;
}

.refresh-button {
  color: var(--text-sidebar, #e5e5e7);
  background-color: transparent;
  border: none;
}

.refresh-button:hover {
  color: var(--text-sidebar, #e5e5e7);
  background-color: rgba(255, 255, 255, 0.1);
}

.history-panel-body {
  padding: 16px;
}

.history-search {
  margin-bottom: 16px;
}

.history-search :deep(.el-input__wrapper) {
  background-color: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #d2d2d7);
  border-radius: var(--radius-sm, 8px);
}

.history-search :deep(.el-input__inner) {
  color: var(--text-primary, #1d1d1f);
}

.history-search :deep(.el-input__inner::placeholder) {
  color: var(--text-secondary, #86868b);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  transition: all var(--transition-normal, 0.3s) var(--ease-out, cubic-bezier(0.215, 0.61, 0.355, 1));
  background-color: transparent;
}

.history-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.history-item.is-active {
  background-color: rgba(139, 92, 246, 0.2);
  border-left: 3px solid var(--primary, #8b5cf6);
}

.history-item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item-name {
  font-size: 14px;
  font-weight: var(--font-weight-body, 400);
  color: var(--text-sidebar, #e5e5e7);
  flex: 1;
}

.history-item-time {
  font-size: 12px;
  color: var(--text-sidebar, #e5e5e7);
}

/* 面板滑入动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from {
  transform: translateX(-100%);
}

.panel-slide-leave-to {
  transform: translateX(-100%);
}

.panel-slide-enter-to {
  transform: translateX(0);
}

.panel-slide-leave-from {
  transform: translateX(0);
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
/* 超大屏 > 1920px */
@media screen and (min-width: 1921px) {
  .sidebar {
    width: 320px;
  }

  .content-wrapper {
    max-width: 1400px;
    padding: 48px 32px;
  }
}

/* 大屏 1441px - 1920px */
@media screen and (min-width: 1441px) {
  .sidebar {
    width: 280px;
  }

  .content-wrapper {
    max-width: 1200px;
    padding: 40px 28px;
  }
}

/* 桌面端 1024px - 1440px */
@media screen and (min-width: 1024px) and (max-width: 1440px) {
  .sidebar {
    width: 260px;
  }

  .content-wrapper {
    max-width: 1100px;
    padding: 32px 24px;
  }
}

/* 平板端 768px - 1023px */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .sidebar {
    width: 220px;
  }

  .sidebar-nav {
    gap: 2px;
  }

  .nav-item {
    padding: 10px 12px;
  }

  .nav-text {
    font-size: 13px;
  }

  .content-wrapper {
    max-width: 100%;
    padding: 24px 20px;
  }
}

/* 移动端 < 768px */
@media screen and (max-width: 767px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    width: 280px;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  }

  .sidebar.sidebar-visible {
    transform: translateX(0);
  }

  .mobile-nav-toggle {
    display: flex;
  }

  .content-wrapper {
    max-width: 100%;
    padding: 16px;
  }

  .top-header {
    padding: 0 16px;
  }
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background-color: #D1D5DB;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover {
  background-color: #9CA3AF;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
