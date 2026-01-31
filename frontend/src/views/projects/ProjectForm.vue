<template>
  <div class="project-form-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑项目' : '创建项目' }}</span>
          <el-button link @click="handleCancel">返回列表</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        v-loading="loading"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入项目名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="项目分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择项目分类" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="项目封面" prop="coverImage">
          <el-upload
            class="cover-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：800x600px，支持jpg、png格式，大小不超过2MB</div>
        </el-form-item>

        <el-form-item label="项目描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入项目描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="项目标签" prop="tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in commonTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="项目配置" prop="config">
          <el-card class="config-card">
            <template #header>
              <span>AI配置</span>
            </template>
            <el-form-item label="AI模型">
              <el-select v-model="form.config.model" placeholder="请选择AI模型">
                <el-option label="GPT-4" value="gpt-4" />
                <el-option label="GPT-3.5" value="gpt-3.5" />
                <el-option label="Claude" value="claude" />
              </el-select>
            </el-form-item>
            <el-form-item label="温度">
              <el-slider v-model="form.config.temperature" :min="0" :max="2" :step="0.1" />
            </el-form-item>
            <el-form-item label="最大Token">
              <el-input-number v-model="form.config.maxTokens" :min="100" :max="4000" />
            </el-form-item>
          </el-card>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '保存修改' : '创建项目' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const authStore = useAuthStore()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 上传地址
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/upload/cover`

// 项目分类
const categories = ref([
  { id: '1', name: '数据分析' },
  { id: '2', name: '报告生成' },
  { id: '3', name: '智能对话' },
  { id: '4', name: '其他' }
])

// 常用标签
const commonTags = ref([
  '数据分析',
  '报告生成',
  '智能对话',
  '自动化',
  'AI助手',
  '效率工具',
  '商业分析',
  '市场研究'
])

// 表单数据
const form = reactive({
  name: '',
  categoryId: '',
  coverImage: '',
  description: '',
  tags: [] as string[],
  config: {
    model: 'gpt-3.5',
    temperature: 0.7,
    maxTokens: 2000
  }
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择项目分类', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入项目描述', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 加载项目详情
const loadProjectDetail = async (id: string) => {
  loading.value = true
  try {
    const result = await projectStore.getProjectById(id)
    if (result.success && result.data) {
      const project = result.data
      form.name = project.name
      form.categoryId = project.categoryId
      form.coverImage = project.coverImage || ''
      form.description = project.description || ''
      // 处理tags，确保类型安全
      form.tags = Array.isArray(project.tags) 
        ? project.tags 
        : (typeof project.tags === 'string' ? project.tags.split(',') : [])
      form.config = project.config || {
        model: 'gpt-3.5',
        temperature: 0.7,
        maxTokens: 2000
      }
    } else {
      ElMessage.error(result.message || '加载项目详情失败')
      router.push('/projects')
    }
  } catch (error) {
    console.error('加载项目详情错误:', error)
    ElMessage.error('加载项目详情失败')
    router.push('/projects')
  } finally {
    loading.value = false
  }
}

// 封面上传前验证
const beforeCoverUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isJpgOrPng = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isJpgOrPng) {
    ElMessage.error('封面图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('封面图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 封面上传成功
const handleCoverSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.success && response.data) {
    form.coverImage = response.data.url
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error(response.message || '封面上传失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const projectData = {
          ...form,
          tags: form.tags.length > 0 ? form.tags.join(',') : '',
          userId: authStore.user?.id
        }

        let result
        if (isEdit.value) {
          result = await projectStore.updateProject(route.params.id as string, projectData)
        } else {
          result = await projectStore.createProject(projectData)
        }

        if (result.success) {
          ElMessage.success(isEdit.value ? '保存成功' : '创建成功')
          router.push('/projects')
        } else {
          ElMessage.error(result.message || (isEdit.value ? '保存失败' : '创建失败'))
        }
      } catch (error) {
        console.error('提交错误:', error)
        ElMessage.error(isEdit.value ? '保存失败' : '创建失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 取消操作
const handleCancel = () => {
  router.push('/projects')
}

// 初始化
onMounted(() => {
  if (isEdit.value) {
    loadProjectDetail(route.params.id as string)
  }
})
</script>

<style scoped>
.project-form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cover-uploader {
  width: 100%;
}

.cover-uploader :deep(.el-upload) {
  width: 100%;
  max-width: 400px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.cover-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 200px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.config-card {
  width: 100%;
}

.config-card :deep(.el-card__header) {
  padding: 12px 20px;
  background-color: #f5f7fa;
}

.config-card :deep(.el-card__body) {
  padding: 20px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .project-form-container {
    padding: 12px;
  }

  .cover-uploader :deep(.el-upload) {
    max-width: 100%;
  }

  .cover-uploader-icon {
    width: 100%;
  }
}
</style>
