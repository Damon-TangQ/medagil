<template>
  <div class="about">
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
          <h2>关于Medagil AI平台</h2>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="feature-card">
                <template #header>
                  <div class="card-header">
                    <span>平台简介</span>
                  </div>
                </template>
                <p>Medagil AI平台是一个综合性的AI解决方案平台，致力于为企业提供全方位的AI技术支持和服务。</p>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="feature-card">
                <template #header>
                  <div class="card-header">
                    <span>技术栈</span>
                  </div>
                </template>
                <ul>
                  <li>Vue 3 + TypeScript</li>
                  <li>Element Plus</li>
                  <li>Node.js + Express</li>
                  <li>微信小程序</li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-button type="primary" @click="goBack">返回首页</el-button>
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

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.about {
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
  padding: 40px 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.content h2 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 20px;
}

.feature-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.feature-card p, .feature-card ul {
  line-height: 1.8;
  color: #606266;
}

.feature-card ul {
  padding-left: 20px;
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
