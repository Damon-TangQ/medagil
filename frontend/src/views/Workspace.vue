<template>
  <div class="workspace-page">
    <div class="page-header">
      <h1 class="page-title">工作区</h1>
      <el-button type="primary" :icon="Plus" @click="handleCreateProject">
        创建新项目
      </el-button>
    </div>

    <div class="workspace-filters">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索项目..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-select v-model="selectedCategory" placeholder="选择分类" clearable>
        <el-option label="全部分类" value="all" />
        <el-option label="文献分析" value="literature" />
        <el-option label="数据分析" value="analysis" />
        <el-option label="AI对话" value="chat" />
        <el-option label="可视化" value="visualization" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
        <el-option label="全部状态" value="all" />
        <el-option label="进行中" value="ongoing" />
        <el-option label="已完成" value="completed" />
        <el-option label="已归档" value="archived" />
      </el-select>
    </div>

    <div class="project-grid">
      <el-card
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        :data-status="project.status"
        shadow="hover"
        @click="handleProjectClick(project)"
      >
        <div class="project-cover">
          <div class="cover-placeholder" :style="{ background: project.color }">
            <el-icon :size="48" color="white">
              <component :is="project.icon" />
            </el-icon>
          </div>
          <el-tag :type="getStatusType(project.status)" size="small" class="status-tag">
            {{ getStatusText(project.status) }}
          </el-tag>
        </div>

        <div class="project-info">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>

          <div class="project-meta">
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ formatDate(project.updatedAt) }}</span>
            </div>
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ project.members }}人协作</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-empty v-if="filteredProjects.length === 0" description="暂无项目" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  Folder,
  Document,
  ChatDotRound,
  DataBoard,
  Clock,
  User
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

const router = useRouter()
const authStore = useAuthStore()
const searchKeyword = ref('')
const selectedCategory = ref('all')
const selectedStatus = ref('all')

const projects = ref([
  {
    id: 1,
    name: '医学文献分析项目',
    description: '使用AI分析最新的心血管疾病研究文献',
    category: 'literature',
    status: 'ongoing',
    icon: Document,
    color: 'linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%)',
    members: 5,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 2,
    name: '临床数据分析',
    description: '分析患者数据，探索疾病模式',
    category: 'analysis',
    status: 'completed',
    icon: DataBoard,
    color: 'linear-gradient(135deg, rgba(240, 147, 251, 0.7) 0%, rgba(245, 87, 108, 0.7) 100%)',
    members: 3,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 3,
    name: 'AI科研助手对话',
    description: '关于机器学习在医学影像中的应用研究',
    category: 'chat',
    status: 'ongoing',
    icon: ChatDotRound,
    color: 'linear-gradient(135deg, rgba(79, 172, 254, 0.7) 0%, rgba(0, 242, 254, 0.7) 100%)',
    members: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
  },
  {
    id: 4,
    name: '数据可视化展示',
    description: '创建交互式数据可视化图表',
    category: 'visualization',
    status: 'archived',
    icon: Folder,
    color: 'linear-gradient(135deg, rgba(67, 233, 123, 0.7) 0%, rgba(56, 249, 215, 0.7) 100%)',
    members: 4,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  }
])

const filteredProjects = computed(() => {
  let result = projects.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
    )
  }

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 状态筛选
  if (selectedStatus.value !== 'all') {
    result = result.filter(p => p.status === selectedStatus.value)
  }

  return result
})

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    ongoing: 'primary',
    completed: 'success',
    archived: 'info'
  }
  return statusMap[status] || ''
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    ongoing: '进行中',
    completed: '已完成',
    archived: '已归档'
  }
  return statusMap[status] || status
}

const handleProjectClick = (project: any) => {
  if (!authStore.requireAuth()) {
    return
  }
  router.push(`/projects/${project.id}`)
}

const handleCreateProject = () => {
  if (!authStore.requireAuth()) {
    return
  }
  router.push('/projects/create')
}
</script>

<style scoped>
.workspace-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: var(--bg-primary, #f5f5f7);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header :deep(.el-button--primary) {
  background: #8b5cf6;
  border: none;
  color: #ffffff;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.25);
  transition: all 0.3s;
}

.page-header :deep(.el-button--primary:hover) {
  background: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  transform: translateY(-1px);
}

.page-title {
  font-size: 32px;
  font-weight: var(--font-weight-title, 600);
  color: var(--text-primary, #1d1d1f);
}

.workspace-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.workspace-filters :deep(.el-input__wrapper) {
  background-color: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #d2d2d7);
  border-radius: var(--radius-sm, 8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.workspace-filters :deep(.el-input__wrapper:hover) {
  border-color: var(--primary, #8b5cf6);
}

.workspace-filters :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.workspace-filters :deep(.el-input__inner) {
  color: var(--text-primary, #1d1d1f);
}

.workspace-filters :deep(.el-input__inner::placeholder) {
  color: var(--text-secondary, #86868b);
}

.workspace-filters :deep(.el-select .el-input__wrapper) {
  background-color: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #d2d2d7);
  border-radius: var(--radius-sm, 8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.workspace-filters :deep(.el-select .el-input__wrapper:hover) {
  border-color: var(--primary, #8b5cf6);
}

.workspace-filters :deep(.el-select .el-input__wrapper.is-focus) {
  border-color: var(--primary, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.workspace-filters :deep(.el-select .el-input__inner) {
  color: var(--text-primary, #1d1d1f);
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.project-card {
  background: #ffffff;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  cursor: pointer;
  transition: all var(--transition-normal, 0.3s);
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  background: #ffffff;
  box-shadow: var(--shadow-card, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.project-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #8b5cf6;
}

.project-card[data-status="completed"]::before {
  background-color: #10b981;
}

.project-cover {
  position: relative;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-tag {
  position: absolute;
  top: 12px;
  right: 12px;
}

.project-info {
  padding: 0 4px;
}

.project-name {
  font-size: 18px;
  font-weight: var(--font-weight-title, 600);
  color: var(--text-primary, #1d1d1f);
  margin-bottom: 8px;
}

.project-description {
  font-size: 14px;
  color: var(--text-secondary, #86868b);
  line-height: var(--line-height-normal, 1.5);
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.05));
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary, #94a3b8);
}

@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .workspace-filters {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
