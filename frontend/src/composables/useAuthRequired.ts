import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth_mock'

/**
 * 需要登录才能访问的功能钩子
 * 当用户未登录时，跳转到登录页面
 */
export function useAuthRequired() {
  const authStore = useAuthStore()
  const router = useRouter()

  /**
   * 检查用户是否已登录
   * 如果未登录，跳转到登录页面
   * @returns 是否已登录
   */
  const requireAuth = (): boolean => {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  return {
    requireAuth
  }
}
