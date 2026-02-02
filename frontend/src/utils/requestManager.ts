/**
 * 请求管理工具
 * 处理请求重试、取消、节流等功能
 */

import axios, { CancelTokenSource } from 'axios'

// ==================== 类型定义 ====================

export interface RetryConfig {
  times: number
  delay: number
  retryCondition?: (error: any) => boolean
}

export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: any
  retry?: RetryConfig
  cancelToken?: CancelTokenSource
}

// ==================== 请求重试类 ====================

class RequestRetry {
  /**
   * 带重试的请求
   */
  async request<T = any>(
    requestFn: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    const { times, delay, retryCondition } = config
    let lastError: any

    for (let i = 0; i <= times; i++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error

        // 检查是否应该重试
        if (i < times && this.shouldRetry(error, retryCondition)) {
          console.warn(`请求失败，第 ${i + 1} 次重试...`, error)
          await this.wait(delay)
          continue
        }

        throw error
      }
    }

    throw lastError
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any, condition?: (error: any) => boolean): boolean {
    // 网络错误或超时错误
    if (
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout')
    ) {
      return true
    }

    // 5xx服务器错误
    if (error.response?.status >= 500) {
      return true
    }

    // 自定义重试条件
    if (condition) {
      return condition(error)
    }

    return false
  }

  /**
   * 等待指定时间
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ==================== 请求取消类 ====================

class RequestCancel {
  private pendingRequests = new Map<string, CancelTokenSource>()

  /**
   * 生成请求键
   */
  private generateKey(config: RequestConfig): string {
    return `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.params)}`
  }

  /**
   * 添加待取消的请求
   */
  add(config: RequestConfig): CancelTokenSource {
    const key = this.generateKey(config)
    const source = axios.CancelToken.source()

    // 取消之前的相同请求
    this.cancel(key)

    // 添加新的请求
    this.pendingRequests.set(key, source)

    return source
  }

  /**
   * 取消指定请求
   */
  cancel(key: string): void {
    const source = this.pendingRequests.get(key)
    if (source) {
      source.cancel('请求被取消')
      this.pendingRequests.delete(key)
    }
  }

  /**
   * 取消所有请求
   */
  cancelAll(): void {
    this.pendingRequests.forEach((source) => {
      source.cancel('请求被取消')
    })
    this.pendingRequests.clear()
  }

  /**
   * 移除已完成的请求
   */
  remove(config: RequestConfig): void {
    const key = this.generateKey(config)
    this.pendingRequests.delete(key)
  }
}

// ==================== 请求节流类 ====================

class RequestThrottle {
  private requestCache = new Map<string, Promise<any>>()

  /**
   * 生成请求键
   */
  private generateKey(config: RequestConfig): string {
    return `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.params)}`
  }

  /**
   * 节流请求
   */
  async request<T = any>(
    config: RequestConfig,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const key = this.generateKey(config)

    // 如果有相同的请求正在进行，返回该请求的Promise
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key) as Promise<T>
    }

    // 执行新请求
    const promise = requestFn()
      .finally(() => {
        // 请求完成后清除缓存
        this.requestCache.delete(key)
      })

    // 缓存请求Promise
    this.requestCache.set(key, promise)

    return promise
  }

  /**
   * 清除所有缓存的请求
   */
  clear(): void {
    this.requestCache.clear()
  }
}

// ==================== 请求队列类 ====================

class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private maxConcurrent: number
  private currentCount: number = 0

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent
  }

  /**
   * 添加请求到队列
   */
  add<T = any>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedRequest = async () => {
        try {
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.currentCount--
          this.next()
        }
      }

      this.queue.push(wrappedRequest)
      this.next()
    })
  }

  /**
   * 执行下一个请求
   */
  private next(): void {
    if (this.currentCount >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    const requestFn = this.queue.shift()
    if (requestFn) {
      this.currentCount++
      requestFn()
    }
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.queue = []
  }
}

// ==================== 导出单例 ====================

export const requestRetry = new RequestRetry()
export const requestCancel = new RequestCancel()
export const requestThrottle = new RequestThrottle()
export const requestQueue = new RequestQueue()

// ==================== 导出 ====================

export default {
  requestRetry,
  requestCancel,
  requestThrottle,
  requestQueue
}
