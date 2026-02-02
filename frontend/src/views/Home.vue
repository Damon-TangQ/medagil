<template>
  <div class="home-page">
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用 Medagil AI 医学科研平台</h1>
      <p class="welcome-subtitle">智能驱动，加速科研创新</p>
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="handleStart">
          <el-icon><Promotion /></el-icon>
          开始使用
        </el-button>
        <el-button size="large" @click="handleLearnMore">
          了解更多
        </el-button>
      </div>
    </div>

    <div class="features-grid">
      <el-card
        v-for="feature in features"
        :key="feature.title"
        class="feature-card"
        shadow="hover"
      >
        <div class="feature-icon">
          <el-icon :size="40" :color="feature.color">
            <component :is="feature.icon" />
          </el-icon>
        </div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
      </el-card>
    </div>

    <div class="stats-section">
      <div class="stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-item"
        >
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Promotion, Document, ChatDotRound, DataAnalysis } from '@element-plus/icons-vue'

const router = useRouter()

const features = ref([
  {
    title: '智能文献检索',
    description: '基于AI的智能文献检索系统，快速找到相关研究',
    icon: Document,
    color: '#667eea'
  },
  {
    title: 'AI辅助科研',
    description: '利用AI技术辅助科研工作，提高研究效率',
    icon: ChatDotRound,
    color: '#764ba2'
  },
  {
    title: '数据分析可视化',
    description: '强大的数据分析工具，直观展示研究结果',
    icon: DataAnalysis,
    color: '#f093fb'
  }
])

const stats = ref([
  { label: '用户数', value: '10,000+' },
  { label: '项目数', value: '5,000+' },
  { label: '论文数', value: '20,000+' },
  { label: '引用数', value: '50,000+' }
])

const handleStart = () => {
  router.push('/projects')
}

const handleLearnMore = () => {
  router.push('/about')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.welcome-section {
  text-align: center;
  padding: 80px 24px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.welcome-subtitle {
  font-size: 20px;
  color: #666;
  margin-bottom: 48px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.feature-card {
  text-align: center;
  padding: 32px;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  margin-bottom: 16px;
}

.feature-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

.stats-section {
  background: white;
  padding: 64px 24px;
  margin-top: 80px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #666;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: var(--el-color-primary);
  color: white;
  line-height: 64px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

.el-menu-demo {
  border-bottom: none;
  background-color: transparent;
}

.el-menu-demo .el-menu-item {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  border-radius: 8px;
  margin: 0 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-demo .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.el-menu-demo .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.el-main {
  background-color: var(--el-bg-color-page);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 24px;
}

.content {
  text-align: center;
  max-width: 800px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
  line-height: 1.25;
}

.content p {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin-bottom: 32px;
  line-height: 1.75;
}

.el-footer {
  background-color: var(--el-text-color-primary);
  color: white;
  text-align: center;
  line-height: 64px;
}

.footer-content p {
  margin: 0;
  font-size: 14px;
}
</style>
