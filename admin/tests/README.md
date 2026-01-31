# Medagil管理端测试文档

## 测试框架

本项目使用以下测试框架和工具：
- **Vitest**: 现代化的测试框架，提供快速的单元测试和集成测试
- **Vue Test Utils**: Vue.js的官方单元测试工具库
- **jsdom**: 浏览器环境模拟，用于在Node.js中运行浏览器API

## 测试结构

```
tests/
├── unit/              # 单元测试
│   └── admin.spec.ts  # 管理端功能测试
├── setup.ts          # 测试设置文件
└── mockData.ts       # 测试数据
```

## 运行测试

### 运行所有测试
```bash
npm test
```

### 运行特定测试文件
```bash
npm test admin.spec.ts
```

### 运行测试并监听文件变化
```bash
npm test -- --watch
```

### 运行测试UI界面
```bash
npm run test:ui
```

### 生成测试覆盖率报告
```bash
npm run test:coverage
```

## 测试覆盖范围

### 管理端功能测试 (admin.spec.ts)

#### 1. 数据看板
- 关键指标卡片渲染
- 指标趋势显示
- 数据刷新
- 日期范围筛选

#### 2. 用户管理
- 用户列表展示
- 用户搜索
- 用户筛选
- 用户详情查看
- 用户信息编辑
- 用户状态切换
- 用户删除
- 批量操作

#### 3. 系统状态
- 系统状态指标显示
- API响应时间监控

#### 4. 最近活动
- 最近活动列表显示
- 加载更多活动

#### 5. 数据导出
- 导出用户数据
- 导出活动日志

## 测试数据

测试数据位于 `tests/mockData.ts` 文件中，包含：
- 管理员用户测试数据
- 普通用户测试数据
- 指标测试数据
- 活动测试数据
- 系统状态测试数据
- 项目统计测试数据
- 订阅统计测试数据

## 编写测试

### 示例：组件测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'

describe('Dashboard', () => {
  it('应该正确渲染关键指标卡片', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.findAll('.metric-card').length).toBe(4)
  })

  it('应该支持数据刷新', async () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()]
      }
    })

    const adminStore = useAdminStore()
    await adminStore.refreshDashboardData()

    expect(adminStore.lastRefreshTime).toBeDefined()
  })
})
```

### 示例：Store测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminStore } from '@/stores/admin'

describe('AdminStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该能够搜索用户', async () => {
    const adminStore = useAdminStore()
    adminStore.users = mockUsers

    await adminStore.searchUsers('admin1')

    const searchResults = adminStore.filteredUsers
    expect(searchResults.length).toBe(1)
    expect(searchResults[0].username).toBe('admin1')
  })
})
```

## 测试最佳实践

1. **保持测试简单**: 每个测试应该只测试一个功能点
2. **使用描述性的测试名称**: 测试名称应该清楚地说明测试的内容
3. **使用beforeEach和afterEach**: 在每个测试前后设置和清理测试环境
4. **避免测试实现细节**: 测试应该关注行为而不是实现
5. **使用模拟数据**: 使用模拟数据而不是真实数据
6. **保持测试独立**: 每个测试应该独立运行，不依赖其他测试

## 持续集成

测试将在以下情况下自动运行：
- 提交代码到仓库
- 创建Pull Request
- 合并代码到主分支

确保所有测试通过后再提交代码。
