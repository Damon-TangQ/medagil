<template>
  <div class="project-list-container">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索项目名称、描述或标签"
          prefix-icon="Search"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="filter-section">
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          clearable
          class="filter-select"
          @change="handleCategoryChange"
        >
          <el-option label="全部分类" value="all" />
          <el-option label="AI助手" value="1" />
          <el-option label="数据分析" value="2" />
          <el-option label="NLP" value="3" />
          <el-option label="计算机视觉" value="4" />
        </el-select>

        <el-select
          v-model="selectedStatus"
          placeholder="选择状态"
          clearable
          class="filter-select"
          @change="handleStatusChange"
        >
          <el-option label="全部状态" :value="undefined" />
          <el-option label="已发布" :value="1" />
          <el-option label="草稿" :value="0" />
        </el-select>

        <el-button type="primary" :icon="Plus" @click="handleCreateProject">
          创建新项目
        </el-button>
      </div>
    </div>

    <!-- 项目列表 -->
    <div v-loading="loading" class="project-list">
      <el-empty v-if="!loading && projects.length === 0" description="暂无项目" />

      <div v-else class="project-grid">
        <el-card
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          shadow="hover"
          @click="handleProjectClick(project)"
        >
          <div class="project-cover">
            <el-image
              :src="project.coverImage || defaultCover"
              fit="cover"
              class="cover-image"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="project-status">
              <el-tag :type="project.status === 1 ? 'success' : 'info'" size="small">
                {{ project.status === 1 ? '已发布' : '草稿' }}
              </el-tag>
            </div>
          </div>

          <div class="project-info">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-description">{{ project.description || '暂无描述' }}</p>

            <div v-if="project.tags" class="project-tags">
              <el-tag
                v-for="tag in project.tags.split(',')"
                :key="tag"
                size="small"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
            </div>

            <div class="project-meta">
              <div class="meta-item">
                <el-icon><View /></el-icon>
                <span>{{ project.viewCount }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Star /></el-icon>
                <span>{{ project.likeCount }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                <span>{{ formatDate(project.createdAt) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 36, 48]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus, Picture, View, Star, Clock } from '@element-plus/icons-vue'
import api from '@/api'

const router = useRouter()

// 默认封面图
const defaultCover = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 搜索关键词
const searchKeyword = ref('')

// 选中的分类
const selectedCategory = ref('all')

// 选中的状态
const selectedStatus = ref<number | undefined>(undefined)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const loading = ref(false)

// 模拟数据
interface Project {
  id: number
  name: string
  description: string
  coverImage?: string
  category: string
  status: number
  tags: string
  viewCount: number
  likeCount: number
  createdAt: string
}

const allProjects = ref<Project[]>([])
const projects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProjects.value.slice(start, end)
})

// 筛选后的项目列表
const filteredProjects = computed(() => {
  let result = allProjects.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.tags.toLowerCase().includes(keyword)
    )
  }

  // 分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 状态筛选
  if (selectedStatus.value !== undefined) {
    result = result.filter(p => p.status === selectedStatus.value)
  }

  return result
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

// 生成模拟数据
const generateMockProjects = (count: number): Project[] => {
  const categories = ['1', '2', '3', '4'] // AI助手, 数据分析, NLP, 计算机视觉
  const statuses = [0, 1] // 草稿, 已发布
  const tagsList = [
    'Vue3,TypeScript',
    'Python,机器学习',
    '深度学习,图像识别',
    '自然语言处理,NLP',
    '数据分析,可视化',
    'React,Node.js',
    'Spring Boot,MySQL',
    'Docker,Kubernetes'
  ]

  const descriptions = [
    '这是一个基于人工智能的智能助手项目，可以帮助用户自动化处理日常任务。',
    '数据分析平台，提供强大的数据处理和可视化功能。',
    '自然语言处理系统，支持文本分析和情感识别。',
    '计算机视觉应用，实现图像识别和目标检测。',
    '企业级管理系统，提供完整的项目管理解决方案。',
    '实时数据监控平台，支持多数据源接入和实时分析。',
    '智能推荐系统，基于用户行为提供个性化推荐。',
    '自动化测试平台，提高测试效率和质量。'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `项目 ${i + 1}`,
    description: descriptions[i % descriptions.length],
    coverImage: `https://picsum.photos/400/300?random=${i}`,
    category: categories[i % categories.length],
    status: statuses[i % statuses.length],
    tags: tagsList[i % tagsList.length],
    viewCount: Math.floor(Math.random() * 1000) + 100,
    likeCount: Math.floor(Math.random() * 500) + 50,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

// 加载项目数据
const loadProjects = async () => {
  loading.value = true
  try {
    const response = await api.getProjectList({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: selectedStatus.value
    })
    
    if (response.success && response.data) {
      allProjects.value = response.data.projects
      total.value = response.data.total
    } else {
      ElMessage.error(response.message || '加载项目列表失败')
    }
  } catch (error) {
    console.error('加载项目列表错误:', error)
    ElMessage.error('加载项目列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 搜索项目
const handleSearch = async () => {
  currentPage.value = 1
  await loadProjects()
}

// 分类变更
const handleCategoryChange = async () => {
  currentPage.value = 1
  await loadProjects()
}

// 状态变更
const handleStatusChange = async () => {
  currentPage.value = 1
  await loadProjects()
}

// 页码变更
const handlePageChange = async (page: number) => {
  currentPage.value = page
  await loadProjects()
}

// 每页数量变更
const handleSizeChange = async (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  await loadProjects()
}

// 点击项目卡片
const handleProjectClick = (project: Project) => {
  router.push(`/projects/${project.id}`)
}

// 创建新项目
const handleCreateProject = () => {
  router.push('/projects/create')
}

// 初始化
onMounted(async () => {
  await loadProjects()
})
</script>

<style scoped>
.project-list-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-section {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
}

.filter-section {
  display: flex;
  gap: 12px;
}

.filter-select {
  width: 140px;
}

.project-list {
  min-height: 400px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  cursor: pointer;
  transition: transform 0.3s;
  border: none;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
}

.project-cover {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
}

.image-error .el-icon {
  font-size: 48px;
}

.project-status {
  position: absolute;
  top: 12px;
  right: 12px;
}

.project-info {
  padding: 16px 0;
}

.project-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 42px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag-item {
  font-size: 12px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.meta-item .el-icon {
  font-size: 14px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .project-list-container {
    padding: 16px;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-section {
    max-width: 100%;
  }

  .filter-section {
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1;
    min-width: 120px;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
