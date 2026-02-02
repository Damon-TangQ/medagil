<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>Medagil AI平台</h1>
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            class="el-menu-demo"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/about">关于我们</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <div class="content">
          <h2>欢迎使用Medagil AI平台</h2>
          <p>这是一个基于Vue3 + TypeScript + Element Plus构建的现代化AI平台</p>
          <el-button type="primary" @click="getStarted">开始使用</el-button>
        </div>
      </el-main>
      <el-footer>
        <div class="footer-content">
          <p>&copy; 2023 Medagil AI平台. All rights reserved.</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = computed(() => router.currentRoute.value.path)

const handleSelect = (key: string) => {
  router.push(key)
}

const getStarted = () => {
  router.push('/about')
}
</script>

<style scoped>
.home {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: var(--el-color-primary);
  color: white;
  line-height: 64px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

.el-menu-demo {
  border-bottom: none;
  background-color: transparent;
}

.el-menu-demo .el-menu-item {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  border-radius: 8px;
  margin: 0 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-demo .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.el-menu-demo .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.el-main {
  background-color: var(--el-bg-color-page);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 24px;
}

.content {
  text-align: center;
  max-width: 800px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
  line-height: 1.25;
}

.content p {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin-bottom: 32px;
  line-height: 1.75;
}

.el-footer {
  background-color: var(--el-text-color-primary);
  color: white;
  text-align: center;
  line-height: 64px;
}

.footer-content p {
  margin: 0;
  font-size: 14px;
}
</style>
</style>
