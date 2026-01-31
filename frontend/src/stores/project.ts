/**
 * 项目状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// 项目接口
export interface Project {
  id: string
  userId: string
  categoryId?: string
  name: string
  description?: string
  coverImage?: string
  tags?: string
  status: number
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
}

// 项目列表响应接口
export interface ProjectListResponse {
  success: boolean
  message: string
  data?: {
    projects: Project[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  code?: number
}

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const useProjectStore = defineStore('project', () => {
  // 状态
  const projects = ref<Project[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const totalPages = ref(0)
  const loading = ref(false)
  const searchKeyword = ref('')
  const selectedCategory = ref<string>('all')
  const selectedStatus = ref<number | undefined>(undefined)

  // 计算属性
  const hasMore = computed(() => currentPage.value < totalPages.value)

  // 获取项目列表
  const fetchProjects = async (page: number = currentPage.value) => {
    loading.value = true
    try {
      const params: any = {
        page,
        pageSize: pageSize.value
      }

      // 添加搜索关键词
      if (searchKeyword.value) {
        params.keyword = searchKeyword.value
      }

      // 添加分类筛选
      if (selectedCategory.value !== 'all') {
        params.categoryId = selectedCategory.value
      }

      // 添加状态筛选
      if (selectedStatus.value !== undefined) {
        params.status = selectedStatus.value
      }

      const response = await axios.get<ProjectListResponse>(`${API_BASE_URL}/projects`, { params })

      if (response.data.success && response.data.data) {
        projects.value = response.data.data.projects
        total.value = response.data.data.total
        currentPage.value = response.data.data.page
        totalPages.value = response.data.data.totalPages
        return { success: true }
      } else {
        return { success: false, message: response.data.message || '获取项目列表失败' }
      }
    } catch (error: any) {
      console.error('获取项目列表错误:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || '获取项目列表失败，请稍后重试' 
      }
    } finally {
      loading.value = false
    }
  }

  // 搜索项目
  const searchProjects = async (keyword: string, page: number = 1) => {
    searchKeyword.value = keyword
    currentPage.value = page
    return fetchProjects(page)
  }

  // 按分类筛选项目
  const filterByCategory = async (categoryId: string, page: number = 1) => {
    selectedCategory.value = categoryId
    currentPage.value = page
    return fetchProjects(page)
  }

  // 按状态筛选项目
  const filterByStatus = async (status: number | undefined, page: number = 1) => {
    selectedStatus.value = status
    currentPage.value = page
    return fetchProjects(page)
  }

  // 加载更多项目
  const loadMore = async () => {
    if (!hasMore.value || loading.value) return { success: false }
    const nextPage = currentPage.value + 1
    return fetchProjects(nextPage)
  }

  // 重置筛选条件
  const resetFilters = async () => {
    searchKeyword.value = ''
    selectedCategory.value = 'all'
    selectedStatus.value = undefined
    currentPage.value = 1
    try {
      await fetchProjects(1)
      return { success: true }
    } catch (error: any) {
      console.error('重置筛选条件错误:', error)
      return {
        success: false,
        message: error.response?.data?.message || '重置筛选条件失败'
      }
    }
  }

  return {
    // 状态
    projects,
    total,
    currentPage,
    pageSize,
    totalPages,
    loading,
    searchKeyword,
    selectedCategory,
    selectedStatus,
    // 计算属性
    hasMore,
    // 方法
    fetchProjects,
    searchProjects,
    filterByCategory,
    filterByStatus,
    loadMore,
    resetFilters
  }
})
