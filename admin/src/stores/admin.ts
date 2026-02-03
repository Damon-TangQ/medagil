/**
 * 管理端状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户接口
export interface AdminUser {
  id: number
  username: string
  nickname?: string
  phone?: string
  email?: string
  avatar?: string
  subscriptionLevel: number
  status: number
  lastLoginTime?: string
  createdAt: string
}

// 指标接口
export interface Metric {
  label: string
  value: string
  icon: string
  color: string
  trend: number
}

// 活动接口
export interface Activity {
  id: number
  title: string
  description: string
  time: string
  icon: string
  color: string
}

// 系统状态接口
export interface SystemStatus {
  label: string
  value: string
  type: 'success' | 'warning' | 'danger'
  progress: number
}

// API基础URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const useAdminStore = defineStore('admin', () => {
  // 状态
  const users = ref<AdminUser[]>([])
  const metrics = ref<Metric[]>([])
  const recentActivities = ref<Activity[]>([])
  const systemStatus = ref<SystemStatus[]>([])
  const selectedUsers = ref<number[]>([])
  const currentUser = ref<AdminUser | null>(null)
  const loading = ref(false)
  const lastRefreshTime = ref<Date | null>(null)
  const dateRange = ref<[Date, Date] | null>(null)
  const apiHealthCheck = ref<{ status: string; responseTime: number } | null>(null)

  // 计算属性
  const filteredUsers = computed(() => {
    return users.value
  })

  // 刷新看板数据
  const refreshDashboardData = async () => {
    loading.value = true
    try {
      // 实际应用中这里应该调用API获取数据
      // const response = await axios.get(`${API_BASE_URL}/admin/dashboard`)

      // 模拟数据更新
      lastRefreshTime.value = new Date()

      return { success: true }
    } catch (error: any) {
      console.error('刷新看板数据错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '刷新数据失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 按日期范围筛选
  const filterByDateRange = async (range: [Date, Date]) => {
    dateRange.value = range
    // 实际应用中这里应该调用API获取筛选后的数据
    return { success: true }
  }

  // 搜索用户
  const searchUsers = async (keyword: string) => {
    try {
      // 实际应用中这里应该调用API搜索用户
      // const response = await axios.get(`${API_BASE_URL}/admin/users`, { params: { keyword } })

      // 模拟搜索结果
      const results = users.value.filter(user => 
        user.username.includes(keyword) || 
        user.nickname?.includes(keyword) ||
        user.phone?.includes(keyword)
      )

      return { success: true, data: results }
    } catch (error: any) {
      console.error('搜索用户错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '搜索用户失败'
      }
    }
  }

  // 筛选用户
  const filterUsers = async (filters: { status?: number; subscriptionLevel?: number }) => {
    try {
      // 实际应用中这里应该调用API筛选用户
      // const response = await axios.get(`${API_BASE_URL}/admin/users`, { params: filters })

      // 模拟筛选结果
      let results = [...users.value]
      if (filters.status !== undefined) {
        results = results.filter(user => user.status === filters.status)
      }
      if (filters.subscriptionLevel !== undefined) {
        results = results.filter(user => user.subscriptionLevel === filters.subscriptionLevel)
      }

      return { success: true, data: results }
    } catch (error: any) {
      console.error('筛选用户错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '筛选用户失败'
      }
    }
  }

  // 查看用户详情
  const viewUserDetail = async (userId: number) => {
    try {
      // 实际应用中这里应该调用API获取用户详情
      // const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`)

      const user = users.value.find(u => u.id === userId)
      if (user) {
        currentUser.value = user
        return { success: true }
      }

      return { success: false, message: '用户不存在' }
    } catch (error: any) {
      console.error('查看用户详情错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '获取用户详情失败'
      }
    }
  }

  // 更新用户信息
  const updateUser = async (userId: number, data: Partial<AdminUser>) => {
    try {
      // 实际应用中这里应该调用API更新用户
      // const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, data)

      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = { ...users.value[userIndex], ...data }
        return { success: true }
      }

      return { success: false, message: '用户不存在' }
    } catch (error: any) {
      console.error('更新用户信息错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '更新用户信息失败'
      }
    }
  }

  // 切换用户状态
  const toggleUserStatus = async (userId: number) => {
    try {
      // 实际应用中这里应该调用API切换用户状态
      // const response = await axios.patch(`${API_BASE_URL}/admin/users/${userId}/status`)

      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.status = user.status === 1 ? 0 : 1
        return { success: true }
      }

      return { success: false, message: '用户不存在' }
    } catch (error: any) {
      console.error('切换用户状态错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '切换用户状态失败'
      }
    }
  }

  // 删除用户
  const deleteUser = async (userId: number) => {
    try {
      // 实际应用中这里应该调用API删除用户
      // const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`)

      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value.splice(userIndex, 1)
        return { success: true }
      }

      return { success: false, message: '用户不存在' }
    } catch (error: any) {
      console.error('删除用户错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '删除用户失败'
      }
    }
  }

  // 批量删除用户
  const batchDeleteUsers = async () => {
    try {
      // 实际应用中这里应该调用API批量删除用户
      // const response = await axios.post(`${API_BASE_URL}/admin/users/batch-delete`, { ids: selectedUsers.value })

      users.value = users.value.filter(user => !selectedUsers.value.includes(user.id))
      selectedUsers.value = []
      return { success: true }
    } catch (error: any) {
      console.error('批量删除用户错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '批量删除用户失败'
      }
    }
  }

  // 检查API健康状态
  const checkApiHealth = async () => {
    try {
      const startTime = Date.now()
      // 实际应用中这里应该调用健康检查接口
      // await axios.get(`${API_BASE_URL}/health`)
      const responseTime = Date.now() - startTime

      apiHealthCheck.value = {
        status: 'healthy',
        responseTime
      }

      return { success: true }
    } catch (error: any) {
      console.error('检查API健康状态错误:', error)
      apiHealthCheck.value = {
        status: 'unhealthy',
        responseTime: 0
      }
      return {
        success: false,
        message: 'API健康检查失败'
      }
    }
  }

  // 加载更多活动
  const loadMoreActivities = async () => {
    try {
      // 实际应用中这里应该调用API加载更多活动
      // const response = await axios.get(`${API_BASE_URL}/admin/activities`, { params: { offset: recentActivities.value.length } })

      // 模拟加载更多活动
      const newActivities: Activity[] = [
        {
          id: recentActivities.value.length + 1,
          title: '系统备份',
          description: '系统自动备份已完成',
          time: '3小时前',
          icon: 'Setting',
          color: '#909399'
        }
      ]

      recentActivities.value.push(...newActivities)
      return { success: true }
    } catch (error: any) {
      console.error('加载更多活动错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '加载更多活动失败'
      }
    }
  }

  // 导出用户数据
  const exportUsers = async () => {
    try {
      // 实际应用中这里应该调用API导出用户数据
      // const response = await axios.get(`${API_BASE_URL}/admin/users/export`, { responseType: 'blob' })

      const data = JSON.stringify(users.value, null, 2)
      return { success: true, data }
    } catch (error: any) {
      console.error('导出用户数据错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '导出用户数据失败'
      }
    }
  }

  // 导出活动日志
  const exportActivityLog = async () => {
    try {
      // 实际应用中这里应该调用API导出活动日志
      // const response = await axios.get(`${API_BASE_URL}/admin/activities/export`, { responseType: 'blob' })

      const data = JSON.stringify(recentActivities.value, null, 2)
      return { success: true, data }
    } catch (error: any) {
      console.error('导出活动日志错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '导出活动日志失败'
      }
    }
  }

  return {
    // 状态
    users,
    metrics,
    recentActivities,
    systemStatus,
    selectedUsers,
    currentUser,
    loading,
    lastRefreshTime,
    dateRange,
    apiHealthCheck,
    // 计算属性
    filteredUsers,
    // 方法
    refreshDashboardData,
    filterByDateRange,
    searchUsers,
    filterUsers,
    viewUserDetail,
    updateUser,
    toggleUserStatus,
    deleteUser,
    batchDeleteUsers,
    checkApiHealth,
    loadMoreActivities,
    exportUsers,
    exportActivityLog
  }
})
