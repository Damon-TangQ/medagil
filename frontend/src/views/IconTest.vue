<template>
  <div class="icon-test">
    <h1>图标测试页面</h1>
    <div class="icon-grid">
      <div class="icon-item" v-for="icon in icons" :key="icon.name">
        <el-icon :size="32">
          <component :is="icon.component" />
        </el-icon>
        <p>{{ icon.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const icons = ref(Object.keys(ElementPlusIcons).map(name => ({
  name,
  component: ElementPlusIcons[name as keyof typeof ElementPlusIcons]
})))
</script>

<style scoped>
.icon-test {
  padding: 40px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.icon-item p {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
