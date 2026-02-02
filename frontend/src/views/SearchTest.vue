<template>
  <div class="search-test">
    <h1>搜索测试页面</h1>
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="输入搜索内容..."
        size="large"
        class="search-input"
      >
        <template #suffix>
          <el-button
            type="primary"
            :icon="Search"
            @click="handleSearch"
            class="search-button"
          />
        </template>
      </el-input>
    </div>
    <p>搜索内容: {{ searchQuery }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')

const handleSearch = () => {
  ElMessage.success(`搜索: ${searchQuery.value}`)
}
</script>

<style scoped>
.search-test {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

.search-container {
  width: 100%;
}

.search-input {
  width: 100%;
}

.search-button {
  padding: 12px 24px;
}

p {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>
