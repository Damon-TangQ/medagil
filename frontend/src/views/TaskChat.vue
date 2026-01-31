<template>
  <div class="task-chat-container">
    <div class="chat-header">
      <div class="header-left">
        <el-icon class="back-icon" @click="goBack">
          <DArrowLeft />
        </el-icon>
        <h2 class="task-title">{{ taskTitle }}</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" size="small" @click="exportConversation">
          <el-icon><Download /></el-icon>
          导出对话
        </el-button>
      </div>
    </div>

    <div class="chat-content">
      <!-- 消息列表 -->
      <div class="message-list" ref="messageListRef">
        <div
          v-for="message in messages"
          :key="message.timestamp"
          :class="['message-item', message.role]"
        >
          <div class="message-avatar">
            <el-avatar :size="40" :src="message.role === 'user' ? userAvatar : aiAvatar" />
          </div>
          <div class="message-content">
            <div class="message-info">
              <span class="message-role">{{ message.role === 'user' ? '我' : 'AI助手' }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text" v-html="message.content"></div>

            <!-- AI消息的操作按钮 -->
            <div v-if="message.role === 'ai'" class="message-actions">
              <el-button size="small" text @click="copyMessage(message.content)">
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
              <el-button size="small" text @click="shareMessage(message)">
                <el-icon><Share /></el-icon>
                分享
              </el-button>
              <el-dropdown @command="(cmd: string) => rateMessage(message, cmd)">
                <el-button size="small" text>
                  <el-icon><Star /></el-icon>
                  评分
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="5">⭐⭐⭐⭐⭐ 非常满意</el-dropdown-item>
                    <el-dropdown-item command="4">⭐⭐⭐⭐ 满意</el-dropdown-item>
                    <el-dropdown-item command="3">⭐⭐⭐ 一般</el-dropdown-item>
                    <el-dropdown-item command="2">⭐⭐ 不满意</el-dropdown-item>
                    <el-dropdown-item command="1">⭐ 非常不满意</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- 实时步骤展示组件 -->
            <div v-if="message.steps && message.steps.length > 0" class="task-steps">
              <h4 class="steps-title">任务执行步骤</h4>
              <el-steps :active="getActiveStep(message.steps)" finish-status="success" align-center>
                <el-step
                  v-for="(step, stepIndex) in message.steps"
                  :key="stepIndex"
                  :title="step.title"
                  :description="step.description"
                  :status="step.status === TASK_STATUS.COMPLETED ? 'success' : 
                          step.status === TASK_STATUS.IN_PROGRESS ? 'process' : 'wait'"
                />
              </el-steps>
            </div>

            <!-- 思考过程显示 -->
            <div v-if="message.thoughts && message.thoughts.length > 0" class="thought-process">
              <el-collapse>
                <el-collapse-item title="思考过程" name="thoughts">
                  <div class="thought-list">
                    <div v-for="(thought, thoughtIndex) in message.thoughts" :key="thoughtIndex" class="thought-item">
                      <div class="thought-time">{{ formatTime(thought.timestamp) }}</div>
                      <div class="thought-content">{{ thought.content }}</div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>

        <!-- 正在输入提示 -->
        <div v-if="isTyping" class="message-item ai">
          <div class="message-avatar">
            <el-avatar :size="40" :src="aiAvatar" />
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息输入框 -->
    <div class="chat-input">
      <div class="input-toolbar">
        <el-upload
          :show-file-list="false"
          :before-upload="handleFileUpload"
          action="#"
          accept="image/*,.pdf,.doc,.docx"
        >
          <el-button size="small" text>
            <el-icon><Paperclip /></el-icon>
            上传附件
          </el-button>
        </el-upload>
        <el-button size="small" text @click="insertTemplate">
          <el-icon><Document /></el-icon>
          插入模板
        </el-button>
      </div>
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="4"
          placeholder="请输入您的消息..."
          @keydown.enter.ctrl="sendMessage"
        />
        <el-button type="primary" :loading="isSending" @click="sendMessage" class="send-button">
          <el-icon><Promotion /></el-icon>
          发送
        </el-button>
      </div>
      <div class="input-hint">
        <span>按 Ctrl+Enter 快速发送</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  DArrowLeft,
  Download,
  DocumentCopy,
  Share,
  Star,
  ArrowDown,
  Paperclip,
  Document,
  Promotion
} from '@element-plus/icons-vue'
import { TASK_STATUS } from '@/shared/constants'

// 路由相关
const route = useRoute()
const router = useRouter()

// 任务信息
const taskId = computed(() => route.params.id as string)
const taskTitle = ref('AI助手对话')

// 消息列表
const messages = ref<Array<{
  role: 'user' | 'ai'
  content: string
  timestamp: number
  steps?: Array<{
    step: number
    title: string
    description: string
    status: number
    progress: number
  }>
  thoughts?: Array<{
    id: string
    content: string
    timestamp: number
  }>
  rating?: number
}>>([])

// 输入消息
const inputMessage = ref('')

// 发送状态
const isSending = ref(false)
const isTyping = ref(false)

// 消息列表引用
const messageListRef = ref<HTMLElement>()

// 头像
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
const aiAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 获取当前激活的步骤
const getActiveStep = (steps: any[]) => {
  const inProgressIndex = steps.findIndex(step => step.status === TASK_STATUS.IN_PROGRESS)
  if (inProgressIndex !== -1) return inProgressIndex

  const completedCount = steps.filter(step => step.status === TASK_STATUS.COMPLETED).length
  return completedCount
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    timestamp: Date.now()
  })

  // 清空输入框
  const userMessage = inputMessage.value
  inputMessage.value = ''

  // 滚动到底部
  scrollToBottom()

  // 模拟AI响应
  isSending.value = true
  isTyping.value = true

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 创建AI消息
  const aiMessage = {
    role: 'ai' as const,
    content: '',
    timestamp: Date.now(),
    steps: [
      { step: 1, title: '分析需求', description: '分析用户需求和上下文', status: TASK_STATUS.COMPLETED, progress: 100 },
      { step: 2, title: '信息检索', description: '检索相关信息和数据', status: TASK_STATUS.IN_PROGRESS, progress: 50 },
      { step: 3, title: '生成回复', description: '生成智能回复内容', status: TASK_STATUS.IN_PROGRESS, progress: 0 },
      { step: 4, title: '质量检查', description: '检查回复质量和准确性', status: TASK_STATUS.IN_PROGRESS, progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析用户需求...', timestamp: Date.now() },
      { id: '2', content: '识别出关键信息点，准备检索相关数据...', timestamp: Date.now() + 500 }
    ]
  }

  messages.value.push(aiMessage)
  scrollToBottom()

  // 模拟流式输出
  const responseText = `感谢您的提问！关于"${userMessage}"，我为您分析如下：

1. **需求分析**：您关注的是如何提高工作效率和团队协作能力，这是一个非常实际的问题。

2. **解决方案**：建议从以下几个方面入手：
   - 建立清晰的沟通渠道
   - 使用协作工具提高效率
   - 定期进行团队培训和交流

3. **实施建议**：
   - 选择适合团队的协作平台
   - 制定明确的工作流程
   - 设定可衡量的目标和指标

4. **预期效果**：通过以上措施，预计可以提高团队工作效率20%-30%。

如果您需要更详细的建议或有其他问题，请随时告诉我！`

  let index = 0
  const interval = setInterval(() => {
    if (index < responseText.length) {
      aiMessage.content += responseText[index]
      index++
      scrollToBottom()
    } else {
      clearInterval(interval)
      isSending.value = false
      isTyping.value = false

      // 更新步骤状态
      aiMessage.steps[1].status = TASK_STATUS.COMPLETED
      aiMessage.steps[1].progress = 100
      aiMessage.steps[2].status = TASK_STATUS.COMPLETED
      aiMessage.steps[2].progress = 100
      aiMessage.steps[3].status = TASK_STATUS.COMPLETED
      aiMessage.steps[3].progress = 100
      aiMessage.thoughts.push({
        id: '3',
        content: '回复生成完成，已进行质量检查',
        timestamp: Date.now()
      })
    }
  }, 30)

  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 复制消息
const copyMessage = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

// 分享消息
const shareMessage = (_message: any) => {
  ElMessage.success('分享链接已复制到剪贴板')
  // 实际应用中这里应该生成分享链接
}

// 评分消息
const rateMessage = (message: any, rating: string) => {
  message.rating = parseInt(rating)
  ElMessage.success(`已评分：${rating}星`)
  // 实际应用中这里应该发送评分到服务器
}

// 上传附件
const handleFileUpload = (file: File) => {
  ElMessage.success(`已上传附件：${file.name}`)
  return false // 阻止自动上传
}

// 插入模板
const insertTemplate = () => {
  const templates = [
    '请帮我分析当前的市场趋势',
    '请为我的产品制定营销方案',
    '请帮我优化项目流程'
  ]
  const template = templates[Math.floor(Math.random() * templates.length)]
  inputMessage.value = template
}

// 导出对话
const exportConversation = () => {
  ElMessage.success('对话已导出')
  // 实际应用中这里应该生成文件并下载
}

// 返回
const goBack = () => {
  router.back()
}

// 组件挂载
onMounted(() => {
  // 添加欢迎消息
  messages.value.push({
    role: 'ai',
    content: '您好！我是您的AI助手，可以帮您完成各种任务。请问有什么可以帮您的吗？',
    timestamp: Date.now()
  })

  // 模拟加载任务信息
  if (taskId.value) {
    taskTitle.value = `任务 #${taskId.value}`
  }
})
</script>

<style scoped lang="scss">
.task-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .back-icon {
      font-size: 24px;
      cursor: pointer;
      color: #606266;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }
    }

    .task-title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }
}

.chat-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 24px;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
      background-color: #ecf5ff;
    }

    .message-info {
      flex-direction: row-reverse;
    }
  }

  .message-avatar {
    flex-shrink: 0;
    margin: 0 12px;
  }

  .message-content {
    max-width: 70%;
    background-color: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .message-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: #909399;

      .message-role {
        font-weight: 500;
      }

      .message-time {
        margin-left: 8px;
      }
    }

    .message-text {
      font-size: 14px;
      line-height: 1.6;
      color: #303133;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .message-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e4e7ed;
    }

    .task-steps {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e4e7ed;

      .steps-title {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }

    .thought-process {
      margin-top: 12px;

      .thought-list {
        .thought-item {
          margin-bottom: 8px;
          padding: 8px;
          background-color: #f5f7fa;
          border-radius: 4px;

          .thought-time {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }

          .thought-content {
            font-size: 13px;
            color: #606266;
          }
        }
      }
    }
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 8px;
    height: 8px;
    background-color: #909399;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.chat-input {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 16px 24px;

  .input-toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .input-area {
    display: flex;
    gap: 12px;

    .el-textarea {
      flex: 1;
    }

    .send-button {
      height: auto;
      align-self: flex-end;
    }
  }

  .input-hint {
    margin-top: 8px;
    text-align: right;
    font-size: 12px;
    color: #909399;
  }
}
</style>
