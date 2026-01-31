/**
 * 任务对话流程测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TaskChat from '@/views/TaskChat.vue'
import { useTaskStore } from '@/stores/task'
import axios from 'axios'

// 模拟路由
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  params: { id: '1' }
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRouter
}))

// 模拟测试数据
const mockMessages = [
  {
    id: 1,
    role: 'user',
    content: '请帮我分析市场趋势',
    timestamp: Date.now()
  },
  {
    id: 2,
    role: 'ai',
    content: '好的，我将为您分析市场趋势...',
    timestamp: Date.now(),
    steps: [
      { step: 1, title: '数据收集', description: '收集市场数据', status: 'completed', progress: 100 },
      { step: 2, title: '趋势分析', description: '分析市场趋势', status: 'in_progress', progress: 50 },
      { step: 3, title: '报告生成', description: '生成分析报告', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析市场数据...', timestamp: Date.now() },
      { id: '2', content: '识别出关键趋势...', timestamp: Date.now() + 1000 }
    ]
  }
]

const mockTaskTypes = [
  { id: 'market_analysis', name: '市场分析', description: '分析市场趋势和机会' },
  { id: 'competitor_research', name: '竞品研究', description: '研究竞争对手' },
  { id: 'user_research', name: '用户研究', description: '研究用户需求和行为' }
]

describe('任务对话流程', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清除之前的模拟
    vi.clearAllMocks()
  })

  describe('消息发送', () => {
    it('应该能够发送用户消息', async () => {
      const wrapper = mount(TaskChat, {
        global: {
          plugins: [createPinia()]
        }
      })

      const taskStore = useTaskStore()
      const result = await taskStore.sendMessage('测试消息')

      expect(result.success).toBe(true)
      expect(taskStore.messages.length).toBeGreaterThan(0)
      expect(taskStore.messages[taskStore.messages.length - 1].role).toBe('user')
      expect(taskStore.messages[taskStore.messages.length - 1].content).toBe('测试消息')
    })

    it('不应该发送空消息', async () => {
      const taskStore = useTaskStore()
      const result = await taskStore.sendMessage('')

      expect(result.success).toBe(false)
      expect(result.message).toContain('消息内容不能为空')
    })

    it('发送消息后应该显示正在输入状态', async () => {
      const taskStore = useTaskStore()
      await taskStore.sendMessage('测试消息')

      expect(taskStore.isTyping).toBe(true)
    })
  })

  describe('AI响应', () => {
    it('应该能够接收AI响应', async () => {
      const taskStore = useTaskStore()
      await taskStore.sendMessage('测试消息')

      // 模拟AI响应
      await taskStore.receiveAIResponse('这是AI的响应')

      const lastMessage = taskStore.messages[taskStore.messages.length - 1]
      expect(lastMessage.role).toBe('ai')
      expect(lastMessage.content).toBe('这是AI的响应')
    })

    it('应该支持流式响应', async () => {
      const taskStore = useTaskStore()
      const streamText = '这是流式响应的内容'

      await taskStore.startStreamingResponse(streamText)

      const lastMessage = taskStore.messages[taskStore.messages.length - 1]
      expect(lastMessage.role).toBe('ai')
      expect(lastMessage.content).toBe(streamText)
    })

    it('流式响应应该逐字显示', async () => {
      const taskStore = useTaskStore()
      const streamText = '流式响应'
      let currentText = ''

      await taskStore.startStreamingResponse(streamText, (text) => {
        currentText = text
      })

      expect(currentText).toBe(streamText)
    })
  })

  describe('任务步骤', () => {
    it('应该显示任务执行步骤', () => {
      const wrapper = mount(TaskChat, {
        global: {
          plugins: [createPinia()]
        }
      })

      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const aiMessage = taskStore.messages.find(m => m.role === 'ai')
      expect(aiMessage?.steps).toBeDefined()
      expect(aiMessage?.steps?.length).toBe(3)
    })

    it('应该更新步骤状态', async () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      await taskStore.updateStepStatus(2, 'completed', 100)

      const aiMessage = taskStore.messages.find(m => m.role === 'ai')
      const step = aiMessage?.steps?.find(s => s.step === 2)
      expect(step?.status).toBe('completed')
      expect(step?.progress).toBe(100)
    })

    it('应该显示步骤进度', () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const aiMessage = taskStore.messages.find(m => m.role === 'ai')
      const step = aiMessage?.steps?.find(s => s.step === 2)
      expect(step?.progress).toBe(50)
    })
  })

  describe('思考过程', () => {
    it('应该显示AI思考过程', () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const aiMessage = taskStore.messages.find(m => m.role === 'ai')
      expect(aiMessage?.thoughts).toBeDefined()
      expect(aiMessage?.thoughts?.length).toBe(2)
    })

    it('应该能够添加思考内容', async () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      await taskStore.addThought('新的思考内容')

      const aiMessage = taskStore.messages.find(m => m.role === 'ai')
      expect(aiMessage?.thoughts?.length).toBe(3)
      expect(aiMessage?.thoughts?.[2].content).toBe('新的思考内容')
    })
  })

  describe('消息操作', () => {
    it('应该能够复制消息', async () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const result = await taskStore.copyMessage(1)

      expect(result.success).toBe(true)
    })

    it('应该能够分享消息', async () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const result = await taskStore.shareMessage(1)

      expect(result.success).toBe(true)
    })

    it('应该能够对消息评分', async () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const result = await taskStore.rateMessage(2, 5)

      expect(result.success).toBe(true)
      const message = taskStore.messages.find(m => m.id === 2)
      expect(message?.rating).toBe(5)
    })
  })

  describe('任务类型', () => {
    it('应该支持不同的任务类型', () => {
      const taskStore = useTaskStore()
      taskStore.taskTypes = mockTaskTypes

      expect(taskStore.taskTypes.length).toBe(3)
      expect(taskStore.taskTypes[0].id).toBe('market_analysis')
    })

    it('应该能够切换任务类型', async () => {
      const taskStore = useTaskStore()
      taskStore.taskTypes = mockTaskTypes

      await taskStore.switchTaskType('competitor_research')

      expect(taskStore.currentTaskType).toBe('competitor_research')
    })
  })

  describe('对话历史', () => {
    it('应该能够加载对话历史', async () => {
      const taskStore = useTaskStore()
      await taskStore.loadConversationHistory('1')

      expect(taskStore.messages.length).toBeGreaterThan(0)
    })

    it('应该能够导出对话', async () => {
      const taskStore = useTaskStore()
      taskStore.messages = mockMessages

      const result = await taskStore.exportConversation()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })
})
