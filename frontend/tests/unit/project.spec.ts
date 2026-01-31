/**
 * 项目创建和管理测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProjectList from '@/views/ProjectList.vue'
import CreateProject from '@/views/CreateProject.vue'
import { useProjectStore } from '@/stores/project'
import axios from 'axios'

// 模拟路由
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

// 模拟测试数据
const mockProjects = [
  {
    id: 1,
    name: '市场分析项目',
    description: '分析当前市场趋势和机会',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '产品规划项目',
    description: '制定产品发展规划',
    status: 'active',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: '营销方案项目',
    description: '制定营销推广方案',
    status: 'completed',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  }
]

describe('项目创建和管理', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清除之前的模拟
    vi.clearAllMocks()
  })

  describe('项目列表', () => {
    it('应该正确渲染项目列表', () => {
      const wrapper = mount(ProjectList, {
        global: {
          plugins: [createPinia()]
        }
      })

      const projectStore = useProjectStore()
      projectStore.projects = mockProjects

      expect(projectStore.projects.length).toBe(3)
      expect(wrapper.findAll('.project-card').length).toBe(3)
    })

    it('应该支持项目筛选', async () => {
      const wrapper = mount(ProjectList, {
        global: {
          plugins: [createPinia()]
        }
      })

      const projectStore = useProjectStore()
      projectStore.projects = mockProjects
      projectStore.filterStatus = 'active'

      const activeProjects = projectStore.filteredProjects
      expect(activeProjects.length).toBe(2)
      expect(activeProjects.every(p => p.status === 'active')).toBe(true)
    })

    it('应该支持项目搜索', async () => {
      const wrapper = mount(ProjectList, {
        global: {
          plugins: [createPinia()]
        }
      })

      const projectStore = useProjectStore()
      projectStore.projects = mockProjects
      
      // 模拟axios响应
      const mockedAxios = axios as any
      mockedAxios.get.mockResolvedValue({
        data: {
          success: true,
          data: {
            projects: mockProjects.filter(p => p.name.includes('市场')),
            total: 1,
            page: 1,
            pageSize: 12,
            totalPages: 1
          }
        }
      })
      
      const result = await projectStore.searchProjects('市场')

      expect(result.success).toBe(true)
    })
  })

  describe('项目列表', () => {
    it('应该正确渲染项目列表', () => {
      const wrapper = mount(ProjectList, {
        global: {
          plugins: [createPinia()]
        }
      })

      const projectStore = useProjectStore()
      projectStore.projects = mockProjects

      expect(projectStore.projects.length).toBe(3)
    })

    it('应该支持项目筛选', async () => {
      const projectStore = useProjectStore()
      projectStore.projects = mockProjects
      
      // 模拟axios响应
      const mockedAxios = axios as any
      mockedAxios.get.mockResolvedValue({
        data: {
          success: true,
          data: {
            projects: mockProjects.filter(p => p.status === 1),
            total: 2,
            page: 1,
            pageSize: 12,
            totalPages: 1
          }
        }
      })
      
      const result = await projectStore.filterByStatus(1)

      expect(result.success).toBe(true)
    })

    it('应该支持项目搜索', async () => {
      const projectStore = useProjectStore()
      const result = await projectStore.searchProjects('市场')

      expect(result.success).toBe(true)
    })
  })

  describe('项目加载更多', () => {
    it('应该能够加载更多项目', async () => {
      const projectStore = useProjectStore()
      projectStore.totalPages = 3
      projectStore.currentPage = 1

      const result = await projectStore.loadMore()

      expect(result.success).toBe(true)
      expect(projectStore.currentPage).toBe(2)
    })

    it('没有更多项目时不应该加载', async () => {
      const projectStore = useProjectStore()
      projectStore.totalPages = 1
      projectStore.currentPage = 1

      const result = await projectStore.loadMore()

      expect(result.success).toBe(false)
    })
  })

  describe('重置筛选条件', () => {
    it('应该能够重置筛选条件', async () => {
      const projectStore = useProjectStore()
      projectStore.searchKeyword = '测试'
      projectStore.selectedCategory = '1'
      projectStore.selectedStatus = 1

      const result = await projectStore.resetFilters()

      expect(result.success).toBe(true)
      expect(projectStore.searchKeyword).toBe('')
      expect(projectStore.selectedCategory).toBe('all')
      expect(projectStore.selectedStatus).toBeUndefined()
    })
  })
})
