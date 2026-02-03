import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth_mock'
import { ElMessage } from 'element-plus'

/**
 * 需要登录才能访问的功能钩子
 * 当用户未登录时，显示登录模态框
 */
export function useAuthRequired() {
  const authStore = useAuthStore()
  const loginModalVisible = ref(false)

  /**
   * 检查用户是否已登录
   * 如果未登录，显示登录模态框
   * @returns 是否已登录
   */
  const requireAuth = (): boolean => {
    if (!authStore.isAuthenticated) {
      loginModalVisible.value = true
      ElMessage.warning('请先登录')
      return false
    }
    return true
  }

  /**
   * 登录成功后的回调
   */
  const handleLoginSuccess = () => {
    loginModalVisible.value = false
    // 登录成功后，解除所有登录拦截
    // 可以在这里添加额外的逻辑，如刷新用户信息、更新权限等
    console.log('登录成功，解除拦截')
  }

  return {
    loginModalVisible,
    requireAuth,
    handleLoginSuccess
  }
}
