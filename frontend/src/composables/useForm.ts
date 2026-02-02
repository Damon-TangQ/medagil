/**
 * useForm 组合式函数
 * 封装表单管理逻辑
 */

import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { DeepPartial } from '@/types'

/**
 * 表单状态管理
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  rules?: FormRules
) {
  const formRef = ref<FormInstance>()
  const formData = reactive({ ...initialValues }) as DeepPartial<T>
  const loading = ref(false)

  // 重置表单
  const resetForm = (): void => {
    formRef.value?.resetFields()
    Object.assign(formData, initialValues)
  }

  // 验证表单
  const validateForm = async (): Promise<boolean> => {
    try {
      await formRef.value?.validate()
      return true
    } catch (error) {
      return false
    }
  }

  // 清除验证
  const clearValidate = (): void => {
    formRef.value?.clearValidate()
  }

  // 获取表单数据
  const getFormData = (): DeepPartial<T> => {
    return { ...formData }
  }

  // 设置表单数据
  const setFormData = (data: DeepPartial<T>): void => {
    Object.assign(formData, data)
  }

  // 设置字段值
  const setFieldValue = <K extends keyof T>(field: K, value: T[K]): void => {
    (formData as any)[field] = value
  }

  // 获取字段值
  const getFieldValue = <K extends keyof T>(field: K): T[K] => {
    return (formData as any)[field]
  }

  // 提交表单
  const submitForm = async (
    submitFn: (data: DeepPartial<T>) => Promise<void>
  ): Promise<boolean> => {
    try {
      loading.value = true
      const isValid = await validateForm()
      if (!isValid) {
        return false
      }

      await submitFn(getFormData())
      return true
    } catch (error) {
      console.error('表单提交失败:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    formRef,
    formData,
    loading,
    rules,
    resetForm,
    validateForm,
    clearValidate,
    getFormData,
    setFormData,
    setFieldValue,
    getFieldValue,
    submitForm
  }
}
