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
  Search,
  Folder,
  Document,
  ChatDotRound,
  DataBoard,
  Clock,
  User
} from '@element-plus/icons-vue'

const router = useRouter()
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
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
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
  router.push(`/projects/${project.id}`)
}

const handleCreateProject = () => {
  router.push('/projects/create')
}
</script>

<style scoped>
.workspace-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.workspace-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
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
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.project-card:hover {
  transform: translateY(-8px);
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
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.project-description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
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
  border-top: 1px solid #E5E7EB;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9CA3AF;
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
