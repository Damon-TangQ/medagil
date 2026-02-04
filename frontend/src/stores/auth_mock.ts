/**
 * 用户认证状态管理（Mock模式）
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 用户接口
export interface User {
  id: string
  username: string
  nickname?: string
  phone?: string
  email?: string
  avatar?: string
  subscriptionLevel: number
  subscriptionExpireTime?: string
  status: number
  lastLoginTime?: string
  lastLoginIp?: string
  createdAt: string
  updatedAt: string
}

// 登录响应接口
export interface LoginResponse {
  success: boolean
  message: string
  code?: number
  data?: {
    token: string
    user: User
    isNewUser?: boolean
  }
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const userInfo = computed(() => user.value)

  // 设置token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  const setUser = (newUser: User) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 初始化用户信息
  const initUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('user')
      }
    }
  }

  // 初始化
  initUser()

  // 注册
  const register = async (data: { username: string; email: string; phone: string; password: string }) => {
    loading.value = true
    try {
      // Demo模式：模拟注册，不调用后端API
      // 在实际生产环境中，应该取消下面的注释，删除mock逻辑
      // const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/register`, {
      //   username: data.username,
      //   email: data.email,
      //   phone: data.phone,
      //   password: data.password
      // })

      // Mock数据：模拟注册成功
      const mockUser: User = {
        id: '1',
        username: data.username,
        email: data.email,
        phone: data.phone,
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subscriptionLevel: 1,
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 设置token和用户信息
      setToken('mock_token_' + Date.now())
      setUser(mockUser)

      // 返回注册成功信息
      return {
        success: true,
        message: '注册成功',
        data: {
          token: 'mock_token_' + Date.now(),
          user: mockUser
        }
      }

      // 以下是实际生产环境的代码（Demo模式下不执行）
      /*
      if (response.data.success && response.data.data) {
        setToken(response.data.data.token)
        setUser(response.data.data.user)
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message || '注册失败' }
      }
      */
    } catch (error: any) {
      console.error('注册错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '注册失败，请稍后重试'
      }
    } finally {
      loading.value = false
    }
  }

  // 手机号登录（支持无账号自动注册）- Mock模式
  const phoneLogin = async (phone: string, _code: string) => {
    loading.value = true
    try {
      // Demo模式：模拟手机号登录，不调用后端API
      // 在实际生产环境中，应该取消下面的注释，删除mock逻辑
      // const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/phone`, {
      //   phone,
      //   code
      // })

      // Mock数据：模拟登录成功
      const mockUser: User = {
        id: '1',
        username: 'demo_user',
        email: 'demo@example.com',
        phone: phone,
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subscriptionLevel: 1,
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 设置token和用户信息
      setToken('mock_token_' + Date.now())
      setUser(mockUser)

      // 返回登录成功信息
      return {
        success: true,
        message: '登录成功',
        data: {
          token: 'mock_token_' + Date.now(),
          user: mockUser,
          isNewUser: false
        }
      }

      // 以下是实际生产环境的代码（Demo模式下不执行）
      /*
      if (response.data.success && response.data.data) {
        setToken(response.data.data.token)
        setUser(response.data.data.user)
        // 登录成功后跳转到首页
        router.push('/')
        // 返回是否为新用户的信息
        return {
          success: true,
          message: response.data.message,
          data: {
            isNewUser: response.data.data.isNewUser || false,
            user: response.data.data.user
          }
        }
      } else {
        return { success: false, message: response.data.message || '登录失败' }
      }
      */
    } catch (error: any) {
      console.error('手机号登录错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '登录失败，请稍后重试'
      }
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  const logout = () => {
    clearAuth()
    router.push('/login')
  }

  // 检查用户是否已登录，如果未登录则跳转到登录页面
  const requireAuth = (): boolean => {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    userInfo,
    setToken,
    setUser,
    clearAuth,
    initUser,
    register,
    phoneLogin,
    logout,
    requireAuth
  }
})
