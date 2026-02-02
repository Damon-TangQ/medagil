<template>
  <div class="simple-test">
    <h1>简单测试页面</h1>
    <p>如果你能看到这个页面，说明Vue应用正常运行</p>
    <button @click="handleClick">点击测试</button>
    <p v-if="clicked">按钮已被点击！</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const clicked = ref(false)

const handleClick = () => {
  clicked.value = true
  console.log('按钮被点击了')
}
</script>

<style scoped>
.simple-test {
  padding: 40px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
