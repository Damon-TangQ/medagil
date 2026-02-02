<template>
  <form class="accessible-form" @submit.prevent="handleSubmit" novalidate>
    <!-- 跳转链接 -->
    <a href="#main-content" class="skip-link">跳转到主内容</a>

    <!-- 表单标题 -->
    <h2 class="form-title">{{ title }}</h2>
    <p v-if="description" class="form-description">{{ description }}</p>

    <!-- 表单字段 -->
    <div v-for="field in fields" :key="field.name" class="form-field">
      <!-- 标签 -->
      <label
        :for="field.id"
        class="form-label"
        :class="{ required: field.required }"
      >
        {{ field.label }}
        <span v-if="field.required" class="required-mark">*</span>
      </label>

      <!-- 输入框 -->
      <template v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'">
        <input
          :id="field.id"
          :type="field.type"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :aria-invalid="errors[field.name] ? 'true' : 'false'"
          :aria-describedby="field.description ? `${field.id}-description` : undefined"
          :aria-errormessage="errors[field.name] ? `${field.id}-error` : undefined"
          class="form-input"
          @blur="handleBlur(field.name)"
          @focus="handleFocus(field.name)"
        />
      </template>

      <!-- 文本域 -->
      <template v-else-if="field.type === 'textarea'">
        <textarea
          :id="field.id"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :rows="field.rows || 4"
          :aria-invalid="errors[field.name] ? 'true' : 'false'"
          :aria-describedby="field.description ? `${field.id}-description` : undefined"
          :aria-errormessage="errors[field.name] ? `${field.id}-error` : undefined"
          class="form-input"
          @blur="handleBlur(field.name)"
          @focus="handleFocus(field.name)"
        />
      </template>

      <!-- 选择框 -->
      <template v-else-if="field.type === 'select'">
        <select
          :id="field.id"
          v-model="formData[field.name]"
          :required="field.required"
          :disabled="field.disabled"
          :aria-invalid="errors[field.name] ? 'true' : 'false'"
          :aria-describedby="field.description ? `${field.id}-description` : undefined"
          :aria-errormessage="errors[field.name] ? `${field.id}-error` : undefined"
          class="form-input"
          @blur="handleBlur(field.name)"
          @focus="handleFocus(field.name)"
        >
          <option value="">{{ field.placeholder || '请选择' }}</option>
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </template>

      <!-- 复选框 -->
      <template v-else-if="field.type === 'checkbox'">
        <div class="checkbox-group">
          <label
            v-for="option in field.options"
            :key="option.value"
            class="checkbox-label"
          >
            <input
              type="checkbox"
              :id="`${field.id}-${option.value}`"
              v-model="formData[field.name]"
              :value="option.value"
              :required="field.required"
              :disabled="field.disabled"
              :aria-invalid="errors[field.name] ? 'true' : 'false'"
              :aria-describedby="field.description ? `${field.id}-description` : undefined"
              :aria-errormessage="errors[field.name] ? `${field.id}-error` : undefined"
              class="checkbox-input"
              @blur="handleBlur(field.name)"
              @focus="handleFocus(field.name)"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </template>

      <!-- 单选框 -->
      <template v-else-if="field.type === 'radio'">
        <div class="radio-group">
          <label
            v-for="option in field.options"
            :key="option.value"
            class="radio-label"
          >
            <input
              type="radio"
              :id="`${field.id}-${option.value}`"
              v-model="formData[field.name]"
              :value="option.value"
              :name="field.name"
              :required="field.required"
              :disabled="field.disabled"
              :aria-invalid="errors[field.name] ? 'true' : 'false'"
              :aria-describedby="field.description ? `${field.id}-description` : undefined"
              :aria-errormessage="errors[field.name] ? `${field.id}-error` : undefined"
              class="radio-input"
              @blur="handleBlur(field.name)"
              @focus="handleFocus(field.name)"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </template>

      <!-- 字段描述 -->
      <p
        v-if="field.description"
        :id="`${field.id}-description`"
        class="field-description"
      >
        {{ field.description }}
      </p>

      <!-- 错误消息 -->
      <p
        v-if="errors[field.name]"
        :id="`${field.id}-error`"
        class="field-error"
        role="alert"
      >
        {{ errors[field.name] }}
      </p>
    </div>

    <!-- 表单操作 -->
    <div class="form-actions">
      <button
        type="submit"
        class="form-button primary"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        <span v-if="isSubmitting">提交中...</span>
        <span v-else>提交</span>
      </button>
      <button
        type="button"
        class="form-button secondary"
        @click="handleReset"
        :disabled="isSubmitting"
      >
        重置
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface FormField {
  name: string
  id: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  options?: Array<{ value: string; label: string }>
}

interface Props {
  title: string
  description?: string
  fields: FormField[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: Record<string, any>): void
  (e: 'reset'): void
}>()

// 表单数据
const formData = reactive<Record<string, any>>({})

// 表单错误
const errors = reactive<Record<string, string>>({})

// 提交状态
const isSubmitting = ref(false)

// 初始化表单数据
props.fields.forEach(field => {
  if (field.type === 'checkbox') {
    formData[field.name] = []
  } else {
    formData[field.name] = ''
  }
})

// 验证字段
const validateField = (fieldName: string) => {
  const field = props.fields.find(f => f.name === fieldName)
  if (!field) return

  const value = formData[fieldName]
  errors[fieldName] = ''

  if (field.required && !value) {
    errors[fieldName] = `${field.label}不能为空`
    return false
  }

  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors[fieldName] = '请输入有效的邮箱地址'
      return false
    }
  }

  return true
}

// 处理失焦
const handleBlur = (fieldName: string) => {
  validateField(fieldName)
}

// 处理聚焦
const handleFocus = (fieldName: string) => {
  // 可以在这里添加聚焦时的逻辑
}

// 处理提交
const handleSubmit = async () => {
  // 验证所有字段
  let isValid = true
  props.fields.forEach(field => {
    if (!validateField(field.name)) {
      isValid = false
    }
  })

  if (!isValid) return

  isSubmitting.value = true
  try {
    emit('submit', { ...formData })
  } finally {
    isSubmitting.value = false
  }
}

// 处理重置
const handleReset = () => {
  props.fields.forEach(field => {
    if (field.type === 'checkbox') {
      formData[field.name] = []
    } else {
      formData[field.name] = ''
    }
    errors[field.name] = ''
  })
  emit('reset')
}
</script>

<style scoped lang="scss">
.accessible-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  // 跳转链接
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #409eff;
    color: #fff;
    padding: 8px 16px;
    z-index: 100;
    transition: top 0.3s;
    text-decoration: none;

    &:focus {
      top: 0;
    }
  }

  // 表单标题
  .form-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px;
  }

  // 表单描述
  .form-description {
    font-size: 14px;
    color: #606266;
    margin: 0 0 24px;
    line-height: 1.6;
  }

  // 表单字段
  .form-field {
    margin-bottom: 24px;

    // 标签
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 8px;

      &.required {
        .required-mark {
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    // 输入框
    .form-input {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      color: #303133;
      background-color: #fff;
      border: 2px solid #dcdfe6;
      border-radius: 4px;
      transition: all 0.3s;

      &:focus {
        outline: none;
        border-color: #409eff;
        box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
      }

      &:disabled {
        background-color: #f5f7fa;
        color: #909399;
        cursor: not-allowed;
      }

      &[aria-invalid="true"] {
        border-color: #f56c6c;
      }

      &::placeholder {
        color: #c0c4cc;
      }
    }

    // 复选框组
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        .checkbox-input {
          width: 16px;
          height: 16px;
          cursor: pointer;

          &:focus {
            outline: 2px solid #409eff;
            outline-offset: 2px;
          }
        }
      }
    }

    // 单选框组
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .radio-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        .radio-input {
          width: 16px;
          height: 16px;
          cursor: pointer;

          &:focus {
            outline: 2px solid #409eff;
            outline-offset: 2px;
          }
        }
      }
    }

    // 字段描述
    .field-description {
      font-size: 12px;
      color: #909399;
      margin: 4px 0 0;
    }

    // 错误消息
    .field-error {
      font-size: 12px;
      color: #f56c6c;
      margin: 4px 0 0;
    }
  }

  // 表单操作
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;

    .form-button {
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      border: none;

      &:focus {
        outline: 2px solid #409eff;
        outline-offset: 2px;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.primary {
        background-color: #409eff;
        color: #fff;

        &:hover:not(:disabled) {
          background-color: #66b1ff;
        }

        &:active:not(:disabled) {
          transform: scale(0.95);
        }
      }

      &.secondary {
        background-color: #f5f7fa;
        color: #606266;

        &:hover:not(:disabled) {
          background-color: #ecf5ff;
        }

        &:active:not(:disabled) {
          transform: scale(0.95);
        }
      }
    }
  }
}
</style>
