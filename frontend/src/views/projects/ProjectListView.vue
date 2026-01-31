<template>
  <div class="project-list-container">
    <!-- 搜索和筛选栏 -->
    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索项目名称、描述或标签"
        prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
      />

      <el-select
        v-model="selectedCategory"
        placeholder="选择分类"
        clearable
        class="category-select"
        @change="handleCategoryChange"
      >
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>

      <el-select
        v-model="selectedStatus"
        placeholder="项目状态"
        clearable
        class="status-select"
        @change="handleStatusChange"
      >
        <el-option label="草稿" :value="0" />
        <el-option label="已发布" :value="1" />
        <el-option label="已下架" :value="2" />
      </el-select>

      <el-button type="primary" :icon="Plus" @click="handleCreate">
        创建项目
      </el-button>
    </div>

    <!-- 项目列表 -->
    <div v-loading="loading" class="project-grid">
      <el-empty v-if="!loading && projects.length === 0" description="暂无项目" />

      <el-card
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        :body-style="{ padding: '0' }"
        shadow="hover"
      >
        <!-- 项目封面 -->
        <div class="project-cover" @click="handleViewDetail(project.id)">
          <img v-if="project.coverImage" :src="project.coverImage" :alt="project.name" />
          <div v-else class="default-cover">
            <el-icon><FolderOpened /></el-icon>
          </div>
        </div>

        <!-- 项目信息 -->
        <div class="project-info">
          <h3 class="project-title" @click="handleViewDetail(project.id)">
            {{ project.name }}
          </h3>
          <p class="project-description">{{ project.description }}</p>

          <div class="project-meta">
            <el-tag v-if="project.status === PROJECT_STATUS.DRAFT" type="info" size="small">{{ PROJECT_STATUS_NAMES[PROJECT_STATUS.DRAFT] }}</el-tag>
            <el-tag v-else-if="project.status === PROJECT_STATUS.PUBLISHED" type="success" size="small">{{ PROJECT_STATUS_NAMES[PROJECT_STATUS.PUBLISHED] }}</el-tag>
            <el-tag v-else type="warning" size="small">已下架</el-tag>

            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ project.viewCount }}
            </span>

            <span class="meta-item">
              <el-icon><Star /></el-icon>
              {{ project.likeCount }}
            </span>
          </div>

          <div class="project-actions">
            <el-button link type="primary" @click="handleEdit(project.id)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(project.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, FolderOpened, View, Star } from '@element-plus/icons-vue'
import { useProjectStore } from '@/stores/project'
import { PROJECT_STATUS, PROJECT_STATUS_NAMES } from '@/shared/constants'

const router = useRouter()
const projectStore = useProjectStore()

// 加载状态
const loading = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedStatus = ref<number | undefined>(undefined)

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 项目列表
const projects = ref<any[]>([])

// 项目分类
const categories = ref([
  { id: '1', name: '数据分析' },
  { id: '2', name: '报告生成' },
  { id: '3', name: '智能对话' },
  { id: '4', name: '其他' }
])

// 加载项目列表
const loadProjects = async () => {
  loading.value = true
  try {
    const result = await projectStore.getAllProjects({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined,
      categoryId: selectedCategory.value || undefined,
      status: selectedStatus.value
    })

    if (result.success && result.data) {
      projects.value = result.data.projects
      total.value = result.data.total
    } else {
      ElMessage.error(result.message || '加载项目列表失败')
    }
  } catch (error) {
    console.error('加载项目列表错误:', error)
    ElMessage.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProjects()
}

// 分类筛选处理
const handleCategoryChange = () => {
  currentPage.value = 1
  loadProjects()
}

// 状态筛选处理
const handleStatusChange = () => {
  currentPage.value = 1
  loadProjects()
}

// 分页大小变化处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  loadProjects()
}

// 页码变化处理
const handlePageChange = (val: number) => {
  currentPage.value = val
  loadProjects()
}

// 创建项目
const handleCreate = () => {
  router.push('/projects/create')
}

// 查看项目详情
const handleViewDetail = (id: string) => {
  router.push(`/projects/${id}`)
}

// 编辑项目
const handleEdit = (id: string) => {
  router.push(`/projects/${id}/edit`)
}

// 删除项目
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const result = await projectStore.deleteProject(id)
    if (result.success) {
      ElMessage.success('删除成功')
      loadProjects()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    // 用户取消操作
  }
}

// 初始化
onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.project-list-container {
  padding: 20px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.category-select,
.status-select {
  width: 150px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  min-height: 400px;
}

.project-card {
  border: none;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.project-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  cursor: pointer;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.project-card:hover .project-cover img {
  transform: scale(1.05);
}

.default-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.default-cover .el-icon {
  font-size: 48px;
}

.project-info {
  padding: 16px;
}

.project-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-title:hover {
  color: #409eff;
}

.project-description {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 40px;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.project-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
  }

  .search-input,
  .category-select,
  .status-select {
    width: 100%;
    max-width: none;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
