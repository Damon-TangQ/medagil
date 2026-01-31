/**
 * useRequest 组合式函数
 * 封装异步请求逻辑
 */

import { ref, Ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { AsyncFn, UseRequestOptions, UseRequestResult } from '@/types'

/**
 * 请求状态管理
 */
export function useRequest<T = any>(
  requestFn: AsyncFn<T>,
  options: UseRequestOptions<T> = {}
): UseRequestResult<T> {
  const {
    manual = false,
    defaultParams = [],
    onSuccess,
    onError,
    onFinally
  } = options

  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)
  let currentRequest: Promise<T> | null = null

  // 执行请求
  const run = async (...params: any[]): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      currentRequest = requestFn(...params)
      const result = await currentRequest
      data.value = result
      onSuccess?.(result)
    } catch (err) {
      error.value = err as Error
      onError?.(err as Error)
      ElMessage.error((err as Error).message || '请求失败')
    } finally {
      loading.value = false
      currentRequest = null
      onFinally?.()
    }
  }

  // 刷新数据
  const refresh = async (): Promise<void> => {
    await run(...defaultParams)
  }

  // 取消请求
  const cancel = (): void => {
    if (currentRequest) {
      // TODO: 实现请求取消逻辑
      currentRequest = null
    }
  }

  // 组件卸载时取消请求
  onUnmounted(() => {
    cancel()
  })

  // 非手动模式自动执行
  if (!manual) {
    run(...defaultParams)
  }

  return {
    data,
    loading,
    error,
    run,
    refresh,
    cancel
  }
}
