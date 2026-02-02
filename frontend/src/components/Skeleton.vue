<template>
  <div class="skeleton-wrapper" :class="{ loading: loading }">
    <slot v-if="!loading" />
    <div v-else class="skeleton-content">
      <!-- 头像骨架 -->
      <div v-if="showAvatar" class="skeleton-avatar"></div>

      <!-- 文本骨架 -->
      <div v-if="showText" class="skeleton-text-wrapper">
        <div
          v-for="i in textLines"
          :key="i"
          class="skeleton-text"
          :style="{ width: getTextWidth(i) }"
        ></div>
      </div>

      <!-- 按钮骨架 -->
      <div v-if="showButton" class="skeleton-button"></div>

      <!-- 卡片骨架 -->
      <div v-if="showCard" class="skeleton-card">
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
          <div v-for="i in 3" :key="i" class="skeleton-text"></div>
        </div>
      </div>

      <!-- 图片骨架 -->
      <div v-if="showImage" class="skeleton-image" :style="imageStyle"></div>

      <!-- 自定义骨架 -->
      <slot name="skeleton" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
  showAvatar?: boolean
  showText?: boolean
  textLines?: number
  showButton?: boolean
  showCard?: boolean
  showImage?: boolean
  imageWidth?: string
  imageHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showAvatar: false,
  showText: false,
  textLines: 3,
  showButton: false,
  showCard: false,
  showImage: false,
  imageWidth: '100%',
  imageHeight: '200px'
})

// 计算文本宽度
const getTextWidth = (index: number) => {
  const widths = ['100%', '90%', '80%', '70%', '60%']
  return widths[(index - 1) % widths.length]
}

// 计算图片样式
const imageStyle = computed(() => ({
  width: props.imageWidth,
  height: props.imageHeight
}))
</script>

<style scoped lang="scss">
.skeleton-wrapper {
  &.loading {
    .skeleton-content {
      display: block;
    }
  }

  &:not(.loading) {
    .skeleton-content {
      display: none;
    }
  }
}

.skeleton-content {
  .skeleton-avatar {
    @extend .skeleton;
    @extend .skeleton-avatar;
  }

  .skeleton-text-wrapper {
    .skeleton-text {
      @extend .skeleton;
      @extend .skeleton-text;
    }
  }

  .skeleton-button {
    @extend .skeleton;
    @extend .skeleton-button;
  }

  .skeleton-card {
    @extend .skeleton-card;
  }

  .skeleton-image {
    @extend .skeleton;
    border-radius: 8px;
  }
}
</style>
