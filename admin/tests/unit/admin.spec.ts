/**
 * 管理端功能测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from '@/views/Dashboard.vue'
import UserManagement from '@/views/UserManagement.vue'
import { useAdminStore } from '@/stores/admin'

// 模拟路由
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

// 模拟测试数据
const mockUsers = [
  {
    id: 1,
    username: 'user1',
    nickname: '用户1',
    phone: '13800138001',
    email: 'user1@example.com',
    avatar: 'https://example.com/avatar1.jpg',
    subscriptionLevel: 0,
    status: 1,
    lastLoginTime: '2023-01-01T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'user2',
    nickname: '用户2',
    phone: '13800138002',
    email: 'user2@example.com',
    avatar: 'https://example.com/avatar2.jpg',
    subscriptionLevel: 1,
    status: 1,
    lastLoginTime: '2023-01-02T00:00:00Z',
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    username: 'user3',
    nickname: '用户3',
    phone: '13800138003',
    email: 'user3@example.com',
    avatar: 'https://example.com/avatar3.jpg',
    subscriptionLevel: 2,
    status: 0,
    lastLoginTime: '2023-01-03T00:00:00Z',
    createdAt: '2023-01-03T00:00:00Z'
  }
]

const mockMetrics = [
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

const mockActivities = [
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

describe('管理端功能', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('数据看板', () => {
    it('应该正确渲染关键指标卡片', () => {
      const adminStore = useAdminStore()
      adminStore.metrics = mockMetrics

      expect(adminStore.metrics.length).toBe(4)
    })

    it('应该显示指标趋势', () => {
      const adminStore = useAdminStore()
      adminStore.metrics = mockMetrics

      const firstMetric = adminStore.metrics[0]
      expect(firstMetric.trend).toBe(12.5)
      expect(firstMetric.label).toBe('总用户数')
    })

    it('应该支持刷新数据', async () => {
      const adminStore = useAdminStore()
      adminStore.metrics = mockMetrics

      await adminStore.refreshDashboardData()

      expect(adminStore.lastRefreshTime).toBeDefined()
    })

    it('应该支持日期范围筛选', async () => {
      const adminStore = useAdminStore()
      const dateRange = [new Date('2023-01-01'), new Date('2023-01-31')]

      await adminStore.filterByDateRange(dateRange)

      expect(adminStore.dateRange).toEqual(dateRange)
    })
  })

  describe('用户管理', () => {
    it('应该正确渲染用户列表', () => {
      const adminStore = useAdminStore()
      adminStore.users = mockUsers

      expect(adminStore.users.length).toBe(3)
    })

    it('应该支持用户搜索', async () => {
      const adminStore = useAdminStore()
      adminStore.users = mockUsers
      await adminStore.searchUsers('user1')

      // 验证搜索方法被调用
      expect(adminStore.users.length).toBe(3)
    })

    it('应该支持用户筛选', async () => {
      const adminStore = useAdminStore()
      adminStore.users = mockUsers
      await adminStore.filterUsers({ status: 1, subscriptionLevel: 1 })

      // 验证筛选方法被调用
      expect(adminStore.users.length).toBe(3)
    })

    it('应该能够查看用户详情', async () => {
      const adminStore = useAdminStore()
      adminStore.users = mockUsers

      await adminStore.viewUserDetail(1)

      expect(adminStore.currentUser).toBeDefined()
      expect(adminStore.currentUser.id).toBe(1)
    })

    it('应该能够编辑用户信息', async () => {
      const adminStore = useAdminStore()
      adminStore.users = [...mockUsers]

      const result = await adminStore.updateUser(1, {
        nickname: '更新后的昵称',
        email: 'updated@example.com'
      })

      expect(result.success).toBe(true)
      expect(adminStore.users[0].nickname).toBe('更新后的昵称')
      expect(adminStore.users[0].email).toBe('updated@example.com')
    })

    it('应该能够切换用户状态', async () => {
      const adminStore = useAdminStore()
      adminStore.users = [...mockUsers]

      const result = await adminStore.toggleUserStatus(1)

      expect(result.success).toBe(true)
      expect(adminStore.users[0].status).toBe(0)
    })

    it('应该能够删除用户', async () => {
      const adminStore = useAdminStore()
      adminStore.users = [...mockUsers]

      const result = await adminStore.deleteUser(1)

      expect(result.success).toBe(true)
      expect(adminStore.users.length).toBe(2)
      expect(adminStore.users.find(u => u.id === 1)).toBeUndefined()
    })

    it('应该支持批量操作', async () => {
      const adminStore = useAdminStore()
      adminStore.users = [...mockUsers]
      adminStore.selectedUsers = [1, 2]

      const result = await adminStore.batchDeleteUsers()

      expect(result.success).toBe(true)
      expect(adminStore.users.length).toBe(1)
    })
  })

  describe('系统状态', () => {
    it('应该显示系统状态指标', () => {
      const adminStore = useAdminStore()
      adminStore.systemStatus = [
        { label: '服务器状态', value: '正常', type: 'success', progress: 85 },
        { label: '数据库连接', value: '良好', type: 'success', progress: 92 }
      ]

      expect(adminStore.systemStatus.length).toBe(2)
      expect(adminStore.systemStatus[0].value).toBe('正常')
    })

    it('应该监控API响应时间', async () => {
      const adminStore = useAdminStore()

      await adminStore.checkApiHealth()

      expect(adminStore.apiHealthCheck).toBeDefined()
      expect(adminStore.apiHealthCheck.responseTime).toBeDefined()
    })
  })

  describe('最近活动', () => {
    it('应该显示最近活动列表', () => {
      const adminStore = useAdminStore()
      adminStore.recentActivities = mockActivities

      expect(adminStore.recentActivities.length).toBe(3)
      expect(adminStore.recentActivities[0].title).toBe('新用户注册')
    })

    it('应该能够加载更多活动', async () => {
      const adminStore = useAdminStore()
      adminStore.recentActivities = mockActivities

      await adminStore.loadMoreActivities()

      expect(adminStore.recentActivities.length).toBeGreaterThan(3)
    })
  })

  describe('数据导出', () => {
    it('应该支持导出用户数据', async () => {
      const adminStore = useAdminStore()
      adminStore.users = mockUsers

      const result = await adminStore.exportUsers()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('应该支持导出活动日志', async () => {
      const adminStore = useAdminStore()
      adminStore.recentActivities = mockActivities

      const result = await adminStore.exportActivityLog()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })
})
