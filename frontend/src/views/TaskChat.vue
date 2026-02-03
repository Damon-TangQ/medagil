<template>
  <div class="task-chat-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <!-- 搜索框 -->
      <div class="sidebar-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索历史对话..."
          prefix-icon="Search"
          clearable
          class="search-input"
        />
      </div>

      <!-- 项目库 -->
      <div class="sidebar-section">
        <div class="section-header">
          <el-icon><Folder /></el-icon>
          <span>项目库</span>
        </div>
        <el-tree
          :data="projectTreeData"
          :props="{ children: 'children', label: 'label' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          class="project-tree"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <el-icon v-if="data.type === 'folder'"><Folder /></el-icon>
              <el-icon v-else><Document /></el-icon>
              <span>{{ node.label }}</span>
            </div>
          </template>
        </el-tree>
      </div>

      <!-- 成果库 -->
      <div class="sidebar-section">
        <div class="section-header">
          <el-icon><Star /></el-icon>
          <span>成果库</span>
        </div>
        <div class="achievement-list">
          <div
            v-for="item in achievements"
            :key="item.id"
            class="achievement-item"
            @click="openAchievement(item)"
          >
            <div class="achievement-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="achievement-content">
              <div class="achievement-title">{{ item.title }}</div>
              <div class="achievement-time">{{ formatTime(item.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 所有任务 -->
      <div class="sidebar-section">
        <div class="section-header">
          <el-icon><List /></el-icon>
          <span>所有任务</span>
        </div>
        <div class="task-timeline">
          <el-timeline>
            <el-timeline-item
              v-for="task in taskTimeline"
              :key="task.id"
              :timestamp="formatTime(task.timestamp)"
              placement="top"
              :type="task.type"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ task.title }}</div>
                <div class="timeline-desc">{{ task.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <!-- 设置入口 -->
      <div class="sidebar-section settings-section">
        <el-button text class="settings-button" @click="openSettings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部状态栏 -->
      <div class="chat-header">
        <div class="header-left">
          <el-icon class="back-icon" @click="goBack">
            <DArrowLeft />
          </el-icon>
          <h2 class="task-title">{{ taskTitle }}</h2>
        </div>
        
        <div class="header-center">
          <!-- Medagil Logo -->
          <div class="logo">
            <el-icon :size="32" color="var(--el-color-primary)"><Promotion /></el-icon>
            <span class="logo-text">Medagil</span>
          </div>
          
          <!-- 模型切换 -->
          <el-dropdown trigger="click" class="model-dropdown">
            <span class="model-selector">
              <el-icon><MagicStick /></el-icon>
              <span>{{ currentModel }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="model in models"
                  :key="model.id"
                  :command="model"
                  @click="selectModel(model)"
                >
                  <el-icon><MagicStick /></el-icon>
                  {{ model.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 积分显示 -->
          <div class="points-display">
            <el-icon :size="20" color="#f59e0b"><Coin /></el-icon>
            <span class="points-text">{{ points }} 积分</span>
          </div>
        </div>
        
        <div class="header-right">
          <!-- 通知铃铛 -->
          <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
            <el-button circle class="notification-button" @click="showNotifications">
              <el-icon :size="20"><Bell /></el-icon>
            </el-button>
          </el-badge>
          
          <!-- 用户菜单 -->
          <el-dropdown trigger="click" class="user-dropdown">
            <div class="user-avatar-wrapper">
              <el-avatar :size="36" :src="userAvatar">
                <el-icon><User /></el-icon>
              </el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="goToSettings">
                  <el-icon><Setting /></el-icon>
                  账号设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
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
            <!-- 智能体标识和名称 -->
            <div class="message-info">
              <div class="message-role-info">
                <span class="message-role">{{ message.role === 'user' ? '我' : currentModel }}</span>
                <el-tag v-if="message.role === 'ai'" size="small" type="primary" effect="plain">AI助手</el-tag>
              </div>
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
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="5">⭐⭐⭐⭐⭐⭐ 非常满意</el-dropdown-item>
                    <el-dropdown-item command="4">⭐⭐⭐⭐ 满意</el-dropdown-item>
                    <el-dropdown-item command="3">⭐⭐⭐ 一般</el-dropdown-item>
                    <el-dropdown-item command="2">⭐⭐ 不满意</el-dropdown-item>
                    <el-dropdown-item command="1">⭐ 非常不满意</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- 推荐追问 -->
            <div v-if="message.role === 'ai' && message.suggestions && message.suggestions.length > 0" class="follow-up-suggestions">
              <div class="suggestions-title">推荐追问</div>
              <div class="suggestions-list">
                <el-button
                  v-for="(suggestion, index) in message.suggestions"
                  :key="index"
                  size="small"
                  text
                  class="suggestion-button"
                  @click="useSuggestion(suggestion)"
                >
                  <el-icon><ChatDotRound /></el-icon>
                  {{ suggestion }}
                </el-button>
              </div>
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
                  :status="step.status === 'completed' ? 'success' : 
                          step.status === 'in_progress' ? 'process' : 'wait'"
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
        <!-- 附件上传 -->
        <el-upload
          :show-file-list="false"
          :before-upload="handleFileUpload"
          action="#"
          accept=".pdf,.doc,.docx,.txt"
        >
          <el-button size="small" text class="toolbar-button">
            <el-icon><Paperclip /></el-icon>
            <span>上传附件</span>
          </el-button>
        </el-upload>
        
        <!-- 语音输入 -->
        <el-button size="small" text class="toolbar-button" @click="toggleVoiceInput">
          <el-icon><Microphone /></el-icon>
          <span>{{ isRecording ? '停止录音' : '语音输入' }}</span>
        </el-button>
        
        <!-- 智能体选择 -->
        <el-dropdown trigger="click" class="agent-dropdown">
          <el-button size="small" text class="toolbar-button">
            <el-icon><MagicStick /></el-icon>
            <span>{{ currentModel }}</span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="model in models"
                :key="model.id"
                :command="model"
                @click="selectModel(model)"
              >
                <el-icon><MagicStick /></el-icon>
                {{ model.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="请输入您的消息..."
          @keydown.enter="handleEnterKey"
        />
        <el-button type="primary" :loading="isSending" @click="sendMessage" class="send-button">
          <el-icon v-if="isSending" class="is-loading"><Loading /></el-icon>
          <el-icon v-else><Promotion /></el-icon>
          <span>发送</span>
        </el-button>
      </div>
      
      <div class="input-hint">
        <span>按 Enter 快速发送，Shift+Enter 换行</span>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DArrowLeft,
  Download,
  DocumentCopy,
  Share,
  ArrowDown,
  Paperclip,
  Folder,
  Document,
  Star,
  List,
  Setting,
  MagicStick,
  Coin,
  Bell,
  User,
  SwitchButton,
  Microphone,
  Loading,
  ChatDotRound,
  Promotion
} from '@element-plus/icons-vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 任务信息
const taskId = ref<string>('')
const taskTitle = ref('AI助手对话')

// 顶部状态栏数据
const currentModel = ref('临床论著助手')
const points = ref(1250)
const notificationCount = ref(3)

// 模型列表
const models = ref([
  { id: '1', name: '临床论著助手' },
  { id: '2', name: '文献分析助手' },
  { id: '3', name: '数据可视化助手' },
  { id: '4', name: '统计分析助手' },
  { id: '5', name: '实验设计助手' },
  { id: '6', name: '结果解读助手' },
  { id: '7', name: '论文写作助手' },
  { id: '8', name: '图表生成助手' },
  { id: '9', name: '综合咨询助手' }
])

// 消息列表
const messages = ref<Array<{
  role: 'user' | 'ai'
  content: string
  timestamp: number
  steps?: Array<{
    step: number
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
    progress: number
  }>
  thoughts?: Array<{
    id: string
    content: string
    timestamp: number
  }>
  suggestions?: string[]
  attachments?: Array<{
    name: string
    type: string
    size: string
    url: string
  }>
  rating?: number
}>>([])

// 输入消息
const inputMessage = ref('')

// 发送状态
const isSending = ref(false)
const isTyping = ref(false)
const isRecording = ref(false)

// 消息列表引用
const messageListRef = ref<HTMLElement>()

// 头像
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
const aiAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 左侧导航栏数据
const searchQuery = ref('')

// 项目库树形数据
const projectTreeData = ref([
  {
    id: '1',
    label: '医学文献研究',
    type: 'folder',
    children: [
      {
        id: '1-1',
        label: '心血管疾病',
        type: 'folder',
        children: [
          { id: '1-1-1', label: '高血压研究', type: 'file' },
          { id: '1-1-2', label: '冠心病分析', type: 'file' }
        ]
      },
      {
        id: '1-2',
        label: '神经科学',
        type: 'folder',
        children: [
          { id: '1-2-1', label: '阿尔茨海默病', type: 'file' },
          { id: '1-2-2', label: '帕金森病', type: 'file' }
        ]
      }
    ]
  },
  {
    id: '2',
    label: '临床试验',
    type: 'folder',
    children: [
      { id: '2-1', label: '一期试验', type: 'file' },
      { id: '2-2', label: '二期试验', type: 'file' },
      { id: '2-3', label: '三期试验', type: 'file' }
    ]
  },
  {
    id: '3',
    label: '药物研发',
    type: 'folder',
    children: [
      { id: '3-1', label: '靶点发现', type: 'file' },
      { id: '3-2', label: '化合物筛选', type: 'file' }
    ]
  }
])

// 成果库数据
const achievements = ref([
  {
    id: '1',
    title: '心血管疾病风险预测模型',
    timestamp: Date.now() - 86400000
  },
  {
    id: '2',
    title: '药物相互作用分析报告',
    timestamp: Date.now() - 172800000
  },
  {
    id: '3',
    title: '临床试验数据可视化',
    timestamp: Date.now() - 259200000
  }
])

// 任务时间线数据
const taskTimeline = ref([
  {
    id: '1',
    title: '文献检索任务',
    description: '检索心血管疾病相关文献',
    timestamp: Date.now() - 3600000,
    type: 'primary'
  },
  {
    id: '2',
    title: '数据分析任务',
    description: '分析临床试验数据',
    timestamp: Date.now() - 7200000,
    type: 'success'
  },
  {
    id: '3',
    title: '报告生成任务',
    description: '生成研究总结报告',
    timestamp: Date.now() - 10800000,
    type: 'warning'
  }
])

// 打开成果
const openAchievement = (item: any) => {
  ElMessage.info(`打开成果: ${item.title}`)
}

// 打开设置
const openSettings = () => {
  router.push('/settings')
}

// 顶部状态栏方法
const selectModel = (model: { name: string }) => {
  currentModel.value = model.name
  ElMessage.success(`已切换到 ${model.name}`)
}

const showNotifications = () => {
  ElMessage.info(`您有 ${notificationCount.value} 条未读通知`)
  notificationCount.value = 0
}

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}

// 获取当前激活的步骤
const getActiveStep = (steps: any[]) => {
  const inProgressIndex = steps.findIndex(step => step.status === 'in_progress')
  if (inProgressIndex !== -1) return inProgressIndex

  const completedCount = steps.filter(step => step.status === 'completed').length
  return completedCount
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 处理回车键
const handleEnterKey = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

// 切换语音输入
const toggleVoiceInput = () => {
  isRecording.value = !isRecording.value
  if (isRecording.value) {
    ElMessage.info('开始录音...')
    // 实际项目中这里应该调用语音识别API
  } else {
    ElMessage.success('录音已停止')
    // 实际项目中这里应该处理识别结果
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }

  // 添加用户消息
  messages.value.push({
    role: 'user' as const,
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
      { step: 1, title: '分析文档结构', description: '分析文档类型和结构', status: 'completed' as const, progress: 100 },
      { step: 2, title: '生成IMRAD框架', description: '生成引言、方法、结果、讨论框架', status: 'completed' as const, progress: 100 },
      { step: 3, title: '撰写引言部分', description: '撰写研究背景和目的', status: 'completed' as const, progress: 100 },
      { step: 4, title: '质量检查', description: '检查回复质量和准确性', status: 'completed' as const, progress: 100 }
    ],
    thoughts: [
      { id: '1', content: '正在分析文档结构...', timestamp: Date.now() },
      { id: '2', content: '识别出关键信息点，准备生成IMRAD框架...', timestamp: Date.now() + 500 },
      { id: '3', content: '开始撰写引言部分...', timestamp: Date.now() + 1000 }
    ],
    suggestions: [
      '能否提供更多研究背景信息？',
      '需要我详细解释某个部分吗？',
      '是否需要添加参考文献？'
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
      aiMessage.steps[1].status = 'completed'
      aiMessage.steps[1].progress = 100
      aiMessage.steps[2].status = 'completed'
      aiMessage.steps[2].progress = 100
      aiMessage.steps[3].status = 'completed'
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

// 使用推荐追问
const useSuggestion = (suggestion: string) => {
  inputMessage.value = suggestion
  sendMessage()
}

// 上传附件
const handleFileUpload = (file: File) => {
  ElMessage.success(`已上传附件：${file.name}`)
  return false // 阻止自动上传
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
  // 检查是否有从首页传递过来的搜索查询
  const searchQuery = route.query.q as string
  if (searchQuery) {
    // 如果有搜索查询，不显示欢迎消息，直接发送搜索查询
    inputMessage.value = searchQuery
    // 延迟一下再发送，确保组件已经完全加载
    setTimeout(() => {
      sendMessage()
    }, 500)
  } else {
    // 添加欢迎消息
    messages.value.push({
      role: 'ai' as const,
      content: '您好！我是您的AI助手，可以帮您完成各种任务。请问有什么可以帮您的吗？',
      timestamp: Date.now()
    })
  }

  // 模拟加载任务信息
  if (taskId.value) {
    taskTitle.value = `任务 #${taskId.value}`
  }
})
</script>

<style scoped lang="scss">
.task-chat-container {
  display: flex;
  height: 100%;
  background-color: #f5f7fa;
}

// 左侧导航栏
.sidebar {
  width: 300px;
  min-width: 300px;
  max-width: 300px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    width: 260px;
    min-width: 260px;
    max-width: 260px;
  }

  .sidebar-section {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  // 搜索框
  .search-input {
    width: 100%;
  }

  // 区块标题
  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;

    .el-icon {
      color: var(--el-color-primary);
    }
  }

  // 项目树
  .project-tree {
    .tree-node {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;

      .el-icon {
        font-size: 16px;
      }
    }
  }

  // 成果列表
  .achievement-list {
    .achievement-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }

      .achievement-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgba(var(--el-color-primary-rgb), 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--el-color-primary);
      }

      .achievement-content {
        flex: 1;
        min-width: 0;

        .achievement-title {
          font-size: 14px;
          color: #303133;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .achievement-time {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  // 任务时间线
  .task-timeline {
    .timeline-content {
      .timeline-title {
        font-size: 14px;
        color: #303133;
        margin-bottom: 4px;
      }

      .timeline-desc {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  // 设置按钮
  .settings-section {
    margin-top: auto;

    .settings-button {
      width: 100%;
      justify-content: flex-start;
      gap: 8px;
      color: #606266;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

// 主内容区
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    min-width: 200px;

    .back-icon {
      font-size: 24px;
      cursor: pointer;
      color: #606266;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .task-title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;
    justify-content: center;

    // Logo
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 700;
      color: var(--el-color-primary);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }

      .logo-text {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
    }

    // 模型选择器
    .model-dropdown {
      .model-selector {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background-color: var(--el-bg-color-page);
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);

        &:hover {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
      }
    }

    // 积分显示
    .points-display {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background-color: #fffbeb0;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #f59e0b;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
      }

      .points-text {
        color: #f59e0b;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 200px;
    justify-content: flex-end;

    // 通知铃铛
    .notification-badge {
      .notification-button {
        width: 40px;
        height: 40px;
        border: none;
        background-color: var(--el-bg-color-page);
        color: var(--el-text-color-regular);
        transition: all 0.3s;

        &:hover {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
          transform: scale(1.1);
        }
      }
    }

    // 用户菜单
    .user-dropdown {
      .user-avatar-wrapper {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: scale(1.05);
        }
      }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .message-item {
    width: 100%;
    max-width: 900px;
  }
}

.message-item {
  display: flex;
  margin-bottom: 24px;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
      background-color: var(--el-color-primary-light-9);
      border: 1px solid var(--el-color-primary-light-5);
    }

    .message-info {
      flex-direction: row-reverse;
    }
  }

  &.ai {
    .message-content {
      background-color: #fff;
      border: 1px solid var(--el-border-color-light);
    }
  }

  .message-avatar {
    flex-shrink: 0;
    margin: 0 12px;
  }

  .message-content {
    max-width: 80%;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .message-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 12px;
      color: var(--el-text-color-secondary);

      .message-role-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .message-role {
          font-weight: 600;
          font-size: 14px;
          color: var(--el-text-color-primary);
        }
      }

      .message-time {
        margin-left: 8px;
      }
    }

    .message-text {
      font-size: 14px;
      line-height: 1.8;
      color: var(--el-text-color-primary);
      white-space: pre-wrap;
      word-break: break-word;

      // Markdown样式
      :deep(h1), :deep(h2), :deep(h3) {
        margin-top: 16px;
        margin-bottom: 8px;
        font-weight: 600;
      }

      :deep(p) {
        margin-bottom: 12px;
      }

      :deep(code) {
        background-color: var(--el-fill-color-light);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
      }

      :deep(pre) {
        background-color: var(--el-fill-color-light);
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 12px 0;
      }

      :deep(ul), :deep(ol) {
        margin: 12px 0;
        padding-left: 24px;
      }

      :deep(li) {
        margin-bottom: 4px;
      }

      :deep(blockquote) {
        border-left: 4px solid var(--el-color-primary);
        padding-left: 12px;
        margin: 12px 0;
        color: var(--el-text-color-secondary);
      }
    }

    .message-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--el-border-color-light);
    }

    // 推荐追问
    .follow-up-suggestions {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-light);

      .suggestions-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--el-text-color-secondary);
        margin-bottom: 12px;
      }

      .suggestions-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .suggestion-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 16px;
          background-color: var(--el-fill-color-light);
          border: 1px solid var(--el-border-color-lighter);
          transition: all 0.3s;
          font-size: 13px;
          color: var(--el-text-color-regular);

          &:hover {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary-light-5);
            color: var(--el-color-primary);
            transform: translateY(-2px);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
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
  border-top: 1px solid var(--el-border-color-light);
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  .input-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    align-items: center;

    .toolbar-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 8px;
      transition: all 0.3s;
      font-size: 14px;
      color: var(--el-text-color-regular);

      &:hover {
        background-color: var(--el-fill-color-light);
        color: var(--el-color-primary);
      }

      &.is-recording {
        color: var(--el-color-danger);
        background-color: rgba(var(--el-color-danger-rgb), 0.1);
        animation: pulse 1.5s infinite;
      }
    }

    .agent-dropdown {
      .toolbar-button {
        background-color: var(--el-fill-color-light);
        color: var(--el-text-color-primary);
        font-weight: 500;

        &:hover {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
      }
    }
  }

  .input-area {
    display: flex;
    gap: 12px;
    align-items: flex-end;

    .el-textarea {
      flex: 1;
      
      :deep(textarea) {
        border-radius: 8px;
        resize: none;
        font-size: 14px;
        line-height: 1.6;
      }
    }

    .send-button {
      height: auto;
      align-self: flex-end;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .input-hint {
    margin-top: 8px;
    text-align: right;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
