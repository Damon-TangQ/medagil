import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import axios from 'axios'

// 模拟localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    }
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

// 模拟axios
vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')
  return {
    ...actual,
    defaults: {
      headers: {
        common: {}
      }
    },
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  }
})

// 全局模拟
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn(() => Promise.resolve('confirm'))
    }
  }
})

// 配置全局组件
config.global.stubs = {
  // Element Plus组件

  'el-icon': true,
  'el-avatar': true,
  'el-button': true,
  'el-input': true,
  'el-form': true,
  'el-form-item': true,
  'el-card': true,
  'el-table': true,
  'el-table-column': true,
  'el-pagination': true,
  'el-dialog': true,
  'el-select': true,
  'el-option': true,
  'el-radio': true,
  'el-radio-group': true,
  'el-switch': true,
  'el-tag': true,
  'el-descriptions': true,
  'el-descriptions-item': true,
  'el-upload': true,
  'el-dropdown': true,
  'el-dropdown-menu': true,
  'el-dropdown-item': true,
  'el-collapse': true,
  'el-collapse-item': true,
  'el-steps': true,
  'el-step': true,
  'el-progress': true,
  'el-date-picker': true,
  'el-tabs': true,
  'el-tab-pane': true,
  'el-link': true,
  'el-row': true,
  'el-col': true,
  'el-radio-button': true,
  'el-radio-group': true,
  'el-checkbox': true,
  'el-checkbox-group': true,
  'el-empty': true,
  'el-image': true,
  'el-skeleton': true,
  'el-skeleton-item': true,
  'el-divider': true,
  'el-tooltip': true,
  'el-popover': true
}

// 配置全局指令
config.global.directives = {
  loading: {}
}
