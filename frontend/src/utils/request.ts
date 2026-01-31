/**
 * Axios请求封装
 * 统一处理请求和响应
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { storage } from '@/shared'

// ==================== 类型定义 ====================
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandler?: boolean
  showMessage?: boolean
  showLoading?: boolean
}

export interface ResponseData<T = any> {
  success: boolean
  message: string
  data?: T
  code?: number
}

// ==================== 创建axios实例 ====================
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// ==================== 请求拦截器 ====================
service.interceptors.request.use(
  (config: RequestConfig) => {
    // 显示加载状态
    if (config.showLoading) {
      // TODO: 添加全局加载状态
    }

    // 添加认证Token
    if (!config.skipAuth) {
      const token = storage.get<string>('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // 添加请求时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// ==================== 响应拦截器 ====================
service.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const { data, config } = response

    // 关闭加载状态
    if ((config as RequestConfig).showLoading) {
      // TODO: 关闭全局加载状态
    }

    // 业务成功
    if (data.success) {
      return data
    }

    // 业务失败
    if ((config as RequestConfig).skipErrorHandler) {
      return Promise.reject(data)
    }

    // 显示错误消息
    if ((config as RequestConfig).showMessage !== false) {
      ElMessage.error(data.message || '请求失败')
    }

    return Promise.reject(data)
  },
  async (error: AxiosError<ResponseData>) => {
    const { config, response } = error

    // 关闭加载状态
    if ((config as RequestConfig)?.showLoading) {
      // TODO: 关闭全局加载状态
    }

    // 跳过错误处理
    if ((config as RequestConfig)?.skipErrorHandler) {
      return Promise.reject(error)
    }

    // 处理HTTP错误状态码
    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          handleUnauthorized()
          break
        case 403:
          ElMessage.error(data?.message || '没有权限访问')
          break
        case 404:
          ElMessage.error(data?.message || '请求的资源不存在')
          break
        case 500:
          ElMessage.error(data?.message || '服务器错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }

      return Promise.reject(error)
    }

    // 处理网络错误
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else if (error.message.includes('Network Error')) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求失败，请稍后重试')
    }

    return Promise.reject(error)
  }
)

// ==================== 错误处理函数 ====================

/**
 * 处理401未授权错误
 */
const handleUnauthorized = async () => {
  try {
    await ElMessageBox.confirm(
      '登录状态已过期，您可以继续留在该页面，或者重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 清除认证信息
    storage.remove('token')
    storage.remove('user')

    // 跳转到登录页
    router.push({
      path: '/login',
      query: { redirect: router.currentRoute.value.fullPath }
    })
  } catch {
    // 用户取消
  }
}

// ==================== 请求方法封装 ====================

/**
 * GET请求
 */
export const get = <T = any>(
  url: string,
  params?: any,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return service.get(url, { ...config, params })
}

/**
 * POST请求
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return service.post(url, data, config)
}

/**
 * PUT请求
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return service.put(url, data, config)
}

/**
 * DELETE请求
 */
export const del = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return service.delete(url, config)
}

/**
 * 文件上传
 */
export const upload = <T = any>(
  url: string,
  file: File,
  onProgress?: (progressEvent: any) => void,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  const formData = new FormData()
  formData.append('file', file)

  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress
  })
}

/**
 * 文件下载
 */
export const download = (
  url: string,
  filename: string,
  config?: RequestConfig
): Promise<void> => {
  return service.get(url, {
    ...config,
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  })
}

// ==================== 导出 ====================
export default service
export * from './request'
