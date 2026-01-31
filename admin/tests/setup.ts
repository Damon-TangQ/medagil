import { vi } from 'vitest'
import { config } from '@vue/test-utils'

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
  'el-row': true,
  'el-col': true
}
