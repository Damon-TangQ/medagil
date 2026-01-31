<template>
  <div class="task-chat-container">
    <!-- 左侧对话历史列表 -->
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h3>对话历史</h3>
        <el-button :icon="Plus" circle @click="handleNewChat" />
      </div>

      <div class="chat-list">
        <div
          v-for="chat in chatHistory"
          :key="chat.id"
          :class="['chat-item', { active: currentChatId === chat.id }]"
          @click="handleSelectChat(chat.id)"
        >
          <div class="chat-title">{{ chat.title }}</div>
          <div class="chat-time">{{ formatTime(chat.updatedAt) }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧主区域 -->
    <div class="chat-main">
      <!-- 顶部任务信息 -->
      <div class="task-header">
        <div class="task-info">
          <el-tag :type="taskStatusType" size="small">{{ taskStatusText }}</el-tag>
          <h2>{{ currentChat?.title || '新对话' }}</h2>
        </div>
        <div class="task-actions">
          <el-button link :icon="Share" @click="handleShare">分享</el-button>
          <el-button link :icon="More" @click="handleMore">更多</el-button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageListRef">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-item', message.role]"
        >
          <!-- 用户消息 -->
          <div v-if="message.role === 'user'" class="user-message">
            <el-avatar :size="36" :src="userAvatar" />
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div v-if="message.attachments && message.attachments.length > 0" class="message-attachments">
                <el-tag
                  v-for="(file, idx) in message.attachments"
                  :key="idx"
                  size="small"
                  class="attachment-tag"
                >
                  <el-icon><Paperclip /></el-icon>
                  {{ file.name }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- AI消息 -->
          <div v-else class="ai-message">
            <el-avatar :size="36" :src="aiAvatar" />
            <div class="message-content">
              <div class="message-text">
                <span v-if="isStreaming && index === messages.length - 1">
                  {{ streamingText }}
                  <span class="cursor">|</span>
                </span>
                <span v-else>{{ message.content }}</span>
              </div>

              <!-- AI消息操作按钮 -->
              <div v-if="!isStreaming || index !== messages.length - 1" class="message-actions">
                <el-button link size="small" @click="handleCopy(message.content)">
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
                <el-button link size="small" @click="handleRegenerate(index)">
                  <el-icon><Refresh /></el-icon>
                  重新生成
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务执行步骤 -->
        <div v-if="showSteps" class="task-steps">
          <el-steps :active="currentStep" direction="vertical" finish-status="success">
            <el-step
              v-for="(step, index) in taskSteps"
              :key="index"
              :title="step.title"
              :description="step.description"
            >
              <template #icon>
                <el-icon v-if="index < currentStep" class="step-icon success"><CircleCheck /></el-icon>
                <el-icon v-else-if="index === currentStep" class="step-icon loading"><Loading /></el-icon>
                <el-icon v-else class="step-icon"><Circle /></el-icon>
              </template>
            </el-step>
          </el-steps>
        </div>

        <!-- 空状态 -->
        <div v-if="messages.length === 0 && !isStreaming" class="empty-state">
          <el-icon class="empty-icon"><ChatDotRound /></el-icon>
          <h3>开始新的对话</h3>
          <p>输入您的问题，AI助手将为您提供帮助</p>
        </div>
      </div>

      <!-- 底部输入区域 -->
      <div class="input-area">
        <!-- 附件列表 -->
        <div v-if="attachments.length > 0" class="attachment-list">
          <el-tag
            v-for="(file, index) in attachments"
            :key="index"
            closable
            @close="handleRemoveAttachment(index)"
            class="attachment-item"
          >
            <el-icon><Paperclip /></el-icon>
            {{ file.name }}
          </el-tag>
        </div>

        <!-- 输入框 -->
        <div class="input-wrapper">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            :accept="acceptTypes"
            multiple
            class="upload-button"
          >
            <el-button :icon="Paperclip" circle />
          </el-upload>

          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="1"
            :autosize="{ minRows: 1, maxRows: 6 }"
            placeholder="输入消息，按Enter发送，Shift+Enter换行"
            @keydown="handleKeyDown"
            class="message-input"
          />

          <el-button
            type="primary"
            :icon="Promotion"
            circle
            :loading="isStreaming"
            :disabled="!inputMessage.trim() && attachments.length === 0"
            @click="handleSend"
          />
        </div>

        <div class="input-tips">
          <span>AI生成的内容可能不准确，请核实重要信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Share,
  More,
  Paperclip,
  DocumentCopy,
  Refresh,
  CircleCheck,
  Circle,
  Loading,
  ChatDotRound,
  Promotion
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/task'
import { TASK_STATUS, TASK_STATUS_NAMES } from '@/shared/constants'

const authStore = useAuthStore()
const taskStore = useTaskStore()

// 引用
const messageListRef = ref<HTMLElement>()
const uploadRef = ref()

// 状态
const isStreaming = ref(false)
const streamingText = ref('')
const showSteps = ref(false)
const currentStep = ref(0)

// 输入相关
const inputMessage = ref('')
const attachments = ref<File[]>([])
const acceptTypes = '.txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'

// 用户头像
const userAvatar = computed(() => authStore.user?.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const aiAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 当前对话ID
const currentChatId = ref('')

// 对话历史
const chatHistory = ref([
  {
    id: '1',
    title: '数据分析项目',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '报告生成任务',
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: '智能对话测试',
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
])

// 当前对话
const currentChat = computed(() => {
  return chatHistory.value.find(chat => chat.id === currentChatId.value)
})

// 消息列表
const messages = ref<Array<{
  role: 'user' | 'assistant'
  content: string
  attachments?: Array<{ name: string; url: string }>
}>>([])

// 任务状态
const taskStatus = ref(TASK_STATUS.IN_PROGRESS)

// 任务状态文本
const taskStatusText = computed(() => {
  return TASK_STATUS_NAMES[taskStatus.value] || '进行中'
})

// 任务状态类型
const taskStatusType = computed(() => {
  const typeMap = {
    [TASK_STATUS.IN_PROGRESS]: 'warning',
    [TASK_STATUS.COMPLETED]: 'success',
    [TASK_STATUS.FAILED]: 'danger'
  }
  return typeMap[taskStatus.value] || 'info'
})

// 任务执行步骤
const taskSteps = ref([
  {
    title: '分析用户请求',
    description: '理解用户意图和需求'
  },
  {
    title: '检索相关知识',
    description: '从知识库中获取相关信息'
  },
  {
    title: '生成回复',
    description: '基于检索结果生成回复'
  },
  {
    title: '验证结果',
    description: '检查回复的准确性和完整性'
  }
])

// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 1 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 模拟流式输出
const simulateStreamResponse = async (text: string) => {
  isStreaming.value = true
  streamingText.value = ''
  showSteps.value = true
  currentStep.value = 0

  // 模拟任务执行步骤
  for (let i = 0; i < taskSteps.value.length; i++) {
    currentStep.value = i
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // 逐字输出
  const chars = text.split('')
  for (let i = 0; i < chars.length; i++) {
    streamingText.value += chars[i]
    await scrollToBottom()
    // 随机延迟，模拟真实打字速度
    await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 10))
  }

  // 完成流式输出
  isStreaming.value = false
  showSteps.value = false

  // 添加到消息列表
  messages.value.push({
    role: 'assistant',
    content: text
  })

  await scrollToBottom()
}

// 发送消息
const handleSend = async () => {
  if ((!inputMessage.value.trim() && attachments.value.length === 0) || isStreaming.value) {
    return
  }

  // 添加用户消息
  const userMessage = {
    role: 'user' as const,
    content: inputMessage.value,
    attachments: attachments.value.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
  }

  messages.value.push(userMessage)

  // 清空输入
  inputMessage.value = ''
  attachments.value = []

  await scrollToBottom()

  // 模拟AI响应
  const mockResponse = `这是一个模拟的AI响应。在实际应用中，这里将调用Dify API获取真实的AI响应。

您刚才的问题是：${userMessage.content || '（包含附件）'}

我可以帮您：
1. 分析数据和生成报告
2. 回答问题和提供建议
3. 协助完成各种任务

请继续提问，我会尽力为您提供帮助。`

  await simulateStreamResponse(mockResponse)
}

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

// 文件选择处理
const handleFileChange = (file: any) => {
  if (file.raw) {
    attachments.value.push(file.raw)
  }
}

// 移除附件
const handleRemoveAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

// 复制消息
const handleCopy = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 重新生成
const handleRegenerate = async (index: number) => {
  if (isStreaming.value) return

  // 移除该消息之后的所有消息
  messages.value = messages.value.slice(0, index)

  // 重新发送最后一条用户消息
  const lastUserMessage = [...messages.value].reverse().find(m => m.role === 'user')
  if (lastUserMessage) {
    inputMessage.value = lastUserMessage.content
    handleSend()
  }
}

// 新建对话
const handleNewChat = () => {
  currentChatId.value = ''
  messages.value = []
  ElMessage.success('已创建新对话')
}

// 选择对话
const handleSelectChat = (chatId: string) => {
  currentChatId.value = chatId
  // TODO: 加载对话历史消息
  ElMessage.success('切换对话')
}

// 分享
const handleShare = () => {
  ElMessage.info('分享功能开发中...')
}

// 更多操作
const handleMore = () => {
  ElMessage.info('更多功能开发中...')
}

// 初始化
onMounted(() => {
  // 如果有当前对话ID，加载对话历史
  if (currentChatId.value) {
    // TODO: 加载对话历史消息
  }
})
</script>

<style scoped>
.task-chat-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧边栏 */
.chat-sidebar {
  width: 280px;
  background-color: #202123;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.chat-item.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.chat-title {
  color: #fff;
  font-size: 14px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* 右侧主区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* 任务头部 */
.task-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-info h2 {
  font-size: 18px;
  margin: 0;
  color: #303133;
}

.task-actions {
  display: flex;
  gap: 8px;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.user-message {
  flex-direction: row-reverse;
}

.user-message .message-content {
  background-color: #409eff;
  color: #fff;
  border-radius: 12px 12px 0 12px;
}

.ai-message .message-content {
  background-color: #f5f7fa;
  border-radius: 12px 12px 12px 0;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message-text {
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.message-attachments {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-tag {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.message-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* 任务步骤 */
.task-steps {
  margin: 24px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.task-steps :deep(.el-step__title) {
  font-size: 14px;
  font-weight: 500;
}

.task-steps :deep(.el-step__description) {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.step-icon {
  font-size: 18px;
}

.step-icon.success {
  color: #67c23a;
}

.step-icon.loading {
  color: #409eff;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #409eff;
}

.empty-state h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* 输入区域 */
.input-area {
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px;
  background-color: #fff;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.upload-button {
  flex-shrink: 0;
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  resize: none;
}

.input-tips {
  margin-top: 8px;
  text-align: center;
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .chat-sidebar {
    display: none;
  }

  .message-content {
    max-width: 85%;
  }

  .task-header {
    padding: 12px 16px;
  }

  .message-list {
    padding: 16px;
  }

  .input-area {
    padding: 12px 16px;
  }
}
</style>
