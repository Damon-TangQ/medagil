<template>
  <div class="my-tasks-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">我的任务</h1>
      <p class="page-subtitle">记录和管理您的所有提问任务</p>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-list">
      <div v-for="task in tasks" :key="task.id" class="task-item" @click="handleTaskClick(task)">
        <div class="task-icon">
          <el-icon :size="24"><ChatLineSquare /></el-icon>
        </div>
        <div class="task-content">
          <div class="task-title">{{ task.question }}</div>
          <div class="task-meta">
            <span class="task-time">{{ formatTime(task.createdAt) }}</span>
            <span class="task-status" :class="task.status">{{ getStatusText(task.status) }}</span>
          </div>
        </div>
        <el-icon class="task-arrow"><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="tasks.length === 0" class="empty-state">
      <el-icon :size="64" color="#d2d2d7"><ChatLineSquare /></el-icon>
      <p class="empty-text">暂无任务记录</p>
      <p class="empty-desc">开始提问后，您的任务记录将显示在这里</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChatLineSquare, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()

// 任务数据
const tasks = ref(tasksStore.tasks)

// 格式化时间
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    processing: '处理中',
    pending: '等待中'
  }
  return statusMap[status] || status
}

// 点击任务
const handleTaskClick = (task: any) => {
  ElMessage.info(`查看任务：${task.question}`)
  // TODO: 跳转到任务详情页
  // router.push(`/my-tasks/${task.id}`)
}

onMounted(() => {
  // 任务数据已从 localStorage 加载
})
</script>

<style scoped>
.my-tasks-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-card);
}

.task-item:hover {
  background-color: var(--bg-hover);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.task-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-active) 100%);
  border-radius: var(--radius-sm);
  color: var(--text-button);
  flex-shrink: 0;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.task-status {
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.task-status.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.task-status.processing {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.task-status.pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.task-arrow {
  color: var(--text-secondary);
  transition: transform var(--transition-normal);
}

.task-item:hover .task-arrow {
  transform: translateX(4px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 20px 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
