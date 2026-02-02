<template>
  <div class="tasks-page">
    <div class="page-header">
      <h1 class="page-title">所有任务</h1>
      <el-button type="primary" :icon="Plus" @click="handleCreateTask">
        创建任务
      </el-button>
    </div>

    <div class="tasks-filters">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索任务..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
        <el-option label="全部状态" value="all" />
        <el-option label="待处理" value="pending" />
        <el-option label="进行中" value="processing" />
        <el-option label="已完成" value="completed" />
        <el-option label="已失败" value="failed" />
      </el-select>
      <el-select v-model="selectedPriority" placeholder="优先级" clearable>
        <el-option label="全部优先级" value="all" />
        <el-option label="高" value="high" />
        <el-option label="中" value="medium" />
        <el-option label="低" value="low" />
      </el-select>
    </div>

    <div class="tasks-list">
      <el-card
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card"
        :class="`task-${task.status}`"
        shadow="hover"
      >
        <div class="task-header">
          <div class="task-title">
            <el-icon :size="20" :color="getPriorityColor(task.priority)">
              <component :is="getPriorityIcon(task.priority)" />
            </el-icon>
            <span>{{ task.title }}</span>
          </div>
          <el-tag :type="getStatusType(task.status)" size="small">
            {{ getStatusText(task.status) }}
          </el-tag>
        </div>

        <p class="task-description">{{ task.description }}</p>

        <div class="task-meta">
          <div class="meta-item">
            <el-icon><Clock /></el-icon>
            <span>{{ formatDate(task.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <el-icon><User /></el-icon>
            <span>{{ task.assignee }}</span>
          </div>
          <div class="meta-item">
            <el-icon><Folder /></el-icon>
            <span>{{ task.project }}</span>
          </div>
        </div>

        <div class="task-actions">
          <el-button text type="primary" :icon="View" @click="handleViewTask(task)">
            查看
          </el-button>
          <el-button text :icon="Edit" @click="handleEditTask(task)">
            编辑
          </el-button>
          <el-button text type="danger" :icon="Delete" @click="handleDeleteTask(task)">
            删除
          </el-button>
        </div>
      </el-card>

      <el-empty v-if="filteredTasks.length === 0" description="暂无任务" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Clock,
  User,
  Folder,
  View,
  Edit,
  Delete,
  Warning,
  InfoFilled,
  SuccessFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const selectedStatus = ref('all')
const selectedPriority = ref('all')

const tasks = ref([
  {
    id: 1,
    title: '分析心血管疾病文献',
    description: '使用AI模型分析最新的心血管疾病研究文献，提取关键信息',
    status: 'processing',
    priority: 'high',
    project: '医学文献分析项目',
    assignee: '张三',
    createdAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    title: '生成数据可视化报告',
    description: '基于分析结果创建交互式数据可视化图表',
    status: 'pending',
    priority: 'medium',
    project: '临床数据分析',
    assignee: '李四',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    title: '整理AI助手对话记录',
    description: '整理并分类AI助手的对话记录，提取有价值的信息',
    status: 'completed',
    priority: 'low',
    project: 'AI科研助手对话',
    assignee: '王五',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 4,
    title: '更新趋势预测模型',
    description: '使用最新数据更新疾病传播趋势预测模型',
    status: 'failed',
    priority: 'high',
    project: '趋势预测分析',
    assignee: '赵六',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
  }
])

const filteredTasks = computed(() => {
  let result = tasks.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (selectedStatus.value !== 'all') {
    result = result.filter(t => t.status === selectedStatus.value)
  }

  // 优先级筛选
  if (selectedPriority.value !== 'all') {
    result = result.filter(t => t.priority === selectedPriority.value)
  }

  return result
})

const formatDate = (date: Date) => {
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

const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    pending: 'info',
    processing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return statusMap[status] || ''
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '进行中',
    completed: '已完成',
    failed: '已失败'
  }
  return statusMap[status] || status
}

const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    high: '#F56C6C',
    medium: '#E6A23C',
    low: '#909399'
  }
  return priorityMap[priority] || '#909399'
}

const getPriorityIcon = (priority: string) => {
  const priorityMap: Record<string, any> = {
    high: Warning,
    medium: InfoFilled,
    low: SuccessFilled
  }
  return priorityMap[priority] || InfoFilled
}

const handleViewTask = (task: any) => {
  router.push(`/tasks/${task.id}`)
}

const handleEditTask = (task: any) => {
  router.push(`/tasks/${task.id}/edit`)
}

const handleDeleteTask = (task: any) => {
  ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tasks.value = tasks.value.filter(t => t.id !== task.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleCreateTask = () => {
  router.push('/tasks/create')
}
</script>

<style scoped>
.tasks-page {
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

.tasks-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  border: none;
  transition: all 0.3s;
}

.task-card:hover {
  transform: translateY(-2px);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.task-description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9CA3AF;
}

.task-actions {
  display: flex;
  gap: 8px;
}

@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .tasks-filters {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .task-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .task-actions {
    flex-direction: column;
  }
}
</style>
