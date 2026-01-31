# Medagil平台测试文档

## 测试框架

本项目使用以下测试框架和工具：
- **Vitest**: 现代化的测试框架，提供快速的单元测试和集成测试
- **Vue Test Utils**: Vue.js的官方单元测试工具库
- **jsdom**: 浏览器环境模拟，用于在Node.js中运行浏览器API

## 测试结构

```
tests/
├── unit/              # 单元测试
│   ├── auth.spec.ts   # 用户登录流程测试
│   ├── project.spec.ts # 项目创建和管理测试
│   └── taskchat.spec.ts # 任务对话流程测试
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
npm test auth.spec.ts
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

### 1. 用户登录流程测试 (auth.spec.ts)
- 登录表单验证
- 登录功能
- 登出功能

### 2. 项目创建和管理测试 (project.spec.ts)
- 项目列表展示
- 项目创建
- 项目编辑
- 项目删除
- 项目筛选和搜索

### 3. 任务对话流程测试 (taskchat.spec.ts)
- 消息发送
- AI响应
- 任务步骤
- 思考过程
- 消息操作
- 任务类型切换
- 对话历史

## 测试数据

测试数据位于 `tests/mockData.ts` 文件中，包含：
- 用户测试数据
- 项目测试数据
- 任务测试数据
- 消息测试数据
- 任务类型测试数据

## 编写测试

### 示例：组件测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello World')
  })

  it('应该响应点击事件', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### 示例：Store测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '@/stores/myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该正确设置状态', () => {
    const store = useMyStore()
    store.setValue('test')
    expect(store.value).toBe('test')
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
