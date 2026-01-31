# 代码质量优化指南

## 概述

本文档详细说明了前端项目的代码质量优化策略，包括代码规范、性能优化、最佳实践等内容。

## 目录

- [代码规范](#代码规范)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)
- [代码审查](#代码审查)
- [工具配置](#工具配置)

## 代码规范

### 1. 命名规范

#### 文件命名
```
组件：PascalCase
  - ProjectForm.vue
  - UserList.vue

工具：camelCase
  - request.ts
  - errorHandler.ts

类型：PascalCase
  - User.ts
  - Project.ts

常量：UPPER_SNAKE_CASE
  - API_CONFIG
  - STORAGE_KEYS
```

#### 变量命名
```typescript
// ✅ 推荐
const userName = 'John'
const getUserInfo = () => {}
const MAX_COUNT = 100

// ❌ 不推荐
const user_name = 'John'
const get_user_info = () => {}
const max_count = 100
```

#### 函数命名
```typescript
// ✅ 推荐：使用动词开头
const getUserInfo = () => {}
const handleSubmit = () => {}
const isLoading = ref(false)

// ❌ 不推荐
const userInfo = () => {}
const handle = () => {}
const loading = ref(false)
```

### 2. 类型定义

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

### 3. 组件规范

#### 组件定义
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

## 性能优化

### 1. 组件优化

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

#### 组件缓存
```vue
<!-- ✅ 推荐：使用keep-alive缓存组件 -->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<!-- ❌ 不推荐：不使用缓存 -->
<template>
  <router-view />
</template>
```

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

### 2. 列表优化

#### 虚拟滚动
```vue
<!-- ✅ 推荐：使用虚拟滚动处理长列表 -->
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :height="500"
  />
</template>

<!-- ❌ 不推荐：直接渲染长列表 -->
<template>
  <el-table :data="data">
    <!-- 大量数据会导致性能问题 -->
  </el-table>
</template>
```

#### 唯一key
```vue
<!-- ✅ 推荐：使用稳定的唯一key -->
<template>
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
</template>

<!-- ❌ 不推荐：使用索引作为key -->
<template>
  <div v-for="(item, index) in list" :key="index">
    {{ item.name }}
  </div>
</template>
```

### 3. 请求优化

#### 请求取消
```typescript
// ✅ 推荐：组件卸载时取消请求
onUnmounted(() => {
  requestCancel.cancelAll()
})

// ❌ 不推荐：不取消请求
// 可能导致内存泄漏
```

#### 请求节流
```typescript
// ✅ 推荐：使用节流避免重复请求
const response = await requestThrottle.request(
  { url: '/projects' },
  () => get('/projects')
)

// ❌ 不推荐：不使用节流
// 可能导致重复请求
```

#### 请求重试
```typescript
// ✅ 推荐：使用重试机制
const response = await requestRetry.request(
  () => get('/projects'),
  { times: 3, delay: 1000 }
)

// ❌ 不推荐：不使用重试
// 网络波动时用户体验差
```

### 4. 资源优化

#### 图片优化
```vue
<!-- ✅ 推荐：使用懒加载 -->
<template>
  <el-image
    :src="imageUrl"
    :lazy="true"
    fit="cover"
  />
</template>

<!-- ❌ 不推荐：直接加载所有图片 -->
<template>
  <img :src="imageUrl" />
</template>
```

#### 资源压缩
```typescript
// ✅ 推荐：使用压缩后的资源
import compressedImage from '@/assets/image-compressed.jpg'

// ❌ 不推荐：使用原始资源
import originalImage from '@/assets/image.jpg'
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

### 2. 状态管理

#### 使用Pinia
```typescript
// ✅ 推荐：使用Pinia管理状态
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref('')

  const login = async (credentials: LoginData) => {
    const response = await loginApi(credentials)
    user.value = response.data.user
    token.value = response.data.token
  }

  return { user, token, login }
})

// ❌ 不推荐：使用事件总线或全局状态
// 难以追踪和维护
```

### 3. 错误处理

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
} catch (error) {
  if (error.response?.status === 401) {
    // 处理401
  } else if (error.response?.status === 403) {
    // 处理403
  }
  // ...
}
```

### 4. 类型安全

#### 使用类型定义
```typescript
// ✅ 推荐：使用类型定义
const project: Project = response.data

// ❌ 不推荐：使用any
const project: any = response.data
```

#### 类型守卫
```typescript
// ✅ 推荐：使用类型守卫
function isProject(value: unknown): value is Project {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}

if (isProject(data)) {
  // data是Project类型
}

// ❌ 不推荐：类型断言
const project = data as Project
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

## 工具配置

### ESLint

配置文件：`.eslintrc.js`

主要规则：
- TypeScript类型检查
- Vue组件规范
- 代码风格检查
- 最佳实践建议

### Prettier

配置文件：`.prettierrc.js`

主要规则：
- 代码格式化
- 统一风格
- 自动修复

### TypeScript

配置文件：`tsconfig.json`

主要规则：
- 严格模式
- 类型检查
- 路径别名

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
- 初始化代码质量指南
- 添加代码规范
- 添加性能优化建议
- 添加最佳实践
- 添加代码审查清单
- 完善工具配置
