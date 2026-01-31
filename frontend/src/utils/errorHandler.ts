/**
 * 错误处理工具
 * 统一处理各种错误类型
 */

import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { storage } from '@/shared'
import type { ErrorType, AppError, ERROR_MESSAGES } from '@/shared/types/common'

// 重新导出共享类型
export { ErrorType, AppError }
export { ERROR_MESSAGES } from '@/shared/types/common

// ==================== 错误处理类 ====================

class ErrorHandler {
  /**
   * 处理错误
   */
  handle(error: AppError | Error | any): void {
    if (this.isNetworkError(error)) {
      this.handleNetworkError(error)
    } else if (this.isAuthError(error)) {
      this.handleAuthError(error)
    } else if (this.isBusinessError(error)) {
      this.handleBusinessError(error)
    } else {
      this.handleSystemError(error)
    }
  }

  /**
   * 判断是否为网络错误
   */
  private isNetworkError(error: any): boolean {
    return (
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error') ||
      error.type === ErrorType.NETWORK ||
      error.type === ErrorType.TIMEOUT
    )
  }

  /**
   * 判断是否为认证错误
   */
  private isAuthError(error: any): boolean {
    return (
      error.response?.status === 401 ||
      error.type === ErrorType.AUTH
    )
  }

  /**
   * 判断是否为业务错误
   */
  private isBusinessError(error: any): boolean {
    return (
      error.response?.status >= 400 &&
      error.response?.status < 500 &&
      error.response?.status !== 401
    )
  }

  /**
   * 处理网络错误
   */
  private handleNetworkError(error: any): void {
    let message = '网络连接失败，请检查网络'

    if (error.code === 'ECONNABORTED') {
      message = '请求超时，请稍后重试'
    } else if (error.message?.includes('Network Error')) {
      message = '网络连接失败，请检查网络'
    }

    ElMessage.error(message)
    console.error('网络错误:', error)
  }

  /**
   * 处理认证错误
   */
  private async handleAuthError(error: any): void {
    try {
      await ElMessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      // 清除认证信息
      storage.remove('token')
      storage.remove('user')

      // 跳转到登录页
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    } catch {
      // 用户取消
    }
  }

  /**
   * 处理业务错误
   */
  private handleBusinessError(error: any): void {
    const { status, data } = error.response
    const message = data?.message || ERROR_MESSAGES[status] || '请求失败'

    ElMessage.error(message)
    console.error('业务错误:', error)
  }

  /**
   * 处理系统错误
   */
  private handleSystemError(error: any): void {
    ElMessage.error('系统错误，请稍后重试')
    console.error('系统错误:', error)

    // TODO: 上报错误到监控系统
    // this.reportError(error)
  }

  /**
   * 创建应用错误
   */
  createError(
    message: string,
    type: ErrorType,
    code?: number,
    details?: any
  ): AppError {
    const error = new Error(message) as AppError
    error.type = type
    error.code = code
    error.details = details
    return error
  }

  /**
   * 报告错误
   */
  private reportError(error: any): void {
    // TODO: 实现错误上报逻辑
    // 例如：发送到Sentry或其他监控系统
    console.log('上报错误:', error)
  }
}

// ==================== 导出单例 ====================

export const errorHandler = new ErrorHandler()

// ==================== 便捷方法 ====================

/**
 * 处理Promise错误
 */
export const handlePromiseError = async <T>(
  promise: Promise<T>
): Promise<[Error | null, T | null]> => {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    errorHandler.handle(error)
    return [error as Error, null]
  }
}

/**
 * 创建错误提示
 */
export const showError = (message: string, duration: number = 3000): void => {
  ElMessage.error(message)
}

/**
 * 创建成功提示
 */
export const showSuccess = (message: string, duration: number = 3000): void => {
  ElMessage.success(message)
}

/**
 * 创建警告提示
 */
export const showWarning = (message: string, duration: number = 3000): void => {
  ElMessage.warning(message)
}

/**
 * 创建信息提示
 */
export const showInfo = (message: string, duration: number = 3000): void => {
  ElMessage.info(message)
}

// ==================== 导出 ====================

export default errorHandler
export * from './errorHandler'
