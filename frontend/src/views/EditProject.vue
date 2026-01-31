<template>
  <div class="edit-project-container">
    <el-page-header @back="handleBack" class="page-header">
      <template #content>
        <div class="header-content">
          <h2>编辑项目</h2>
        </div>
      </template>
    </el-page-header>

    <div v-loading="loading" class="form-wrapper">
      <ProjectForm
        v-if="projectData"
        mode="edit"
        :initial-data="projectData"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProjectForm from '@/components/ProjectForm.vue'
import { PROJECT_STATUS } from '@/shared/constants'

const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(false)
const projectData = ref<any>(null)

// 获取项目详情
const fetchProjectDetail = async () => {
  loading.value = true
  try {
    // TODO: 调用实际API获取项目详情
    // const response = await axios.get(`/api/projects/${route.params.id}`)
    // projectData.value = response.data.data

    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    projectData.value = {
      id: route.params.id,
      name: 'AI智能对话助手',
      categoryId: '1',
      tags: 'AI,对话,智能助手',
      status: PROJECT_STATUS.PUBLISHED,
      summary: '基于大语言模型的智能对话助手',
      description: '<p>基于大语言模型的智能对话助手，能够回答各种问题，提供专业建议。</p>',
      coverImage: '/images/project_cover_1.jpg',
      visibility: 'public',
      allowComments: true,
      members: ['user_001', 'user_002']
    }
  } catch (error) {
    ElMessage.error('获取项目信息失败')
    router.back()
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 提交表单
const handleSubmit = async (formData: any) => {
  try {
    // TODO: 调用更新项目API
    // await axios.put(`/api/projects/${route.params.id}`, formData)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    ElMessage.success('项目更新成功')
    router.push(`/projects/${route.params.id}`)
  } catch (error) {
    ElMessage.error('项目更新失败')
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchProjectDetail()
})
</script>

<style scoped>
.edit-project-container {
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

.form-wrapper {
  min-height: 400px;
}

@media (max-width: 768px) {
  .edit-project-container {
    padding: 16px;
  }
}
</style>
