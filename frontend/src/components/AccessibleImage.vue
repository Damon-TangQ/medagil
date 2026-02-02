<template>
  <div class="accessible-image" :class="{ loading, error }">
    <!-- 加载状态 -->
    <div v-if="loading" class="image-skeleton" :style="skeletonStyle">
      <div class="loading-spinner">
        <svg class="circular" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#409eff"
            stroke-width="4"
          />
        </svg>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="image-error" :style="errorStyle">
      <el-icon :size="32"><PictureFilled /></el-icon>
      <p class="error-text">图片加载失败</p>
      <span class="screen-reader-only">{{ alt }}</span>
    </div>

    <!-- 正常状态 -->
    <img
      v-else
      :src="src"
      :alt="alt"
      :title="title"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
      tabindex="0"
      @keydown="handleKeydown"
    />

    <!-- 屏幕阅读器文本 -->
    <span class="screen-reader-only" v-if="description">{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PictureFilled } from '@element-plus/icons-vue'

interface Props {
  src: string
  alt: string
  title?: string
  description?: string
  width?: string
  height?: string
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  width: '100%',
  height: 'auto',
  lazy: true
})

const emit = defineEmits<{
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}>()

// 加载状态
const loading = ref(true)
const error = ref(false)

// 骨架屏样式
const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.height
}))

// 错误样式
const errorStyle = computed(() => ({
  width: props.width,
  height: props.height
}))

// 处理图片加载
const handleLoad = (event: Event) => {
  loading.value = false
  error.value = false
  emit('load', event)
}

// 处理图片错误
const handleError = (event: Event) => {
  loading.value = false
  error.value = true
  emit('error', event)
}

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // 可以在这里添加点击处理逻辑
  }
}

// 预加载图片
onMounted(() => {
  if (!props.lazy) {
    const img = new Image()
    img.src = props.src
    img.onload = () => {
      loading.value = false
    }
    img.onerror = () => {
      loading.value = false
      error.value = true
    }
  }
})
</script>

<style scoped lang="scss">
.accessible-image {
  position: relative;
  display: inline-block;

  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 4px;

    &:focus {
      outline: 2px solid #409eff;
      outline-offset: 2px;
    }
  }

  // 加载状态
  .image-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-spinner {
      width: 40px;
      height: 40px;

      .circular {
        display: block;
        width: 100%;
        height: 100%;

        .path {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: 0;
          stroke-linecap: round;
          animation: rotate 1.5s ease-in-out infinite;
        }
      }
    }
  }

  // 错误状态
  .image-error {
    background-color: #f5f7fa;
    border: 2px dashed #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #909399;

    .error-text {
      font-size: 14px;
      margin: 0;
    }
  }

  // 屏幕阅读器专用文本
  .screen-reader-only {
    @extend .sr-only;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    transform: rotate(360deg);
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}

// 屏幕阅读器专用类
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
