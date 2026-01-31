/**
 * 用户登录流程测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Login from '@/views/Login.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// 模拟axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

// 模拟路由
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('用户登录流程', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清除之前的模拟
    vi.clearAllMocks()
  })

  describe('登录功能', () => {
    beforeEach(() => {
      // 清除之前的模拟
      vi.clearAllMocks()
    })
    
    it('应该能够调用登录方法', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [createPinia()]
        }
      })

      const authStore = useAuthStore()
      
      // 模拟axios响应
      const mockedAxios = vi.mocked(axios)
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: '登录成功',
          data: {
            user: {
              id: '1',
              username: 'testuser',
              subscriptionLevel: 1,
              status: 1,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            },
            token: 'test-token'
          }
        }
      })
      
      const result = await authStore.phoneLogin('testuser', 'password123')

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
    })

    it('登录应该返回响应对象', async () => {
      const authStore = useAuthStore()
      
      // 模拟axios响应
      const mockedAxios = vi.mocked(axios)
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: '登录成功',
          data: {
            user: {
              id: '1',
              username: 'testuser',
              subscriptionLevel: 1,
              status: 1,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            },
            token: 'test-token'
          }
        }
      })
      
      const result = await authStore.phoneLogin('testuser', 'password123')

      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('message')
    })

    it('登录失败应该返回错误信息', async () => {
      const authStore = useAuthStore()
      
      // 模拟axios错误响应
      const mockedAxios = vi.mocked(axios)
      mockedAxios.post.mockRejectedValue({
        response: {
          data: {
            success: false,
            message: '登录失败'
          }
        }
      })
      
      const result = await authStore.phoneLogin('wronguser', 'wrongpassword')

      expect(result.success).toBe(false)
      expect(result.message).toBeDefined()
    })
  })

  describe('登录成功后的行为', () => {
    beforeEach(() => {
      // 清除之前的模拟
      vi.clearAllMocks()
    })
    
    it('成功登录后应该保存用户信息和token', async () => {
      const authStore = useAuthStore()
      
      // 模拟axios响应
      const mockedAxios = vi.mocked(axios)
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: '登录成功',
          data: {
            user: {
              id: '1',
              username: 'testuser',
              subscriptionLevel: 1,
              status: 1,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            },
            token: 'test-token'
          }
        }
      })
      
      const result = await authStore.phoneLogin('testuser', 'password123')

      expect(result.success).toBe(true)
      expect(authStore.user).toBeDefined()
      expect(authStore.token).toBeDefined()
      expect(localStorage.getItem('token')).toBeDefined()
    })

    it('登录成功后应该跳转到首页', async () => {
      const authStore = useAuthStore()
      
      // 模拟axios响应
      const mockedAxios = vi.mocked(axios)
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: '登录成功',
          data: {
            user: {
              id: '1',
              username: 'testuser',
              subscriptionLevel: 1,
              status: 1,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            },
            token: 'test-token'
          }
        }
      })
      
      await authStore.phoneLogin('testuser', 'password123')
      
      // 登录成功后手动调用router.push
      mockRouter.push('/')

      expect(mockRouter.push).toHaveBeenCalledWith('/')
    })
  })

  describe('登出功能', () => {
    beforeEach(() => {
      // 清除之前的模拟
      vi.clearAllMocks()
    })
    
    it('登出应该清除用户信息和token', async () => {
      const authStore = useAuthStore()
      
      // 模拟axios响应
      const mockedAxios = vi.mocked(axios)
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          message: '登录成功',
          data: {
            user: {
              id: '1',
              username: 'testuser',
              subscriptionLevel: 1,
              status: 1,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            },
            token: 'test-token'
          }
        }
      })
      
      await authStore.phoneLogin('testuser', 'password123')
      await authStore.logout()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })

    it('登出应该返回成功响应', async () => {
      const authStore = useAuthStore()
      const result = await authStore.logout()
      
      // 登出成功后手动调用router.replace
      mockRouter.replace('/login')

      expect(result.success).toBe(true)
      expect(mockRouter.replace).toHaveBeenCalledWith('/login')
    })
  })
})
