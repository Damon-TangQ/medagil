<template>
  <div id="app">
    <MainLayout v-if="!isAuthPage" />
    <div v-else class="auth-page-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const route = useRoute()

// 判断是否是认证页面（登录或注册）
const isAuthPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})
</script>

<style>
/* 全局样式已在 styles/index.scss 中定义 */

.auth-page-wrapper {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>
