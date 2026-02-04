<template>
  <div class="inbox-page">
    <div class="page-header">
      <h1 class="page-title">AI收件箱</h1>
      <p class="page-subtitle">接收和管理AI任务结果</p>
    </div>

    <div class="inbox-filters">
      <el-radio-group v-model="filterType" size="large">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="unread">未读</el-radio-button>
        <el-radio-button value="starred">已收藏</el-radio-button>
      </el-radio-group>

      <el-input
        v-model="searchKeyword"
        placeholder="搜索消息..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <div class="inbox-list">
      <el-card
        v-for="message in filteredMessages"
        :key="message.id"
        class="message-card"
        :class="{ 'message-unread': !message.isRead }"
        shadow="hover"
      >
        <div class="message-header">
          <div class="message-title">
            <el-icon :size="20" :color="message.color">
              <component :is="message.icon" />
            </el-icon>
            <span>{{ message.title }}</span>
          </div>
          <div class="message-actions">
            <el-button
              text
              :icon="message.isStarred ? StarFilled : Star"
              @click="toggleStar(message)"
            />
            <el-button text :icon="Delete" @click="deleteMessage(message.id)" />
          </div>
        </div>

        <div class="message-content">
          <p>{{ message.content }}</p>
        </div>

        <div class="message-footer">
          <span class="message-time">{{ formatTime(message.time) }}</span>
          <el-tag :type="getMessageType(message.type)" size="small">
            {{ message.type }}
          </el-tag>
        </div>
      </el-card>

      <el-empty v-if="filteredMessages.length === 0" description="暂无消息" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star,
  StarFilled,
  Delete,
  Document,
  ChatDotRound,
  DataBoard,
  TrendCharts
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

const authStore = useAuthStore()
const filterType = ref('all')
const searchKeyword = ref('')

const messages = ref([
  {
    id: 1,
    title: '文献分析完成',
    content: '您提交的文献分析任务已完成，共分析15篇文献，发现3个重要研究方向。',
    time: new Date(Date.now() - 1000 * 60 * 5),
    type: '分析结果',
    isRead: false,
    isStarred: false,
    icon: markRaw(Document),
    color: '#667eea'
  },
  {
    id: 2,
    title: 'AI助手回复',
    content: '关于您提出的"机器学习在医学影像中的应用"问题，我为您整理了相关资料...',
    time: new Date(Date.now() - 1000 * 60 * 30),
    type: '对话消息',
    isRead: true,
    isStarred: true,
    icon: markRaw(ChatDotRound),
    color: '#764ba2'
  },
  {
    id: 3,
    title: '数据分析报告',
    content: '您的数据分析项目已生成可视化报告，包含3个图表和详细分析说明。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: '数据报告',
    isRead: true,
    isStarred: false,
    icon: markRaw(DataBoard),
    color: '#f093fb'
  },
  {
    id: 4,
    title: '趋势预测更新',
    content: '基于最新数据，我们更新了您关注的研究领域趋势预测报告。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: '预测分析',
    isRead: true,
    isStarred: false,
    icon: markRaw(TrendCharts),
    color: '#4facfe'
  }
])

const filteredMessages = computed(() => {
  let result = messages.value

  // 类型筛选
  if (filterType.value === 'unread') {
    result = result.filter(m => !m.isRead)
  } else if (filterType.value === 'starred') {
    result = result.filter(m => m.isStarred)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(m =>
      m.title.toLowerCase().includes(keyword) ||
      m.content.toLowerCase().includes(keyword)
    )
  }

  return result.sort((a, b) => b.time.getTime() - a.time.getTime())
})

const formatTime = (date: Date) => {
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

const getMessageType = (type: string) => {
  const typeMap: Record<string, any> = {
    '分析结果': 'primary',
    '对话消息': 'info',
    '数据报告': 'warning',
    '预测分析': 'info'
  }
  return typeMap[type] || ''
}

const toggleStar = (message: any) => {
  if (!authStore.requireAuth()) {
    return
  }
  message.isStarred = !message.isStarred
  ElMessage.success(message.isStarred ? '已收藏' : '已取消收藏')
}

const deleteMessage = (id: number) => {
  if (!authStore.requireAuth()) {
    return
  }
  ElMessageBox.confirm('确定要删除这条消息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    messages.value = messages.value.filter(m => m.id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.inbox-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: var(--bg-primary, #f5f5f7);
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: var(--font-weight-title, 600);
  color: #1d1d1f;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #86868b;
}

.inbox-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.inbox-filters :deep(.el-radio-group) {
  background-color: transparent;
  border: none;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  gap: 8px;
}

.inbox-filters :deep(.el-radio-button) {
  background-color: #ffffff;
  border: 1px solid #d2d2d7;
  color: #86868b;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 400;
  transition: all 0.3s;
}

.inbox-filters :deep(.el-radio-button:hover) {
  background-color: #f2f2f7;
  color: #1d1d1f;
}

.inbox-filters :deep(.el-radio-button__original-radio) {
  display: none;
}

.inbox-filters :deep(.el-radio-button.is-active) {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  box-shadow: none;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: #ffffff;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #8b5cf6;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-input :deep(.el-input__inner) {
  color: #1d1d1f;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #86868b;
}

.search-input :deep(.el-input__prefix) {
  color: #86868b;
}

.inbox-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-card {
  background: #ffffff;
  border: none;
  border-radius: 12px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.message-card:hover {
  transform: translateY(-2px);
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.message-unread {
  background: rgba(139, 92, 246, 0.05);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
}

.message-actions {
  display: flex;
  gap: 8px;
}

.message-content {
  margin-bottom: 16px;
  color: #86868b;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-light, #d2d2d7);
}

.message-time {
  font-size: 12px;
  color: #86868b;
}

.message-footer :deep(.el-tag) {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: none;
}

.message-footer :deep(.el-tag--info) {
  background-color: #3b82f6;
}

@media screen and (max-width: 768px) {
  .inbox-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
