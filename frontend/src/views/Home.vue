<template>
  <div class="home-page">
    <div class="main-content" :class="{ 'has-chat': hasSentMessage }">
      <!-- 欢迎区域 -->
      <div v-if="!hasSentMessage" class="welcome-section">
        <h1 class="welcome-title">Medagil AI，我能为你做什么？</h1>
        <p class="welcome-subtitle">智能科研助手，让研究更高效</p>
      </div>

      <!-- 对话展示区域 -->
      <div v-if="messages.length > 0" class="chat-messages" ref="chatMessagesRef">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-item', message.role]"
        >
          <div v-if="message.role === 'ai'" class="message-avatar">
            <img :src="aiAvatar" alt="AI" class="avatar-image">
          </div>
          <div class="message-content">
            <div v-if="message.role === 'user'" class="message-text user-message">
              {{ message.content }}
            </div>
            <div v-else class="message-text ai-message">
              <span v-html="formatContent(message.displayContent || message.content)"></span>
              <span v-if="message.isTyping" class="typing-cursor"></span>
            </div>
            <div v-if="message.report && message.showReport" class="report-section">
              <div class="report-header">
                <el-icon><Document /></el-icon>
                <span class="report-title">生成报告</span>
              </div>
              <div class="report-content" v-html="message.report"></div>
            </div>
          </div>
        </div>
        <div v-if="isSending" class="loading-indicator">
          <div class="loading-spinner"></div>
          <span class="loading-text">思考中...</span>
        </div>
      </div>

      <!-- 搜索输入框 - 未提问时在功能区上方 -->
      <div v-if="!hasSentMessage" class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <textarea
              v-model="inputMessage"
              class="search-input"
              placeholder="分配一个任务或提问任何问题"
              @keydown="handleKeyDown"
              ref="searchInputRef"
            ></textarea>
          </div>
          <div class="search-icons-wrapper">
            <div class="search-left-icons">
              <el-icon class="add-icon"><Plus /></el-icon>
              <el-icon class="document-icon"><Document /></el-icon>
              <el-icon class="tool-icon"><Grid /></el-icon>
              <!-- 已选择的功能按钮 -->
              <div v-if="selectedActions.length > 0" class="selected-actions">
                <div
                  v-for="action in selectedActions"
                  :key="action.id"
                  class="selected-action-item"
                >
                  <span class="delete-btn" @click.stop="removeSelectedAction(action.id)">×</span>
                  <el-icon :size="16"><component :is="action.icon" /></el-icon>
                  <span>{{ action.name }}</span>
                </div>
              </div>
            </div>
            <div class="search-right-icons">
              <el-icon class="chat-icon"><ChatLineSquare /></el-icon>
              <el-icon class="microphone-icon"><Microphone /></el-icon>
              <el-icon class="send-icon" :class="{ 'is-disabled': !inputMessage.trim() || isSending }" @click="sendMessage">
                ↑
              </el-icon>
            </div>
          </div>
        </div>
        <div class="tool-connect-hint">
          <el-icon :size="16"><Link /></el-icon>
          <span>将您的工具连接到 Medagil</span>
        </div>
      </div>

      <!-- 快捷功能按钮 -->
      <div v-if="!hasSentMessage && selectedActions.length === 0" class="quick-actions">
        <div
          v-for="action in quickActions"
          :key="action.id"
          class="quick-action-item"
          @click="handleQuickAction(action)"
        >
          <el-icon :size="20"><component :is="action.icon" /></el-icon>
          <span>{{ action.name }}</span>
        </div>
        <div class="more-btn-wrapper">
          <div class="quick-action-item more-btn" @click="showMoreActions = !showMoreActions">
            <el-icon :size="20"><MoreFilled /></el-icon>
            <span>更多</span>
          </div>
          <!-- 更多功能展开区 -->
          <transition name="expand">
            <div v-if="showMoreActions" class="more-actions-panel">
              <div
                v-for="action in moreActions"
                :key="action.id"
                class="more-action-item"
                @click="handleQuickAction(action)"
              >
                <el-icon :size="20"><component :is="action.icon" /></el-icon>
                <span>{{ action.name }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 搜索输入框 - 固定在底部 -->
    <div v-if="hasSentMessage" class="search-section is-bottom">
      <div class="search-container">
        <div class="search-input-wrapper">
          <textarea
            v-model="inputMessage"
            class="search-input"
            placeholder="继续对话..."
            @keydown="handleKeyDown"
            ref="searchInputRef"
          ></textarea>
        </div>
        <div class="search-icons-wrapper">
          <div class="search-left-icons">
            <el-icon class="add-icon"><Plus /></el-icon>
            <el-icon class="document-icon"><Document /></el-icon>
            <el-icon class="tool-icon"><Grid /></el-icon>
            <!-- 已选择的功能按钮 -->
            <div v-if="selectedActions.length > 0" class="selected-actions">
              <div
                v-for="action in selectedActions"
                :key="action.id"
                class="selected-action-item"
              >
                <span class="delete-btn" @click.stop="removeSelectedAction(action.id)">×</span>
                <el-icon :size="16"><component :is="action.icon" /></el-icon>
                <span>{{ action.name }}</span>
              </div>
            </div>
          </div>
          <div class="search-right-icons">
            <el-icon class="chat-icon"><ChatLineSquare /></el-icon>
            <el-icon class="microphone-icon"><Microphone /></el-icon>
            <el-icon class="send-icon" :class="{ 'is-disabled': !inputMessage.trim() || isSending }" @click="sendMessage">
              ↑
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Microphone,
  Plus,
  Grid,
  ChatLineSquare
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'
import { useTasksStore } from '@/stores/tasks'
import { chatWithAI } from '@/api'

// 登录拦截
const authStore = useAuthStore()
const tasksStore = useTasksStore()

// 快捷功能数据
const quickActions = ref([
  { id: 1, name: 'AI 文献分析', icon: 'Document' },
  { id: 2, name: 'AI 论文写作', icon: 'EditPen' },
  { id: 3, name: 'AI 基金撰写', icon: 'Trophy' },
  { id: 4, name: 'AI 课题设计', icon: 'School' }
])

// 更多功能数据
const moreActions = ref([
  { id: 6, name: 'AI 选刊助手', icon: 'FolderOpened' },
  { id: 7, name: '文献工具', icon: 'Search' },
  { id: 8, name: '翻译工具', icon: 'ChatLineSquare' },
  { id: 9, name: '格式工具', icon: 'List' },
  { id: 10, name: '制作幻灯片', icon: 'DocumentCopy' },
  { id: 11, name: '创建网站', icon: 'Monitor' },
  { id: 12, name: '个性化设置', icon: 'User' },
  { id: 13, name: '分享给好友', icon: 'Share' },
  { id: 14, name: '积分中心', icon: 'Wallet' }
])

// 更多功能展开状态
const showMoreActions = ref(false)



// 已选择的功能按钮
const selectedActions = ref<Array<{ id: number; name: string; icon: string }>>([])

// 处理快捷功能点击
const handleQuickAction = (action: any) => {
  if (!authStore.requireAuth()) {
    return
  }

  // 特殊处理：文献工具、翻译工具和格式工具
  if (action.id === 7) {
    ElMessage.info('文献工具功能即将上线')
    return
  }
  if (action.id === 8) {
    ElMessage.info('翻译工具功能即将上线')
    return
  }
  if (action.id === 9) {
    ElMessage.info('格式工具功能即将上线')
    return
  }

  // 特殊处理：个性化设置、分享给好友和积分中心
  if (action.id === 12) {
    ElMessage.info('个性化设置功能即将上线')
    return
  }
  if (action.id === 13) {
    ElMessage.info('分享功能即将上线')
    return
  }
  if (action.id === 14) {
    ElMessage.info('积分中心即将上线')
    return
  }

  // 检查是否已经选择过该功能
  const existingIndex = selectedActions.value.findIndex(a => a.id === action.id)
  if (existingIndex === -1) {
    // 如果未选择过，添加到已选择列表
    selectedActions.value.push({
      id: action.id,
      name: action.name,
      icon: action.icon
    })
  }
  // 聚焦到输入框
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
}

// 删除已选择的功能
const removeSelectedAction = (actionId: number) => {
  selectedActions.value = selectedActions.value.filter(a => a.id !== actionId)
}

// 对话相关状态
const messages = ref<Array<{
  id: string
  role: 'user' | 'ai'
  content: string
  displayContent?: string
  report?: string
  showReport?: boolean
  isTyping?: boolean
}>>([])
const inputMessage = ref('')
const isSending = ref(false)
const chatMessagesRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const hasSentMessage = ref(false)

// AI头像
const aiAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 模拟AI回复数据
const mockResponses: Record<string, string> = {
  'default': `感谢您的提问！我为您提供以下专业建议：

**研究方法**：
 - 系统性文献调研
 - 实验设计与数据分析
 - 结果验证与讨论

**写作技巧**：
 - 结构化论文框架
 - 数据可视化展示
 - 图表制作与优化`
}

// 格式化内容
const formatContent = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isSending.value) return

  if (!authStore.requireAuth()) {
    return
  }

  hasSentMessage.value = true

  const userMessage = inputMessage.value.trim()
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userMessage
  })

  // 添加任务记录
  const newTask = tasksStore.addTask(userMessage)

  inputMessage.value = ''
  isSending.value = true

  try {
    const response = await chatWithAI({ message: userMessage })
    const aiResponse = response.data?.response || mockResponses.default

    // 添加AI消息，初始显示内容为空
    const aiMessageId = (Date.now() + 1).toString()
    messages.value.push({
      id: aiMessageId,
      role: 'ai',
      content: aiResponse,
      displayContent: '',
      isTyping: true
    })

    // 找到刚添加的AI消息
    const aiMessage = messages.value.find(m => m.id === aiMessageId)
    if (aiMessage) {
      // 打字机效果：逐字显示
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex < aiResponse.length) {
          aiMessage.displayContent = aiResponse.substring(0, currentIndex + 1)
          currentIndex++

          // 自动滚动到底部
          if (chatMessagesRef.value) {
            chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
          }
        } else {
          // 打字完成
          clearInterval(typingInterval)
          aiMessage.isTyping = false

          // 更新任务状态为已完成
          tasksStore.updateTaskStatus(newTask.id, 'completed', aiResponse)
        }
      }, 30) // 每30ms显示一个字符
    }
  } catch (error) {
    ElMessage.error('发送失败，请重试')
    // 更新任务状态为等待中
    tasksStore.updateTaskStatus(newTask.id, 'pending')
  } finally {
    isSending.value = false
  }
}

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f7;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
  transition: all 0.3s;
}

.main-content.has-chat {
  padding: 80px 20px 120px;
}

/* 欢迎区域 */
.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.welcome-subtitle {
  font-size: 18px;
  color: #86868b;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.5;
}

/* 搜索区域 */
.search-section {
  width: 100%;
  max-width: 800px;
  margin-bottom: 48px;
  transition: all 0.3s;
}

.search-section.is-bottom {
  position: fixed;
  bottom: 0;
  left: calc(50% + 100px); /* 页面中心 + 侧边栏宽度的一半 */
  transform: translateX(-50%);
  width: calc(100% - 200px); /* 减去侧边栏宽度 */
  max-width: 800px;
  padding: 16px 20px;
  background: transparent;
  box-shadow: none;
  z-index: 100;
}

.search-section.is-bottom .search-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input-wrapper {
  flex: 1;
  width: 100%;
}

.search-icons-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-left-icons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.add-icon,
.document-icon,
.tool-icon,
.chat-icon,
.microphone-icon,
.send-icon {
  font-size: 20px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
}

.add-icon:hover,
.document-icon:hover,
.tool-icon:hover,
.chat-icon:hover,
.microphone-icon:hover {
  color: #666;
}

.send-icon {
  padding: 8px;
  border-radius: 8px;
  background: #e5e5e5;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-icon:hover:not(.is-disabled) {
  color: #666;
  background: #d4d4d4;
}

.send-icon.is-disabled {
  color: #ccc;
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-icon .el-icon {
  transform: rotate(0deg);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1d1d1f;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  width: 100%;
  min-height: 100px;
  resize: none;
  padding: 0;
  margin: 0;
  line-height: 1.5;
}

.search-input::placeholder {
  color: #999;
}

.search-right-icons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 已选择的功能按钮 */
.search-left-icons .selected-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: 12px;
  align-items: center;
}

.selected-action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #1d1d1f;
  position: relative;
  white-space: nowrap;
}

.selected-action-item:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.delete-btn {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 16px;
  height: 16px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 1;
}

.delete-btn:hover {
  background: #ff7875;
  transform: scale(1.1);
}

/* 工具连接提示 */
.tool-connect-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-connect-hint:hover {
  color: #666;
}

/* 快捷功能按钮 */
.quick-actions {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 400;
}

.quick-action-item:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.quick-action-item.more-btn {
  background: #f3f4f6;
  color: #1d1d1f;
  border: 1px solid #e5e7eb;
}

.quick-action-item.more-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

/* 更多按钮包装器 */
.more-btn-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
}

/* 更多功能展开区 */
.more-actions-panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 0;
  background: #ffffff;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  border: 1px solid #e5e7eb;
}

.more-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 400;
}

.more-action-item:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 功能卡片区域 */
.feature-list {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 48px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-right: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #86868b;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.feature-name {
  font-size: 13px;
  font-weight: 500;
  color: #1d1d1f;
  text-align: center;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.unlimited-tag {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fbbf24;
  color: #1d1d1f;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 对话展示区域 */
.chat-messages {
  width: 100%;
  max-width: 800px;
  background: transparent;
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.message-item {
  display: flex;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease-in;
}

.message-item.user {
  justify-content: flex-end;
}

.message-item.ai {
  justify-content: flex-start;
}

.message-avatar {
  flex-shrink: 0;
  margin-right: 12px;
}

.avatar-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message-text.ai-message {
  padding: 0;
}

.user-message {
  background: transparent;
  color: #1d1d1f;
  padding: 0;
}

.ai-message {
  background: transparent;
  border: none;
  color: #1d1d1f;
  padding: 0;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: #8b5cf6;
  margin-left: 2px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.report-section {
  margin-top: 12px;
  padding: 16px;
  background: #f5f5f7;
  border-left: 3px solid #8b5cf6;
  border-radius: 8px;
}

.report-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #8b5cf6;
}

/* 加载动画 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  animation: fadeIn 0.3s ease-in;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #d2d2d7;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: 14px;
  color: #86868b;
}

/* 动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 36px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .main-content {
    padding: 60px 16px 30px;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 28px;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }

  .message-content {
    max-width: 80%;
  }
}
</style>
