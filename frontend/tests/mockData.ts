/**
 * 测试数据
 */

// 用户测试数据
export const mockUsers = [
  {
    id: 1,
    username: 'testuser1',
    nickname: '测试用户1',
    phone: '13800138001',
    email: 'testuser1@example.com',
    avatar: 'https://example.com/avatar1.jpg',
    subscriptionLevel: 0,
    status: 1,
    lastLoginTime: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'testuser2',
    nickname: '测试用户2',
    phone: '13800138002',
    email: 'testuser2@example.com',
    avatar: 'https://example.com/avatar2.jpg',
    subscriptionLevel: 1,
    status: 1,
    lastLoginTime: '2023-01-02T00:00:00Z',
    createdAt: '2023-01-02T00:00:00Z'
  }
]

// 项目测试数据
export const mockProjects = [
  {
    id: 1,
    name: '市场分析项目',
    description: '分析当前市场趋势和机会',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '产品规划项目',
    description: '制定产品发展规划',
    status: 'active',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: '营销方案项目',
    description: '制定营销推广方案',
    status: 'completed',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  }
]

// 任务测试数据
export const mockTasks = [
  {
    id: 1,
    projectId: 1,
    title: '市场数据分析',
    description: '分析市场数据和趋势',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    projectId: 1,
    title: '竞品分析',
    description: '分析主要竞争对手',
    status: 'pending',
    priority: 'medium',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  }
]

// 消息测试数据
export const mockMessages = [
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

// 任务类型测试数据
export const mockTaskTypes = [
  { id: 'market_analysis', name: '市场分析', description: '分析市场趋势和机会' },
  { id: 'competitor_research', name: '竞品研究', description: '研究竞争对手' },
  { id: 'user_research', name: '用户研究', description: '研究用户需求和行为' }
]

// 管理端指标测试数据
export const mockMetrics = [
  {
    label: '总用户数',
    value: '12,580',
    icon: 'User',
    color: '#409eff',
    trend: 12.5
  },
  {
    label: '活跃用户',
    value: '8,420',
    icon: 'UserFilled',
    color: '#67c23a',
    trend: 8.3
  },
  {
    label: '任务总数',
    value: '45,620',
    icon: 'Document',
    color: '#e6a23c',
    trend: -2.4
  },
  {
    label: '总收入',
    value: '¥328,500',
    icon: 'Money',
    color: '#f56c6c',
    trend: 15.7
  }
]

// 管理端活动测试数据
export const mockActivities = [
  {
    id: 1,
    title: '新用户注册',
    description: '用户 张三 完成了注册',
    time: '5分钟前',
    icon: 'UserFilled',
    color: '#409eff'
  },
  {
    id: 2,
    title: '任务完成',
    description: '项目 "市场分析报告" 任务已完成',
    time: '15分钟前',
    icon: 'CircleCheck',
    color: '#67c23a'
  },
  {
    id: 3,
    title: '系统警告',
    description: 'API响应时间超过阈值',
    time: '30分钟前',
    icon: 'Warning',
    color: '#e6a23c'
  }
]

// 系统状态测试数据
export const mockSystemStatus = [
  {
    label: '服务器状态',
    value: '正常',
    type: 'success',
    progress: 85
  },
  {
    label: '数据库连接',
    value: '良好',
    type: 'success',
    progress: 92
  },
  {
    label: 'API响应',
    value: '较慢',
    type: 'warning',
    progress: 68
  },
  {
    label: '存储空间',
    value: '充足',
    type: 'success',
    progress: 75
  }
]
