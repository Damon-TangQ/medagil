<template>
  <div class="create-project-container">
    <el-page-header @back="handleBack" class="page-header">
      <template #content>
        <div class="header-content">
          <h2>创建新项目</h2>
        </div>
      </template>
    </el-page-header>

    <ProjectForm
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProjectForm from '@/components/ProjectForm.vue'

const router = useRouter()

// 返回
const handleBack = () => {
  router.back()
}

// 提交表单
const handleSubmit = async (formData: any) => {
  try {
    // TODO: 调用创建项目API
    // await axios.post('/api/projects', formData)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    ElMessage.success('项目创建成功')
    router.push('/projects')
  } catch (error) {
    ElMessage.error('项目创建失败')
  }
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-project-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.header-content h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

@media (max-width: 768px) {
  .create-project-container {
    padding: 16px;
  }
}
</style>
