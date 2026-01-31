<template>
  <div class="project-detail-container">
    <div v-loading="loading" class="detail-content">
      <!-- 项目封面 -->
      <div class="project-cover">
        <el-image
          :src="project?.coverImage || defaultCover"
          fit="cover"
          class="cover-image"
        >
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>

      <!-- 项目信息 -->
      <div class="project-info">
        <el-card>
          <template #header>
            <div class="card-header">
              <h1 class="project-name">{{ project?.name }}</h1>
              <div class="project-actions">
                <el-button
                  v-if="isOwner"
                  type="primary"
                  :icon="Edit"
                  @click="handleEdit"
                >
                  编辑
                </el-button>
                <el-button
                  :icon="Share"
                  @click="handleShare"
                >
                  分享
                </el-button>
              </div>
            </div>
          </template>

          <div class="project-meta">
            <el-tag v-if="project?.category" class="meta-tag">
              {{ getCategoryName(project.category) }}
            </el-tag>
            <el-tag :type="project?.status === 1 ? 'success' : 'info'" class="meta-tag">
              {{ project?.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ project?.viewCount || 0 }}
            </span>
            <span class="meta-item">
              <el-icon><Star /></el-icon>
              {{ project?.likeCount || 0 }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatDate(project?.createdAt) }}
            </span>
          </div>

          <div v-if="project?.tags" class="project-tags">
            <el-tag
              v-for="tag in project.tags.split(',')"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>

          <div class="project-description">
            <h3>项目描述</h3>
            <div class="description-content" v-html="project?.description"></div>
          </div>

          <div class="project-footer">
            <el-button
              type="primary"
              :icon="Star"
              @click="handleLike"
            >
              点赞 ({{ project?.likeCount || 0 }})
            </el-button>
            <el-button
              :icon="ChatDotRound"
              @click="handleComment"
            >
              评论
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, Edit, Share, View, Star, Clock, ChatDotRound } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 默认封面图
const defaultCover = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 状态
const loading = ref(false)
const project = ref<any>(null)

// 是否是项目所有者
const isOwner = computed(() => {
  return authStore.user?.id === project.value?.userId
})

// 获取项目详情
const fetchProjectDetail = async () => {
  loading.value = true
  try {
    // TODO: 调用实际API获取项目详情
    // const response = await axios.get(`/api/projects/${route.params.id}`)
    // project.value = response.data.data

    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    project.value = {
      id: route.params.id,
      userId: 'user_001',
      categoryId: '1',
      name: 'AI智能对话助手',
      description: '<p>基于大语言模型的智能对话助手，能够回答各种问题，提供专业建议。</p><p>主要功能包括：</p><ul><li>智能问答</li><li>专业建议</li><li>多轮对话</li></ul>',
      coverImage: '/images/project_cover_1.jpg',
      tags: 'AI,对话,智能助手',
      status: 1,
      viewCount: 1250,
      likeCount: 86,
      createdAt: new Date().toISOString()
    }
  } catch (error) {
    ElMessage.error('获取项目详情失败')
  } finally {
    loading.value = false
  }
}

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const categoryMap: Record<string, string> = {
    '1': '人工智能',
    '2': '数据分析',
    '3': '自然语言处理',
    '4': '计算机视觉'
  }
  return categoryMap[categoryId] || '其他'
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
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

// 编辑项目
const handleEdit = () => {
  router.push(`/projects/${route.params.id}/edit`)
}

// 分享项目
const handleShare = () => {
  ElMessage.info('分享功能开发中...')
}

// 点赞
const handleLike = () => {
  // TODO: 调用点赞API
  ElMessage.success('点赞成功')
  if (project.value) {
    project.value.likeCount++
  }
}

// 评论
const handleComment = () => {
  ElMessage.info('评论功能开发中...')
}

onMounted(() => {
  fetchProjectDetail()
})
</script>

<style scoped>
.project-detail-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-content {
  min-height: 400px;
}

.project-cover {
  width: 100%;
  height: 400px;
  margin-bottom: 24px;
  border-radius: 8px;
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
  font-size: 64px;
}

.project-info {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.meta-tag {
  margin-right: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 14px;
}

.meta-item .el-icon {
  font-size: 16px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tag-item {
  font-size: 12px;
}

.project-description {
  margin-bottom: 24px;
}

.project-description h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.description-content {
  color: #606266;
  line-height: 1.8;
}

.description-content :deep(p) {
  margin-bottom: 12px;
}

.description-content :deep(ul) {
  padding-left: 24px;
  margin-bottom: 12px;
}

.description-content :deep(li) {
  margin-bottom: 8px;
}

.project-footer {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .project-detail-container {
    padding: 16px;
  }

  .project-cover {
    height: 250px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .project-name {
    font-size: 20px;
  }

  .project-meta {
    flex-wrap: wrap;
  }

  .project-footer {
    flex-direction: column;
  }
}
</style>
