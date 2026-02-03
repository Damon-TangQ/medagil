<template>
  <div class="home-page">
    <!-- 顶部促销提示框 -->
    <div class="promo-banner">
      <div class="promo-content">
        <el-icon class="promo-icon"><Trophy /></el-icon>
        <span class="promo-text">立即升级 节省 30%</span>
        <el-button type="primary" size="small" class="promo-button">立即升级</el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 标题区域 -->
      <div class="title-section">
        <h1 class="main-title">Medagil AI 工作空间 2.0</h1>
        <p class="subtitle">智能科研助手，让研究更高效</p>
      </div>

      <!-- 对话展示区域 -->
      <div v-if="messages.length > 0" class="chat-messages" ref="chatMessagesRef">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-item', message.role]"
        >
          <!-- AI消息 -->
          <div v-if="message.role === 'ai'" class="message-avatar">
            <img :src="aiAvatar" alt="AI" class="avatar-image">
          </div>

          <!-- 消息内容 -->
          <div class="message-content">
            <div v-if="message.role === 'user'" class="message-text user-message">
              {{ message.content }}
            </div>
            <div v-else class="message-text ai-message">
              {{ message.content }}
            </div>

            <!-- 报告区域 -->
            <div v-if="message.report && message.showReport" class="report-section">
              <div class="report-header">
                <el-icon><Document /></el-icon>
                <span class="report-title">生成报告</span>
              </div>
              <div class="report-content" v-html="message.report"></div>
            </div>
          </div>
        </div>

        <!-- 加载动画 -->
        <div v-if="isSending" class="loading-indicator">
          <div class="loading-spinner"></div>
          <span class="loading-text">思考中...</span>
        </div>
      </div>

      <!-- 搜索输入框区域 -->
      <div class="search-section">
        <div class="search-container">
          <textarea
            v-model="inputMessage"
            class="search-input"
            placeholder="询问任何问题，创造任何事物"
            @keydown="handleKeyDown"
            :rows="1"
            ref="searchInputRef"
          ></textarea>
          <div class="input-actions">
            <el-button
              v-if="inputMessage"
              class="action-button clear-button"
              @click="clearInput"
              circle
            >
              <el-icon><Close /></el-icon>
            </el-button>
            <el-button
              class="action-button voice-button"
              @click="toggleVoice"
              circle
            >
              <el-icon><Microphone /></el-icon>
            </el-button>
            <el-button
              type="primary"
              class="action-button send-button"
              @click="sendMessage"
              :disabled="!inputMessage.trim() || isSending"
              circle
            >
              <el-icon v-if="!isSending"><Promotion /></el-icon>
              <el-icon v-else class="is-loading"><Loading /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 功能卡片区域 -->
      <div class="feature-cards">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="feature-card"
          @click="handleFeatureClick(feature)"
        >
          <div class="card-icon" :style="{ backgroundColor: feature.color }">
            <el-icon :size="24"><component :is="feature.icon" /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-title">{{ feature.name }}</div>
            <div class="card-desc">{{ feature.desc }}</div>
          </div>
          <el-tag v-if="feature.unlimited" size="small" type="success" effect="dark" class="unlimited-tag">
            无限制
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 底部工具推广栏 -->
    <div class="promo-footer">
      <div class="footer-content">
        <div class="footer-text">
          <h3>别打字了，就用 Speakly</h3>
          <p>语音输入，让沟通更自然</p>
        </div>
        <el-button type="primary" size="large" class="download-button">
          <el-icon><Download /></el-icon>
          立即下载
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Promotion,
  Loading,
  Trophy,
  Close,
  Microphone,
  Download
} from '@element-plus/icons-vue'
import { useAuthRequired } from '@/composables/useAuthRequired'

// 登录拦截
const { requireAuth } = useAuthRequired()

// 功能列表数据
const features = ref([
  { id: 1, name: 'AI 聊天', icon: 'ChatLineSquare', desc: '智能对话助手', color: '#667eea', unlimited: true },
  { id: 2, name: 'AI 图片', icon: 'Picture', desc: '图像生成与编辑', color: '#f093fb', unlimited: true },
  { id: 3, name: '文献分析', icon: 'Document', desc: '智能文献分析', color: '#4facfe', unlimited: false },
  { id: 4, name: '论文写作', icon: 'EditPen', desc: '论文辅助写作', color: '#43e97b', unlimited: false },
  { id: 5, name: '数据分析', icon: 'DataAnalysis', desc: '科研数据分析', color: '#fa709a', unlimited: false }
])

// 对话相关状态
const messages = ref<Array<{
  id: string
  role: 'user' | 'ai'
  content: string
  report?: string
  showReport?: boolean
}>>([])
const inputMessage = ref('')
const isSending = ref(false)
const chatMessagesRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLTextAreaElement>()

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
   - 图表制作与优化

**投稿建议**：
   - 选择合适的期刊
   - 遵循期刊格式要求
   - 准备高质量的图表

如需进一步讨论，请随时告诉我！`
}

// 模拟报告数据
const mockReports: Record<string, string> = {
  'default': `感谢您的提问！我为您提供以下专业建议：

**研究方法**：
   - 系统性文献调研
   - 实验设计与数据分析
   - 结果验证与讨论

**写作技巧**：
   - 结构化论文框架
   - 数据可视化展示
   - 图表制作与优化

**投稿建议**：
   - 选择合适的期刊
   - 遵循期刊格式要求
   - 准备高质量的图表

如需进一步讨论，请随时告诉我！`
}

// 处理功能卡片点击，添加登录拦截
const handleFeatureClick = (feature: any) => {
  // 检查用户是否已登录
  if (!requireAuth()) {
    return
  }
  // 已登录，执行原有逻辑
  ElMessage.info(`您选择了：${feature.name}`)
  // 可以根据选择的功能添加特定提示或切换对话模式
}

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 回车发送，Shift+回车换行
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

// 清空输入框
const clearInput = () => {
  inputMessage.value = ''
}

// 切换语音输入
const toggleVoice = () => {
  ElMessage.info('语音输入功能开发中...')
}

// 发送消息
const sendMessage = async () => {
  // 检查用户是否已登录
  if (!requireAuth()) {
    return
  }

  // 空内容检查
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }

  // 添加用户消息
  const userMessage = {
    id: Date.now().toString(),
    role: 'user' as const,
    content: inputMessage.value
  }
  messages.value.push(userMessage)

  // 清空输入框并禁用按钮
  const query = inputMessage.value
  inputMessage.value = ''
  isSending.value = true

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 创建AI消息
  const aiMessage = {
    id: Date.now().toString(),
    role: 'ai' as const,
    content: '',
    report: mockReports[query] || mockReports['default'],
    showReport: false
  }
  messages.value.push(aiMessage)

  // 获取响应文本
  const responseText = mockResponses[query] || mockResponses['default']

  // 流式输出实现
  let index = 0
  const interval = setInterval(() => {
    if (index < responseText.length) {
      // 逐字符添加内容
      aiMessage.content += responseText[index]
      index++
      // 自动滚动
      scrollToBottom()
    } else {
      // 输出完成
      clearInterval(interval)
      isSending.value = false
      // 显示报告
      aiMessage.showReport = true
    }
  }, 30) // 每30ms输出一个字符
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部促销提示框 */
.promo-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.promo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.promo-icon {
  font-size: 20px;
  color: #ffffff;
}

.promo-text {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.promo-button {
  background: #ffffff;
  color: #667eea;
  border: none;
  font-weight: 600;
}

.promo-button:hover {
  background: #f0f0f0;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  .main-content {
    padding: 60px 16px 30px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 40px 12px 20px;
  }
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .title-section {
    margin-bottom: 40px;
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .title-section {
    margin-bottom: 30px;
    padding: 0 5px;
  }
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 28px;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }
}

.subtitle {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .subtitle {
    font-size: 14px;
  }
}

/* 功能卡片区域 */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .feature-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

@media (max-width: 768px) {
  .feature-card {
    padding: 16px 12px;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: 14px 10px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .card-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
  }
}

.card-content {
  text-align: center;
  flex: 1;
}

@media (max-width: 480px) {
  .card-content {
    text-align: left;
  }
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .card-title {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 13px;
    margin-bottom: 2px;
  }
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .card-desc {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .card-desc {
    font-size: 11px;
    display: none;
  }
}

.unlimited-tag {
  position: absolute;
  top: 12px;
  right: 12px;
}

/* 搜索输入框区域 */
.search-section {
  width: 100%;
  max-width: 800px;
  flex-shrink: 0;
  margin-bottom: 20px;
  padding: 0 10px;
}

@media (max-width: 768px) {
  .search-section {
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 0 5px;
  }
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .search-container {
    padding: 14px 16px;
    border-radius: 14px;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 12px 14px;
    border-radius: 12px;
  }
}

.search-container:focus-within {
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1f2937;
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .search-input {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: 14px;
  }
}

.search-input::placeholder {
  color: #9ca3af;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .action-button {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .action-button {
    width: 32px;
    height: 32px;
  }
}

.clear-button {
  background: #f3f4f6;
  color: #6b7280;
}

.clear-button:hover {
  background: #e5e7eb;
}

.voice-button {
  background: #f3f4f6;
  color: #667eea;
}

.voice-button:hover {
  background: #e5e7eb;
}

.send-button {
  background: #667eea;
  color: #ffffff;
}

.send-button:hover:not(:disabled) {
  background: #5568d3;
  transform: scale(1.05);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button .is-loading {
  animation: spin 0.8s linear infinite;
}

/* 对话展示区域 */
.chat-messages {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .chat-messages {
    padding: 16px;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .chat-messages {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
}

/* 消息项 */
.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in;
}

@media (max-width: 768px) {
  .message-item {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .message-item {
    margin-bottom: 12px;
  }
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

@media (max-width: 768px) {
  .message-avatar {
    margin-right: 10px;
  }
}

@media (max-width: 480px) {
  .message-avatar {
    margin-right: 8px;
  }
}

.avatar-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .avatar-image {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .avatar-image {
    width: 28px;
    height: 28px;
  }
}

.message-content {
  max-width: 70%;
}

@media (max-width: 768px) {
  .message-content {
    max-width: 75%;
  }
}

@media (max-width: 480px) {
  .message-content {
    max-width: 80%;
  }
}

/* 用户消息样式 */
.message-text {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .message-text {
    padding: 10px 14px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .message-text {
    padding: 8px 12px;
    font-size: 12px;
  }
}

.user-message {
  background: #667eea;
  color: #ffffff;
  border-radius: 18px 18px 0 18px;
}

/* AI消息样式 */
.ai-message {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  border-radius: 18px 18px 18px 0;
}

/* 报告区域 */
.report-section {
  margin-top: 12px;
  background: #f0f7ff;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  padding: 12px 16px;
  animation: slideIn 0.3s ease-in;
}

.report-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.report-title {
  margin-left: 4px;
}

.report-content {
  font-size: 13px;
  line-height: 1.6;
  color: #1f2937;
}

.report-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.report-content ul,
.report-content ol {
  margin: 8px 0;
  padding-left: 20px;
}

.report-content li {
  margin-bottom: 6px;
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
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
}

/* 底部工具推广栏 */
.promo-footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-text {
  color: #ffffff;
}

.footer-text h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.footer-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.download-button {
  background: #ffffff;
  color: #667eea;
  border: none;
  font-weight: 600;
  padding: 12px 24px;
}

.download-button:hover {
  background: #f0f0f0;
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 16px;
  }

  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .feature-card {
    padding: 16px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
  }

  .promo-banner {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .promo-content {
    padding: 10px 16px;
    flex-wrap: wrap;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>