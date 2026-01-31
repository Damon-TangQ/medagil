# API使用指南

## 概述

本文档详细说明了前端API的使用方法，包括请求封装、错误处理、请求管理等功能的实现和使用。

## 目录结构

```
frontend/src/
├── api/
│   └── index.ts              # API接口定义
├── utils/
│   ├── request.ts            # Axios请求封装
│   ├── errorHandler.ts      # 错误处理工具
│   └── requestManager.ts    # 请求管理工具
```

## 基础使用

### 1. 导入API

```typescript
import {
  login,
  getProjectList,
  createProject,
  updateProject,
  deleteProject
} from '@/api'
```

### 2. 调用API

```typescript
// 登录
const handleLogin = async () => {
  try {
    const response = await login({
      username: 'admin',
      password: '123456'
    })

    if (response.success) {
      console.log('登录成功:', response.data)
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 获取项目列表
const fetchProjects = async () => {
  try {
    const response = await getProjectList({
      page: 1,
      pageSize: 12,
      keyword: 'AI'
    })

    if (response.success) {
      console.log('项目列表:', response.data)
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}
```

## 高级功能

### 1. 请求拦截器

#### 添加认证Token

```typescript
import { get } from '@/utils/request'

// 自动添加Token
const response = await get('/projects')
```

#### 跳过认证

```typescript
import { get } from '@/utils/request'

const response = await get('/public/data', {
  skipAuth: true
})
```

#### 显示加载状态

```typescript
import { get } from '@/utils/request'

const response = await get('/projects', {
  showLoading: true
})
```

### 2. 响应拦截器

#### 自动处理错误

```typescript
import { get } from '@/utils/request'

// 自动显示错误消息
const response = await get('/projects')
```

#### 跳过错误处理

```typescript
import { get } from '@/utils/request'

// 手动处理错误
const response = await get('/projects', {
  skipErrorHandler: true
})

if (!response.success) {
  // 自定义错误处理
  console.error(response.message)
}
```

#### 禁用错误消息

```typescript
import { get } from '@/utils/request'

const response = await get('/projects', {
  showMessage: false
})
```

### 3. 错误处理

#### 使用错误处理器

```typescript
import { errorHandler } from '@/utils/errorHandler'

try {
  // 执行可能出错的代码
} catch (error) {
  errorHandler.handle(error)
}
```

#### 处理Promise错误

```typescript
import { handlePromiseError } from '@/utils/errorHandler'

const [error, data] = await handlePromiseError(
  get('/projects')
)

if (error) {
  // 错误已自动处理
  return
}

// 使用数据
console.log(data)
```

#### 显示提示消息

```typescript
import {
  showError,
  showSuccess,
  showWarning,
  showInfo
} from '@/utils/errorHandler'

showError('操作失败')
showSuccess('操作成功')
showWarning('警告信息')
showInfo('提示信息')
```

### 4. 请求重试

```typescript
import { requestRetry } from '@/utils/requestManager'
import { get } from '@/utils/request'

// 带重试的请求
const response = await requestRetry.request(
  () => get('/projects'),
  {
    times: 3,           // 重试次数
    delay: 1000,        // 重试延迟(毫秒)
    retryCondition: (error) => {
      // 自定义重试条件
      return error.response?.status === 503
    }
  }
)
```

### 5. 请求取消

```typescript
import { requestCancel } from '@/utils/requestManager'
import { get } from '@/utils/request'

// 添加取消令牌
const cancelToken = requestCancel.add({
  url: '/projects',
  method: 'GET'
})

// 执行请求
const response = await get('/projects', {
  cancelToken
})

// 取消请求
cancelToken.cancel('用户取消操作')

// 取消所有请求
requestCancel.cancelAll()
```

### 6. 请求节流

```typescript
import { requestThrottle } from '@/utils/requestManager'
import { get } from '@/utils/request'

// 节流请求，避免重复请求
const response = await requestThrottle.request(
  {
    url: '/projects',
    method: 'GET'
  },
  () => get('/projects')
)
```

### 7. 请求队列

```typescript
import { requestQueue } from '@/utils/requestManager'
import { get } from '@/utils/request'

// 添加请求到队列，控制并发数
const response = await requestQueue.add(
  () => get('/projects')
)
```

## 文件上传

### 上传单个文件

```typescript
import { uploadProjectCover } from '@/api'

const handleUpload = async (file: File) => {
  try {
    const response = await uploadProjectCover(
      file,
      (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        console.log(`上传进度: ${percent}%`)
      }
    )

    if (response.success) {
      console.log('上传成功:', response.data.url)
    }
  } catch (error) {
    console.error('上传失败:', error)
  }
}
```

### 上传多个文件

```typescript
import { uploadProjectCover } from '@/api'

const handleMultipleUpload = async (files: File[]) => {
  const uploadPromises = files.map(file => 
    uploadProjectCover(file)
  )

  try {
    const responses = await Promise.all(uploadPromises)
    console.log('所有文件上传成功')
  } catch (error) {
    console.error('部分文件上传失败:', error)
  }
}
```

## 文件下载

```typescript
import { downloadFile } from '@/api'

const handleDownload = async () => {
  try {
    await downloadFile(
      '/files/report.pdf',
      '年度报告.pdf'
    )
    console.log('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
  }
}
```

## 完整示例

### 项目列表页面

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProjectList, deleteProject } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const projects = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const response = await getProjectList({
      page: currentPage.value,
      pageSize: pageSize.value
    })

    if (response.success) {
      projects.value = response.data.projects
    }
  } catch (error) {
    // 错误已自动处理
  } finally {
    loading.value = false
  }
}

// 删除项目
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个项目吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await deleteProject(id)

    if (response.success) {
      ElMessage.success('删除成功')
      fetchProjects()
    }
  } catch (error) {
    if (error !== 'cancel') {
      // 错误已自动处理
    }
  }
}

onMounted(() => {
  fetchProjects()
})
</script>
```

### 创建项目表单

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { createProject } from '@/api'
import { ElMessage } from 'element-plus'
import type { CreateProjectData } from '@/shared'

const formRef = ref()
const formData = ref<CreateProjectData>({
  userId: '',
  name: '',
  description: '',
  categoryId: '',
  tags: ''
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    const response = await createProject(formData.value)

    if (response.success) {
      ElMessage.success('创建成功')
      // 跳转到项目列表
    }
  } catch (error) {
    // 错误已自动处理
  }
}
</script>
```

## 最佳实践

### 1. 错误处理

```typescript
// ✅ 推荐：使用自动错误处理
const response = await get('/projects')

// ❌ 不推荐：手动处理所有错误
try {
  const response = await get('/projects')
  if (!response.success) {
    ElMessage.error(response.message)
  }
} catch (error) {
  ElMessage.error('请求失败')
}
```

### 2. 请求取消

```typescript
// ✅ 推荐：在组件卸载时取消请求
onUnmounted(() => {
  requestCancel.cancelAll()
})

// ❌ 不推荐：不取消请求
// 可能导致内存泄漏和状态错误
```

### 3. 加载状态

```typescript
// ✅ 推荐：使用统一的加载状态
const response = await get('/projects', {
  showLoading: true
})

// ❌ 不推荐：手动管理加载状态
loading.value = true
const response = await get('/projects')
loading.value = false
```

### 4. 类型安全

```typescript
// ✅ 推荐：使用类型定义
import type { Project } from '@/shared'
const project: Project = response.data

// ❌ 不推荐：使用any
const project: any = response.data
```

## 常见问题

### Q1: 如何处理401错误？
**A:** 401错误会自动触发重新登录流程，无需手动处理。

### Q2: 如何禁用某个请求的错误提示？
**A:** 使用 `showMessage: false` 选项：
```typescript
const response = await get('/projects', {
  showMessage: false
})
```

### Q3: 如何实现请求重试？
**A:** 使用 `requestRetry` 工具：
```typescript
const response = await requestRetry.request(
  () => get('/projects'),
  { times: 3, delay: 1000 }
)
```

### Q4: 如何取消正在进行的请求？
**A:** 使用 `requestCancel` 工具：
```typescript
const cancelToken = requestCancel.add({
  url: '/projects',
  method: 'GET'
})

// 取消请求
cancelToken.cancel('用户取消')
```

