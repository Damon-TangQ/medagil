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
import { ref, computed } from 'vue'
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
  background-color: #409EFF;
  color: white;
  line-height: 60px;
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  color: white;
}

.el-menu-demo {
  border-bottom: none;
  background-color: transparent;
}

.el-menu-demo .el-menu-item {
  color: white;
}

.el-menu-demo .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.el-main {
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  text-align: center;
  max-width: 800px;
}

.content h2 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #303133;
}

.content p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}

.el-footer {
  background-color: #303133;
  color: white;
  text-align: center;
  line-height: 60px;
}

.footer-content p {
  margin: 0;
}
</style>
