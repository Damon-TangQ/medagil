/**
 * useTable 组合式函数
 * 封装表格数据管理逻辑
 */

import { ref, Ref, computed } from 'vue'
import type { UseTableOptions, UseTableResult } from '@/types'

/**
 * 表格数据管理
 */
export function useTable<T = any>(
  options: UseTableOptions<T>
): UseTableResult<T> {
  const { fetchFn, defaultParams = {}, pagination = true } = options

  // 数据状态
  const data = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const params = ref<any>({ ...defaultParams })

  // 计算属性
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasMore = computed(() => currentPage.value < totalPages.value)

  // 获取数据
  const fetchData = async (): Promise<void> => {
    try {
      loading.value = true
      const requestParams = pagination
        ? {
            ...params.value,
            page: currentPage.value,
            pageSize: pageSize.value
          }
        : params.value

      const result = await fetchFn(requestParams)
      data.value = result.list
      total.value = result.total
    } catch (error) {
      console.error('获取表格数据失败:', error)
      data.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = async (): Promise<void> => {
    currentPage.value = 1
    await fetchData()
  }

  // 页码改变
  const handlePageChange = async (page: number): Promise<void> => {
    currentPage.value = page
    await fetchData()
  }

  // 每页条数改变
  const handleSizeChange = async (size: number): Promise<void> => {
    pageSize.value = size
    currentPage.value = 1
    await fetchData()
  }

  // 更新查询参数
  const updateParams = async (newParams: any): Promise<void> => {
    params.value = { ...params.value, ...newParams }
    await refresh()
  }

  // 重置查询
  const reset = async (): Promise<void> => {
    params.value = { ...defaultParams }
    currentPage.value = 1
    pageSize.value = 10
    await fetchData()
  }

  return {
    data,
    loading,
    total,
    currentPage,
    pageSize,
    totalPages,
    hasMore,
    refresh,
    handlePageChange,
    handleSizeChange,
    updateParams,
    reset
  }
}
