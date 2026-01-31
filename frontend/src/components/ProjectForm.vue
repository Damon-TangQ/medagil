<template>
  <div class="project-form-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      class="project-form"
    >
      <!-- 项目基本信息 -->
      <el-card class="form-section">
        <template #header>
          <div class="card-header">
            <span class="section-title">基本信息</span>
          </div>
        </template>

        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入项目名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="项目封面" prop="coverImage">
          <el-upload
            class="cover-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="formData.coverImage" :src="formData.coverImage" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：800x450px，支持jpg、png格式</div>
        </el-form-item>

        <el-form-item label="项目分类" prop="category">
          <el-cascader
            v-model="formData.category"
            :options="categoryOptions"
            :props="categoryProps"
            placeholder="请选择项目分类"
            clearable
            class="full-width"
          />
        </el-form-item>

        <el-form-item label="项目标签" prop="tags">
          <el-select
            v-model="formData.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入项目标签"
            class="full-width"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag.value"
              :label="tag.label"
              :value="tag.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="项目状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <!-- 项目描述 -->
      <el-card class="form-section">
        <template #header>
          <div class="card-header">
            <span class="section-title">项目描述</span>
          </div>
        </template>

        <el-form-item label="项目简介" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入项目简介（将在项目列表中显示）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="详细描述" prop="description">
          <div class="editor-container">
            <!-- 工具栏 -->
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="execCommand('bold')" title="加粗">
                  <el-icon><Plus /></el-icon>
                </el-button>
                <el-button size="small" @click="execCommand('italic')" title="斜体">
                  <el-icon><Plus /></el-icon>
                </el-button>
                <el-button size="small" @click="execCommand('underline')" title="下划线">
                  <el-icon><Plus /></el-icon>
                </el-button>
              </el-button-group>

              <el-button-group>
                <el-button size="small" @click="execCommand('insertUnorderedList')" title="无序列表">
                  <el-icon><List /></el-icon>
                </el-button>
                <el-button size="small" @click="execCommand('insertOrderedList')" title="有序列表">
                  <el-icon><Sort /></el-icon>
                </el-button>
              </el-button-group>

              <el-button-group>
                <el-button size="small" @click="execCommand('justifyLeft')" title="左对齐">
                  <el-icon><DArrowLeft /></el-icon>
                </el-button>
                <el-button size="small" @click="execCommand('justifyCenter')" title="居中">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <el-button size="small" @click="execCommand('justifyRight')" title="右对齐">
                  <el-icon><DArrowRight /></el-icon>
                </el-button>
              </el-button-group>

              <el-button-group>
                <el-button size="small" @click="insertLink" title="插入链接">
                  <el-icon><Link /></el-icon>
                </el-button>
                <el-button size="small" @click="insertImage" title="插入图片">
                  <el-icon><Picture /></el-icon>
                </el-button>
              </el-button-group>

              <el-button-group>
                <el-button size="small" @click="execCommand('undo')" title="撤销">
                  <el-icon><RefreshLeft /></el-icon>
                </el-button>
                <el-button size="small" @click="execCommand('redo')" title="重做">
                  <el-icon><RefreshRight /></el-icon>
                </el-button>
              </el-button-group>
            </div>

            <!-- 编辑器 -->
            <div
              ref="editorRef"
              class="rich-editor"
              contenteditable="true"
              @input="handleEditorInput"
            ></div>
          </div>
        </el-form-item>
      </el-card>

      <!-- 项目设置 -->
      <el-card class="form-section">
        <template #header>
          <div class="card-header">
            <span class="section-title">项目设置</span>
          </div>
        </template>

        <el-form-item label="项目可见性" prop="visibility">
          <el-radio-group v-model="formData.visibility">
            <el-radio label="public">公开</el-radio>
            <el-radio label="private">私有</el-radio>
            <el-radio label="protected">仅成员可见</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="允许评论" prop="allowComments">
          <el-switch v-model="formData.allowComments" />
        </el-form-item>

        <el-form-item label="项目成员" prop="members">
          <el-select
            v-model="formData.members"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="搜索并添加项目成员"
            :remote-method="searchMembers"
            :loading="memberLoading"
            class="full-width"
          >
            <el-option
              v-for="item in memberOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-card>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存修改' : '创建项目' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  List,
  Sort,
  DArrowLeft,
  MoreFilled,
  DArrowRight,
  Link,
  Picture,
  RefreshLeft,
  RefreshRight
} from '@element-plus/icons-vue'
import { PROJECT_STATUS } from '@/shared/constants'

// Props
interface ProjectFormData {
  id?: string
  name?: string
  coverImage?: string
  categoryId?: string
  tags?: string
  status?: number
  summary?: string
  description?: string
}

interface Props {
  isEdit?: boolean
  initialData?: ProjectFormData | null
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  initialData: null
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Refs
const formRef = ref()
const editorRef = ref()

// State
const submitting = ref(false)
const memberLoading = ref(false)
const uploadUrl = ref('/api/upload')

// 表单数据
const formData = reactive({
  name: '',
  coverImage: '',
  category: [],
  tags: [],
  status: PROJECT_STATUS.DRAFT,
  summary: '',
  description: '',
  visibility: 'public',
  allowComments: true,
  members: []
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择项目分类', trigger: 'change' }
  ],
  summary: [
    { required: true, message: '请输入项目简介', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入项目详细描述', trigger: 'blur' }
  ]
}

// 多级分类选项
const categoryOptions = [
  {
    value: 'ai',
    label: '人工智能',
    children: [
      {
        value: 'nlp',
        label: '自然语言处理',
        children: [
          { value: 'chatbot', label: '聊天机器人' },
          { value: 'translation', label: '机器翻译' },
          { value: 'sentiment', label: '情感分析' }
        ]
      },
      {
        value: 'cv',
        label: '计算机视觉',
        children: [
          { value: 'recognition', label: '图像识别' },
          { value: 'detection', label: '目标检测' },
          { value: 'segmentation', label: '图像分割' }
        ]
      },
      {
        value: 'ml',
        label: '机器学习',
        children: [
          { value: 'classification', label: '分类' },
          { value: 'regression', label: '回归' },
          { value: 'clustering', label: '聚类' }
        ]
      }
    ]
  },
  {
    value: 'data',
    label: '数据分析',
    children: [
      {
        value: 'visualization',
        label: '数据可视化',
        children: [
          { value: 'charts', label: '图表' },
          { value: 'dashboard', label: '仪表板' },
          { value: 'report', label: '报表' }
        ]
      },
      {
        value: 'processing',
        label: '数据处理',
        children: [
          { value: 'etl', label: 'ETL' },
          { value: 'cleaning', label: '数据清洗' },
          { value: 'transformation', label: '数据转换' }
        ]
      }
    ]
  },
  {
    value: 'web',
    label: 'Web应用',
    children: [
      {
        value: 'frontend',
        label: '前端',
        children: [
          { value: 'vue', label: 'Vue' },
          { value: 'react', label: 'React' },
          { value: 'angular', label: 'Angular' }
        ]
      },
      {
        value: 'backend',
        label: '后端',
        children: [
          { value: 'nodejs', label: 'Node.js' },
          { value: 'java', label: 'Java' },
          { value: 'python', label: 'Python' }
        ]
      }
    ]
  }
]

const categoryProps = {
  expandTrigger: 'hover' as const,
  checkStrictly: true
}

// 标签选项
const tagOptions = [
  { value: 'Vue3', label: 'Vue3' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: '机器学习', label: '机器学习' },
  { value: '深度学习', label: '深度学习' },
  { value: 'NLP', label: 'NLP' },
  { value: '计算机视觉', label: '计算机视觉' },
  { value: '数据分析', label: '数据分析' },
  { value: '可视化', label: '可视化' },
  { value: '自动化', label: '自动化' }
]

// 成员选项
const memberOptions = ref([
  { value: '1', label: '张三' },
  { value: '2', label: '李四' },
  { value: '3', label: '王五' }
])

// 封面上传
const handleCoverSuccess = (response: any) => {
  formData.coverImage = response.url
  ElMessage.success('封面上传成功')
}

const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 富文本编辑器方法
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
}

const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (url) {
    execCommand('createLink', url)
  }
}

const insertImage = () => {
  const url = prompt('请输入图片地址:')
  if (url) {
    execCommand('insertImage', url)
  }
}

const handleEditorInput = () => {
  formData.description = editorRef.value?.innerHTML || ''
}

// 搜索成员
const searchMembers = (query: string) => {
  if (query) {
    memberLoading.value = true
    // 模拟异步搜索
    setTimeout(() => {
      memberOptions.value = [
        { value: '1', label: '张三' },
        { value: '2', label: '李四' },
        { value: '3', label: '王五' },
        { value: '4', label: query },
        { value: '5', label: `${query}1` }
      ]
      memberLoading.value = false
    }, 500)
  } else {
    memberOptions.value = []
  }
}

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 模拟异步提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 触发提交事件
    emit('submit', { ...formData })

    ElMessage.success(props.isEdit ? '项目更新成功' : '项目创建成功')
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    submitting.value = false
  }
}

// 取消操作
const handleCancel = () => {
  ElMessageBox.confirm('确定要取消吗？未保存的内容将丢失。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('cancel')
  }).catch(() => {})
}

// 初始化编辑器内容
const initEditorContent = (content: string) => {
  if (editorRef.value) {
    editorRef.value.innerHTML = content
  }
}

// 监听初始数据变化
watch(() => props.initialData, (newData: ProjectFormData | null) => {
  if (newData) {
    Object.assign(formData, newData)
    if (newData.description) {
      initEditorContent(newData.description)
    }
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  if (props.isEdit && props.initialData?.description) {
    initEditorContent(props.initialData.description)
  }
})

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields()
})
</script>

<style scoped>
.project-form-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.project-form {
  margin-top: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.full-width {
  width: 100%;
}

/* 封面上传 */
.cover-uploader {
  display: inline-block;
}

.cover-image {
  width: 400px;
  height: 225px;
  display: block;
  object-fit: cover;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 225px;
  line-height: 225px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.cover-uploader-icon:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

/* 富文本编辑器 */
.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rich-editor {
  min-height: 300px;
  padding: 16px;
  outline: none;
  overflow-y: auto;
}

.rich-editor:focus {
  background-color: #fafafa;
}

.rich-editor img {
  max-width: 100%;
  height: auto;
}

.rich-editor a {
  color: #409EFF;
  text-decoration: none;
}

.rich-editor a:hover {
  text-decoration: underline;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .project-form-container {
    padding: 16px;
  }

  .cover-image,
  .cover-uploader-icon {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }

  .editor-toolbar {
    gap: 4px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
