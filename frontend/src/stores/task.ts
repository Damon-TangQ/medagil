/**
 * 任务对话状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 消息接口
export interface Message {
  id: string
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
  rating?: number
}

// 任务类型接口
export interface TaskType {
  id: string
  name: string
  description: string
}

export const useTaskStore = defineStore('task', () => {
  // 状态
  const messages = ref<Message[]>([])
  const isTyping = ref(false)
  const currentTaskType = ref<string | null>(null)
  const taskTypes = ref<TaskType[]>([
    { id: 'market_analysis', name: '市场分析', description: '分析市场趋势和机会' },
    { id: 'competitor_research', name: '竞品研究', description: '研究竞争对手' },
    { id: 'user_research', name: '用户研究', description: '研究用户需求和行为' }
  ])

  // 计算属性
  const lastMessage = computed(() => messages.value[messages.value.length - 1])

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim()) {
      return { success: false, message: '消息内容不能为空' }
    }

    // 添加用户消息
    messages.value.push({
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    })

    // 设置正在输入状态
    isTyping.value = true

    try {
      // 模拟API调用
      // const response = await axios.post(`${API_BASE_URL}/tasks/message`, { content })

      // 模拟AI响应
      await new Promise(resolve => setTimeout(resolve, 1000))

      return { success: true }
    } catch (error: any) {
      console.error('发送消息错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '发送消息失败，请稍后重试'
      }
    }
  }

  // 接收AI响应
  const receiveAIResponse = async (content: string) => {
    messages.value.push({
      id: Date.now().toString(),
      role: 'ai',
      content,
      timestamp: Date.now()
    })

    isTyping.value = false
    return { success: true }
  }

  // 开始流式响应
  const startStreamingResponse = async (text: string, callback?: (text: string) => void) => {
    const messageId = Date.now().toString()
    messages.value.push({
      id: messageId,
      role: 'ai',
      content: '',
      timestamp: Date.now()
    })

    let currentText = ''
    const interval = setInterval(() => {
      if (currentText.length < text.length) {
        currentText += text[currentText.length]
        const message = messages.value.find(m => m.id === messageId)
        if (message) {
          message.content = currentText
        }
        if (callback) {
          callback(currentText)
        }
      } else {
        clearInterval(interval)
        isTyping.value = false
      }
    }, 30)

    return { success: true }
  }

  // 更新步骤状态
  const updateStepStatus = async (step: number, status: 'pending' | 'in_progress' | 'completed', progress: number) => {
    const lastAiMessage = [...messages.value].reverse().find(m => m.role === 'ai')
    if (lastAiMessage && lastAiMessage.steps) {
      const stepObj = lastAiMessage.steps.find(s => s.step === step)
      if (stepObj) {
        stepObj.status = status
        stepObj.progress = progress
      }
    }
    return { success: true }
  }

  // 添加思考内容
  const addThought = async (content: string) => {
    const lastAiMessage = [...messages.value].reverse().find(m => m.role === 'ai')
    if (lastAiMessage) {
      if (!lastAiMessage.thoughts) {
        lastAiMessage.thoughts = []
      }
      lastAiMessage.thoughts.push({
        id: Date.now().toString(),
        content,
        timestamp: Date.now()
      })
    }
    return { success: true }
  }

  // 复制消息
  const copyMessage = async (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      try {
        await navigator.clipboard.writeText(message.content)
        return { success: true }
      } catch (error) {
        return { success: false, message: '复制失败' }
      }
    }
    return { success: false, message: '消息不存在' }
  }

  // 分享消息
  const shareMessage = async (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      // 实际应用中这里应该生成分享链接
      return { success: true }
    }
    return { success: false, message: '消息不存在' }
  }

  // 评分消息
  const rateMessage = async (messageId: string, rating: number) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.rating = rating
      return { success: true }
    }
    return { success: false, message: '消息不存在' }
  }

  // 切换任务类型
  const switchTaskType = async (taskTypeId: string) => {
    currentTaskType.value = taskTypeId
    return { success: true }
  }

  // 加载对话历史
  const loadConversationHistory = async (_conversationId: string) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/conversations/${conversationId}`)
      // 模拟加载历史消息
      messages.value = [
        {
          id: '1',
          role: 'ai',
          content: '您好！我是您的AI助手，可以帮您完成各种任务。请问有什么可以帮您的吗？',
          timestamp: Date.now() - 60000
        }
      ]
      return { success: true }
    } catch (error: any) {
      console.error('加载对话历史错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '加载对话历史失败'
      }
    }
  }

  // 导出对话
  const exportConversation = async () => {
    try {
      // 实际应用中这里应该调用API导出对话
      const data = JSON.stringify(messages.value, null, 2)
      return { success: true, data }
    } catch (error) {
      return { success: false, message: '导出对话失败' }
    }
  }

  return {
    // 状态
    messages,
    isTyping,
    currentTaskType,
    taskTypes,
    // 计算属性
    lastMessage,
    // 方法
    sendMessage,
    receiveAIResponse,
    startStreamingResponse,
    updateStepStatus,
    addThought,
    copyMessage,
    shareMessage,
    rateMessage,
    switchTaskType,
    loadConversationHistory,
    exportConversation
  }
})
