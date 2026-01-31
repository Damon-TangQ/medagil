# 代码规范文档

## 概述

本文档详细说明了前端项目的代码规范，包括命名规范、代码风格、最佳实践等内容。

## 目录

- [命名规范](#命名规范)
- [代码风格](#代码风格)
- [组件规范](#组件规范)
- [TypeScript规范](#typescript规范)
- [最佳实践](#最佳实践)
- [代码审查](#代码审查)

## 命名规范

### 1. 文件命名

#### 组件文件
```typescript
// ✅ 推荐：PascalCase
ProjectForm.vue
UserList.vue
TaskDetail.vue

// ❌ 不推荐
projectForm.vue
user_list.vue
task-detail.vue
```

#### 工具文件
```typescript
// ✅ 推荐：camelCase
request.ts
errorHandler.ts
requestManager.ts

// ❌ 不推荐
Request.ts
error-handler.ts
request_manager.ts
```

#### 类型文件
```typescript
// ✅ 推荐：PascalCase
User.ts
Project.ts
ApiResponse.ts

// ❌ 不推荐
user.ts
project.ts
api-response.ts
```

#### 常量文件
```typescript
// ✅ 推荐：camelCase
apiConfig.ts
storageKeys.ts
constants.ts

// ❌ 不推荐
API_CONFIG.ts
storage-keys.ts
CONSTANTS.ts
```

### 2. 变量命名

#### 普通变量
```typescript
// ✅ 推荐：camelCase
const userName = 'John'
const getUserInfo = () => {}
const isLoading = ref(false)

// ❌ 不推荐
const user_name = 'John'
const get_user_info = () => {}
const loading = ref(false)
```

#### 常量
```typescript
// ✅ 推荐：UPPER_SNAKE_CASE
const MAX_COUNT = 100
const API_BASE_URL = 'https://api.example.com'
const DEFAULT_PAGE_SIZE = 10

// ❌ 不推荐
const maxCount = 100
const apiBaseUrl = 'https://api.example.com'
const defaultPageSize = 10
```

#### 私有变量
```typescript
// ✅ 推荐：下划线前缀
const _privateValue = 123
const _internalMethod = () => {}

// ❌ 不推荐
const privateValue = 123
const internalMethod = () => {}
```

### 3. 函数命名

#### 普通函数
```typescript
// ✅ 推荐：动词开头
const getUserInfo = () => {}
const handleSubmit = () => {}
const fetchData = async () => {}

// ❌ 不推荐
const userInfo = () => {}
const handle = () => {}
const data = async () => {}
```

#### 事件处理函数
```typescript
// ✅ 推荐：handle前缀
const handleClick = () => {}
const handleSubmit = () => {}
const handleCancel = () => {}

// ❌ 不推荐
const click = () => {}
const submit = () => {}
const cancel = () => {}
```

#### 异步函数
```typescript
// ✅ 推荐：明确表示异步
const fetchUserData = async () => {}
const loadProjectList = async () => {}
const submitForm = async () => {}

// ❌ 不推荐
const getUserData = () => {}
const getProjectList = () => {}
const submit = () => {}
```

## 代码风格

### 1. 格式化

#### 缩进
```typescript
// ✅ 推荐：2空格缩进
function example() {
  if (condition) {
    doSomething()
  }
}

// ❌ 不推荐：4空格缩进
function example() {
    if (condition) {
        doSomething()
    }
}
```

#### 引号
```typescript
// ✅ 推荐：单引号
const message = 'Hello'
const name = 'John'

// ❌ 不推荐：双引号
const message = "Hello"
const name = "John"
```

#### 分号
```typescript
// ✅ 推荐：不使用分号
const message = 'Hello'
console.log(message)

// ❌ 不推荐：使用分号
const message = 'Hello';
console.log(message);
```

#### 对象
```typescript
// ✅ 推荐：大括号内空格
const obj = { name: 'John', age: 30 }

// ❌ 不推荐：大括号内无空格
const obj = {name: 'John', age: 30}
```

### 2. 注释

#### 单行注释
```typescript
// ✅ 推荐：空格后跟内容
// 这是一个单行注释

// ❌ 不推荐：无空格
//这是一个单行注释
```

#### 多行注释
```typescript
// ✅ 推荐：JSDoc风格
/**
 * 获取用户信息
 * @param userId - 用户ID
 * @returns 用户信息
 */
const getUserInfo = (userId: string) => {}

// ❌ 不推荐：普通多行注释
/*
获取用户信息
userId - 用户ID
返回用户信息
*/
const getUserInfo = (userId: string) => {}
```

#### TODO注释
```typescript
// ✅ 推荐：TODO格式
// TODO: 实现用户认证功能
// FIXME: 修复登录bug
// HACK: 临时解决方案

// ❌ 不推荐：不规范的TODO
// 需要实现用户认证
// 修复登录bug
```

## 组件规范

### 1. 组件定义

#### Script Setup
```vue
<!-- ✅ 推荐：使用<script setup> -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<!-- ❌ 不推荐：使用Options API -->
<script lang="ts">
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
```

#### Props定义
```vue
<!-- ✅ 推荐：定义Props类型 -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>

<!-- ❌ 不推荐：不定义类型 -->
<script setup lang="ts">
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0
  }
})
</script>
```

#### Emits定义
```vue
<!-- ✅ 推荐：定义Emits类型 -->
<script setup lang="ts">
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: string): void
}

const emit = defineEmits<Emits>()
</script>

<!-- ❌ 不推荐：不定义类型 -->
<script setup lang="ts">
const emit = defineEmits(['update', 'delete'])
</script>
```

### 2. 模板规范

#### 属性换行
```vue
<!-- ✅ 推荐：多属性换行 -->
<el-button
  type="primary"
  :loading="loading"
  @click="handleClick"
>
  提交
</el-button>

<!-- ❌ 不推荐：单行多属性 -->
<el-button type="primary" :loading="loading" @click="handleClick">提交</el-button>
```

#### v-for
```vue
<!-- ✅ 推荐：使用唯一key -->
<div v-for="item in list" :key="item.id">
  {{ item.name }}
</div>

<!-- ❌ 不推荐：使用索引作为key -->
<div v-for="(item, index) in list" :key="index">
  {{ item.name }}
</div>
```

#### 条件渲染
```vue
<!-- ✅ 推荐：v-if和v-else搭配使用 -->
<div v-if="loading">加载中...</div>
<div v-else-if="error">加载失败</div>
<div v-else>内容</div>

<!-- ❌ 不推荐：多个v-if -->
<div v-if="loading">加载中...</div>
<div v-if="!loading && error">加载失败</div>
<div v-if="!loading && !error">内容</div>
```

## TypeScript规范

### 1. 类型定义

#### 接口定义
```typescript
// ✅ 推荐：使用interface定义对象类型
interface User {
  id: string
  name: string
  email: string
}

// ❌ 不推荐：使用type定义对象类型
type User = {
  id: string
  name: string
  email: string
}
```

#### 联合类型
```typescript
// ✅ 推荐：使用type定义联合类型
type Status = 'pending' | 'success' | 'error'

// ❌ 不推荐：使用interface定义联合类型
interface Status {
  'pending': string
  'success': string
  'error': string
}
```

#### 类型导入
```typescript
// ✅ 推荐：使用type导入
import type { User, Project } from '@/types'

// ❌ 不推荐：使用普通导入
import { User, Project } from '@/types'
```

### 2. 类型使用

#### 类型断言
```typescript
// ✅ 推荐：使用as断言
const user = data as User

// ❌ 不推荐：使用尖括号断言
const user = <User>data
```

#### 可选属性
```typescript
// ✅ 推荐：明确标记可选属性
interface User {
  id: string
  name?: string
  email?: string
}

// ❌ 不推荐：使用undefined联合
interface User {
  id: string
  name: string | undefined
  email: string | undefined
}
```

#### 只读属性
```typescript
// ✅ 推荐：使用readonly
interface Config {
  readonly id: string
  readonly version: string
}

// ❌ 不推荐：不使用readonly
interface Config {
  id: string
  version: string
}
```

## 最佳实践

### 1. 组合式函数

#### 提取可复用逻辑
```typescript
// ✅ 推荐：提取可复用逻辑
// composables/useList.ts
export function useList<T>(fetchFn: () => Promise<T[]>) {
  const list = ref<T[]>([])
  const loading = ref(false)

  const fetch = async () => {
    loading.value = true
    try {
      list.value = await fetchFn()
    } finally {
      loading.value = false
    }
  }

  return { list, loading, fetch }
}

// 使用
const { list, loading, fetch } = useList(getProjectList)

// ❌ 不推荐：在组件中重复逻辑
<script setup lang="ts">
const list = ref([])
const loading = ref(false)

const fetch = async () => {
  loading.value = true
  try {
    list.value = await getProjectList()
  } finally {
    loading.value = false
  }
}
</script>
```

### 2. 错误处理

#### 统一错误处理
```typescript
// ✅ 推荐：使用统一错误处理
try {
  const response = await get('/projects')
} catch (error) {
  errorHandler.handle(error)
}

// ❌ 不推荐：分散的错误处理
try {
  const response = await get('/projects')
  if (error.response?.status === 401) {
    // 处理401
  } else if (error.response?.status === 403) {
    // 处理403
  }
  // ...
}
```

### 3. 性能优化

#### 计算属性
```vue
<!-- ✅ 推荐：使用计算属性 -->
<script setup lang="ts">
const list = ref([1, 2, 3, 4, 5])
const evenList = computed(() => list.value.filter(item => item % 2 === 0))
</script>

<!-- ❌ 不推荐：在模板中使用方法 -->
<template>
  <div v-for="item in list.filter(item => item % 2 === 0)" :key="item">
    {{ item }}
  </div>
</template>
```

#### 组件懒加载
```typescript
// ✅ 推荐：使用路由懒加载
const routes = [
  {
    path: '/projects',
    component: () => import('@/views/ProjectList.vue')
  }
]

// ❌ 不推荐：直接导入组件
import ProjectList from '@/views/ProjectList.vue'
const routes = [
  {
    path: '/projects',
    component: ProjectList
  }
]
```

## 代码审查

### 审查清单

- [ ] 命名是否符合规范
- [ ] 类型定义是否完整
- [ ] 是否有未使用的变量
- [ ] 是否有重复代码
- [ ] 是否有性能问题
- [ ] 错误处理是否完善
- [ ] 是否有安全隐患
- [ ] 注释是否清晰
- [ ] 测试是否充分
- [ ] 代码风格是否统一

### 审查工具

#### ESLint
```bash
# 检查代码
npm run lint

# 自动修复
npm run lint -- --fix
```

#### Prettier
```bash
# 格式化代码
npm run format

# 检查格式
npm run format:check
```

#### TypeScript
```bash
# 类型检查
npm run type-check
```

## 常见问题

### Q1: 如何处理循环依赖？
**A:**
1. 重构代码，提取公共模块
2. 使用依赖注入
3. 重新设计模块结构

### Q2: 如何优化首屏加载？
**A:**
1. 使用路由懒加载
2. 组件按需加载
3. 资源压缩和CDN
4. 预加载关键资源

### Q3: 如何减少包体积？
**A:**
1. Tree Shaking
2. 代码分割
3. 按需引入组件
4. 移除未使用的依赖

### Q4: 如何提升开发体验？
**A:**
1. 使用TypeScript
2. 配置ESLint和Prettier
3. 使用Git Hooks
4. 添加代码片段

## 更新日志

### v1.0.0 (2023-09-15)
- 初始化代码规范文档
- 添加命名规范
- 添加代码风格
- 添加组件规范
- 添加TypeScript规范
- 添加最佳实践
- 添加代码审查清单
