<template>
  <div class="loading-wrapper" :class="{ fullscreen }">
    <div class="loading-content">
      <!-- 旋转加载图标 -->
      <div v-if="type === 'spinner'" class="loading-spinner">
        <svg class="circular" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            :stroke="color"
            stroke-width="4"
          />
        </svg>
      </div>

      <!-- 点状加载 -->
      <div v-else-if="type === 'dots'" class="loading-dots">
        <div class="dot" :style="{ backgroundColor: color }"></div>
        <div class="dot" :style="{ backgroundColor: color }"></div>
        <div class="dot" :style="{ backgroundColor: color }"></div>
      </div>

      <!-- 进度条加载 -->
      <div v-else-if="type === 'progress'" class="loading-progress">
        <div class="progress-bar" :style="{ width: progress + '%', backgroundColor: color }"></div>
      </div>

      <!-- 文字 -->
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'spinner' | 'dots' | 'progress'
  color?: string
  text?: string
  progress?: number
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'spinner',
  color: '#409eff',
  text: '',
  progress: 0,
  fullscreen: false
})
</script>

<style scoped lang="scss">
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  // 旋转加载图标
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

  // 点状加载
  .loading-dots {
    display: flex;
    gap: 8px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }

  // 进度条加载
  .loading-progress {
    width: 200px;
    height: 4px;
    background-color: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;

    .progress-bar {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 2px;
    }
  }

  // 加载文字
  .loading-text {
    font-size: 14px;
    color: #606266;
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

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
