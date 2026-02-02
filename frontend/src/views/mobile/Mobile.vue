<template>
  <div class="mobile-app">
    <!-- 主内容区 -->
    <div class="content-area">
      <component :is="currentComponent" />
    </div>

    <!-- 底部Tab栏 -->
    <div class="tab-bar">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        :class="['tab-item', { active: activeTab === tab.name }]"
        @click="handleTabChange(tab.name)"
      >
        <el-icon :size="24">
          <component :is="tab.icon" />
        </el-icon>
        <span>{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Folder, User } from '@element-plus/icons-vue'
import Home from './Home.vue'
import Projects from './Projects.vue'
import Profile from './Profile.vue'

// 当前激活的Tab
const activeTab = ref('home')

// Tab配置
const tabs = [
  { name: 'home', label: '首页', icon: ChatDotRound },
  { name: 'projects', label: '项目', icon: Folder },
  { name: 'profile', label: '我的', icon: User }
]

// 当前组件
const currentComponent = computed(() => {
  const componentMap = {
    home: Home,
    projects: Projects,
    profile: Profile
  }
  return componentMap[activeTab.value as keyof typeof componentMap]
})

// Tab切换
const handleTabChange = (name: string) => {
  activeTab.value = name
  ElMessage.success(`切换到${tabs.find(t => t.name === name)?.label}`)
}
</script>

<style scoped lang="scss">
.mobile-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;

  // 主内容区
  .content-area {
    flex: 1;
    overflow: hidden;
  }

  // 底部Tab栏
  .tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 56px;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    padding-bottom: env(safe-area-inset-bottom);

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      cursor: pointer;
      transition: all 0.3s;
      color: #909399;

      &:active {
        transform: scale(0.95);
      }

      &.active {
        color: #409eff;
      }

      span {
        font-size: 12px;
      }
    }
  }
}
</style>
