<template>
  <transition
    :name="transitionName"
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @after-enter="handleAfterEnter"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
    @after-leave="handleAfterLeave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  name?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  name: 'fade',
  duration: 300
})

const emit = defineEmits<{
  (e: 'before-enter'): void
  (e: 'enter'): void
  (e: 'after-enter'): void
  (e: 'before-leave'): void
  (e: 'leave'): void
  (e: 'after-leave'): void
}>()

const transitionName = ref(props.name)

const handleBeforeEnter = () => {
  emit('before-enter')
}

const handleEnter = () => {
  emit('enter')
}

const handleAfterEnter = () => {
  emit('after-enter')
}

const handleBeforeLeave = () => {
  emit('before-leave')
}

const handleLeave = () => {
  emit('leave')
}

const handleAfterLeave = () => {
  emit('after-leave')
}

// 暴露方法
defineExpose({
  setTransitionName: (name: string) => {
    transitionName.value = name
  }
})
</script>

<style scoped lang="scss">
// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity v-bind('duration + "ms"') ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 向上滑动
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all v-bind('duration + "ms"') ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// 向下滑动
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all v-bind('duration + "ms"') ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// 向左滑动
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all v-bind('duration + "ms"') ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 向右滑动
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all v-bind('duration + "ms"') ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

// 缩放
.scale-enter-active,
.scale-leave-active {
  transition: all v-bind('duration + "ms"') ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
