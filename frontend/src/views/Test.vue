<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明Vue应用正常运行</p>
    <el-button type="primary" @click="handleClick">点击测试</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const handleClick = () => {
  ElMessage.success('按钮点击成功！')
}
</script>

<style scoped>
.test-page {
  padding: 40px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 30px;
}
</style>
