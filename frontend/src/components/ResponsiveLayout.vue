<template>
  <div class="responsive-layout" :class="layoutClass">
    <!-- 移动端顶部导航 -->
    <div class="mobile-top-nav show-mobile">
      <div class="nav-header">
        <h1 class="nav-title">{{ title }}</h1>
        <el-button circle text @click="handleMenuClick">
          <el-icon><Menu /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <el-icon :size="24"><DataBoard /></el-icon>
          <span class="sidebar-logo-text">MedAGI</span>
        </div>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><DataBoard /></el-icon>
          <span class="sidebar-menu-item-text">数据看板</span>
        </el-menu-item>
        <el-menu-item index="projects">
          <el-icon><Folder /></el-icon>
          <span class="sidebar-menu-item-text">项目管理</span>
        </el-menu-item>
        <el-menu-item index="agents">
          <el-icon><MagicStick /></el-icon>
          <span class="sidebar-menu-item-text">智能体</span>
        </el-menu-item>
        <el-menu-item index="documents">
          <el-icon><Document /></el-icon>
          <span class="sidebar-menu-item-text">文档管理</span>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          <span class="sidebar-menu-item-text">系统设置</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <slot />
    </div>

    <!-- 移动端底部导航 -->
    <div class="bottom-nav show-mobile">
      <div
        v-for="item in bottomNavItems"
        :key="item.name"
        :class="['nav-item', { active: activeMenu === item.name }]"
        @click="handleMenuSelect(item.name)"
      >
        <el-icon :size="24">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <!-- 移动端菜单抽屉 -->
    <el-drawer
      v-model="mobileMenuVisible"
      direction="ltr"
      :with-header="false"
      size="240px"
      class="mobile-menu-drawer"
    >
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="projects">
          <el-icon><Folder /></el-icon>
          <span>项目管理</span>
        </el-menu-item>
        <el-menu-item index="agents">
          <el-icon><MagicStick /></el-icon>
          <span>智能体</span>
        </el-menu-item>
        <el-menu-item index="documents">
          <el-icon><Document /></el-icon>
          <span>文档管理</span>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Menu,
  DataBoard,
  Folder,
  MagicStick,
  Document,
  Setting
} from '@element-plus/icons-vue'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'MedAGI'
})

const emit = defineEmits<{
  (e: 'menu-select', name: string): void
}>()

// 当前激活的菜单
const activeMenu = ref('dashboard')

// 侧边栏是否折叠
const isCollapsed = ref(false)

// 移动端菜单可见性
const mobileMenuVisible = ref(false)

// 底部导航项
const bottomNavItems = [
  { name: 'dashboard', label: '首页', icon: DataBoard },
  { name: 'projects', label: '项目', icon: Folder },
  { name: 'agents', label: '智能体', icon: MagicStick },
  { name: 'profile', label: '我的', icon: Document }
]

// 布局类名
const layoutClass = computed(() => {
  if (window.innerWidth >= 1024) {
    return 'desktop'
  } else if (window.innerWidth >= 768) {
    return 'tablet'
  } else {
    return 'mobile'
  }
})

// 处理菜单点击
const handleMenuSelect = (name: string) => {
  activeMenu.value = name
  mobileMenuVisible.value = false
  emit('menu-select', name)
}

// 处理移动端菜单按钮点击
const handleMenuClick = () => {
  mobileMenuVisible.value = true
}

// 处理窗口大小变化
const handleResize = () => {
  const width = window.innerWidth
  isCollapsed.value = width < 1024 && width >= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.responsive-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;

  // 移动端样式 (< 768px)
  @media (max-width: 767px) {
    .sidebar {
      display: none;
    }

    .main-content {
      width: 100%;
      padding: 16px;
      padding-bottom: 60px; // 为底部导航留出空间
    }

    .bottom-nav {
      display: flex;
    }

    .mobile-top-nav {
      display: flex;
    }
  }

  // 平板端样式 (768px - 1024px)
  @media (min-width: 768px) and (max-width: 1023px) {
    .sidebar {
      width: 60px;

      .sidebar-menu-item-text {
        display: none;
      }

      .sidebar-logo-text {
        display: none;
      }
    }

    .main-content {
      width: calc(100% - 60px);
      padding: 20px;
    }

    .bottom-nav {
      display: none;
    }

    .mobile-top-nav {
      display: none;
    }
  }

  // 桌面端样式 (>= 1024px)
  @media (min-width: 1024px) {
    .sidebar {
      width: 240px;

      .sidebar-menu-item-text {
        display: inline;
      }

      .sidebar-logo-text {
        display: inline;
      }
    }

    .main-content {
      width: calc(100% - 240px);
      padding: 24px;
    }

    .bottom-nav {
      display: none;
    }

    .mobile-top-nav {
      display: none;
    }
  }
}

// 移动端顶部导航
.mobile-top-nav {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px 16px;

  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .nav-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }
}

// 侧边栏
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 50;
  overflow-y: auto;

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
  }

  .sidebar-menu {
    border-right: none;
  }
}

// 主内容区
.main-content {
  margin-left: 0;
  transition: all 0.3s ease;
}

// 底部导航
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s;
    color: #909399;

    &.active {
      color: #409eff;
    }

    span {
      font-size: 12px;
    }
  }
}

// 移动端菜单抽屉
.mobile-menu-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
  }

  .sidebar-menu {
    border-right: none;
  }
}
</style>
