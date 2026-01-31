/**
 * 用户认证状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
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
  data?: {
    user: User
    token: string
    isNewUser?: boolean
  }
  code?: number
}

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  // 初始化router
  const router = useRouter()
  
  // 状态
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.subscriptionLevel === 2)
  const isPremium = computed(() => user.value?.subscriptionLevel === 1)

  // 设置token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    // 设置axios默认请求头
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
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
    delete axios.defaults.headers.common['Authorization']
  }

  // 手机号登录
  const phoneLogin = async (phone: string, password: string) => {
    loading.value = true
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/phone`, {
        phone,
        password
      })

      if (response.data.success && response.data.data) {
        setToken(response.data.data.token)
        setUser(response.data.data.user)
        // 登录成功后跳转到首页
        router.push('/')
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message || '登录失败' }
      }
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

  // 微信登录
  const wechatLogin = async (openid: string, unionid?: string, nickname?: string, avatar?: string) => {
    loading.value = true
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/wechat`, {
        openid,
        unionid,
        nickname,
        avatar
      })

      if (response.data.success && response.data.data) {
        setToken(response.data.data.token)
        setUser(response.data.data.user)
        return { 
          success: true, 
          message: response.data.message,
          isNewUser: response.data.data.isNewUser 
        }
      } else {
        return { success: false, message: response.data.message || '登录失败' }
      }
    } catch (error: any) {
      console.error('微信登录错误:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败，请稍后重试' 
      }
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return { success: false, message: '未登录' }

    loading.value = true
    try {
      const response = await axios.get<LoginResponse>(`${API_BASE_URL}/auth/user`)

      if (response.data.success && response.data.data) {
        setUser(response.data.data.user)
        return { success: true, message: '获取用户信息成功' }
      } else {
        // 如果获取失败，清除认证信息
        clearAuth()
        return { success: false, message: response.data.message || '获取用户信息失败' }
      }
    } catch (error: any) {
      console.error('获取用户信息错误:', error)
      // 如果获取失败，清除认证信息
      clearAuth()
      return { 
        success: false, 
        message: error.response?.data?.message || '获取用户信息失败' 
      }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    loading.value = true
    try {
      // 可以在这里调用后端的登出接口
      // await axios.post(`${API_BASE_URL}/auth/logout`)

      // 清除本地认证信息
      clearAuth()
      // 登出成功后跳转到登录页
      router.replace('/login')
      return { success: true, message: '登出成功' }
    } catch (error: any) {
      console.error('登出错误:', error)
      // 即使接口调用失败，也清除本地认证信息
      clearAuth()
      // 登出成功后跳转到登录页
      router.replace('/login')
      return { success: true, message: '登出成功' }
    } finally {
      loading.value = false
    }
  }

  // 初始化时，如果有token，设置axios请求头
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    // 状态
    token,
    user,
    loading,
    // 计算属性
    isAuthenticated,
    isAdmin,
    isPremium,
    // 方法
    setToken,
    setUser,
    clearAuth,
    phoneLogin,
    wechatLogin,
    fetchUserInfo,
    logout
  }
})
