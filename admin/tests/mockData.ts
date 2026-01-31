/**
 * 管理端测试数据
 */

// 用户测试数据
export const mockUsers = [
  {
    id: 1,
    username: 'admin1',
    nickname: '管理员1',
    phone: '13800138001',
    email: 'admin1@example.com',
    avatar: 'https://example.com/avatar1.jpg',
    subscriptionLevel: 2,
    status: 1,
    lastLoginTime: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'admin2',
    nickname: '管理员2',
    phone: '13800138002',
    email: 'admin2@example.com',
    avatar: 'https://example.com/avatar2.jpg',
    subscriptionLevel: 2,
    status: 1,
    lastLoginTime: '2023-01-02T00:00:00Z',
    createdAt: '2023-01-02T00:00:00Z'
  }
]

// 普通用户测试数据
export const mockRegularUsers = [
  {
    id: 3,
    username: 'user1',
    nickname: '用户1',
    phone: '13800138003',
    email: 'user1@example.com',
    avatar: 'https://example.com/avatar3.jpg',
    subscriptionLevel: 0,
    status: 1,
    lastLoginTime: '2023-01-03T00:00:00Z',
    createdAt: '2023-01-03T00:00:00Z'
  },
  {
    id: 4,
    username: 'user2',
    nickname: '用户2',
    phone: '13800138004',
    email: 'user2@example.com',
    avatar: 'https://example.com/avatar4.jpg',
    subscriptionLevel: 1,
    status: 0,
    lastLoginTime: '2023-01-04T00:00:00Z',
    createdAt: '2023-01-04T00:00:00Z'
  }
]

// 指标测试数据
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

// 活动测试数据
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
  },
  {
    id: 4,
    title: '支付成功',
    description: '用户 李四 完成了高级版订阅',
    time: '1小时前',
    icon: 'Money',
    color: '#f56c6c'
  },
  {
    id: 5,
    title: '系统更新',
    description: '系统已更新至 v1.2.3',
    time: '2小时前',
    icon: 'Setting',
    color: '#909399'
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

// 项目统计测试数据
export const mockProjectStats = [
  {
    id: 1,
    name: '市场分析项目',
    status: 'active',
    userCount: 15,
    taskCount: 25,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '产品规划项目',
    status: 'completed',
    userCount: 12,
    taskCount: 30,
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: '营销方案项目',
    status: 'active',
    userCount: 18,
    taskCount: 20,
    createdAt: '2023-01-03T00:00:00Z'
  }
]

// 订阅统计测试数据
export const mockSubscriptionStats = [
  {
    level: 0,
    name: '免费版',
    count: 1048,
    revenue: 0
  },
  {
    level: 1,
    name: '基础版',
    count: 735,
    revenue: 73500
  },
  {
    level: 2,
    name: '高级版',
    count: 580,
    revenue: 174000
  }
]
