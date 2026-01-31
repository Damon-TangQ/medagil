<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="logo" />
        <span v-show="!isCollapse" class="logo-text">Medagil AI</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/projects">
          <el-icon><FolderOpened /></el-icon>
          <template #title>项目列表</template>
        </el-menu-item>

        <el-menu-item index="/projects/create">
          <el-icon><Plus /></el-icon>
          <template #title>创建项目</template>
        </el-menu-item>

        <el-menu-item index="/subscription">
          <el-icon><Wallet /></el-icon>
          <template #title>订阅管理</template>
        </el-menu-item>

        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <template #title>个人中心</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-container class="main-content">
      <!-- 顶部状态栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 订阅状态 -->
          <el-tag v-if="user" :type="subscriptionTagType" size="small" class="subscription-tag">
            {{ subscriptionText }}
          </el-tag>

          <!-- 用户信息 -->
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-info">
              <el-avatar :size="32" :src="user?.avatar || defaultAvatar" />
              <span class="username">{{ user?.nickname || user?.username }}</span>
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
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  FolderOpened,
  Plus,
  Wallet,
  User,
  Fold,
  Expand,
  SwitchButton
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 用户信息
const user = computed(() => authStore.user)

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 当前路由名称
const currentRoute = computed(() => route.meta.title as string)

// 订阅状态文本
const subscriptionText = computed(() => {
  const level = user.value?.subscriptionLevel || 0
  const texts = ['免费版', '基础版', '高级版', '企业版']
  return texts[level] || '免费版'
})

// 订阅标签类型
const subscriptionTagType = computed(() => {
  const level = user.value?.subscriptionLevel || 0
  const types = ['info', 'warning', 'success', 'danger']
  return types[level] || 'info'
})

// 切换侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'subscription':
      router.push('/subscription')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await authStore.logout()
        ElMessage.success('已退出登录')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

// 监听路由变化，更新页面标题
watch(
  () => route.meta.title,
  (title) => {
    if (title) {
      document.title = `${title} - Medagil AI平台`
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100%;
}

/* 侧边栏样式 */
.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}

.logo-container {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #2b3a4a;
  overflow: hidden;
}

.logo {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  margin-left: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
}

.sidebar-menu {
  border-right: none;
  background-color: #304156;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #bfcbd9;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: #263445;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  color: #409eff;
  background-color: #263445;
}

/* 顶部状态栏样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.collapse-icon:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.subscription-tag {
  margin-right: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
}

/* 主内容区域样式 */
.content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
  }

  .main-content {
    margin-left: 0;
  }

  .logo-text {
    display: none;
  }

  .username {
    display: none;
  }

  .header {
    padding: 0 12px;
  }

  .content {
    padding: 12px;
  }
}
</style>
