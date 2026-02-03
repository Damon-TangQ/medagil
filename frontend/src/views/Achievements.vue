<template>
  <div class="achievements-page">
    <div class="page-header">
      <h1 class="page-title">成果库</h1>
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        添加成果
      </el-button>
    </div>

    <div class="achievements-filters">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索成果..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-select v-model="selectedType" placeholder="选择类型" clearable>
        <el-option label="全部类型" value="all" />
        <el-option label="论文" value="paper" />
        <el-option label="报告" value="report" />
        <el-option label="图表" value="chart" />
        <el-option label="数据集" value="dataset" />
      </el-select>
      <el-select v-model="selectedYear" placeholder="选择年份" clearable>
        <el-option label="全部年份" value="all" />
        <el-option label="2024" value="2024" />
        <el-option label="2023" value="2023" />
        <el-option label="2022" value="2022" />
      </el-select>
    </div>

    <div class="achievements-grid">
      <el-card
        v-for="achievement in filteredAchievements"
        :key="achievement.id"
        class="achievement-card"
        shadow="hover"
      >
        <div class="achievement-header">
          <div class="achievement-type">
            <el-icon :size="24" :color="achievement.color">
              <component :is="achievement.icon" />
            </el-icon>
          </div>
          <el-tag :type="getTypeColor(achievement.type)" size="small">
            {{ getTypeText(achievement.type) }}
          </el-tag>
        </div>

        <h3 class="achievement-title">{{ achievement.title }}</h3>
        <p class="achievement-description">{{ achievement.description }}</p>

        <div class="achievement-meta">
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ achievement.date }}</span>
          </div>
          <div class="meta-item">
            <el-icon><View /></el-icon>
            <span>{{ achievement.views }}</span>
          </div>
          <div class="meta-item">
            <el-icon><Download /></el-icon>
            <span>{{ achievement.downloads }}</span>
          </div>
        </div>

        <div class="achievement-actions">
          <el-button text type="primary" :icon="View">查看</el-button>
          <el-button text :icon="Download">下载</el-button>
          <el-button text :icon="Share">分享</el-button>
        </div>
      </el-card>

      <el-empty v-if="filteredAchievements.length === 0" description="暂无成果" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  Document,
  DataBoard,
  Picture,
  Folder,
  Calendar,
  View,
  Download,
  Share
} from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const selectedType = ref('all')
const selectedYear = ref('all')

const achievements = ref([
  {
    id: 1,
    title: '基于深度学习的医学影像诊断研究',
    description: '本研究提出了一种新的深度学习模型，用于医学影像的自动诊断...',
    type: 'paper',
    year: '2024',
    date: '2024-01-15',
    views: 1234,
    downloads: 567,
    icon: Document,
    color: '#667eea'
  },
  {
    id: 2,
    title: '心血管疾病数据分析报告',
    description: '通过对10000例心血管疾病患者的数据分析，发现了多个关键风险因素...',
    type: 'report',
    year: '2024',
    date: '2024-01-10',
    views: 890,
    downloads: 432,
    icon: DataBoard,
    color: '#764ba2'
  },
  {
    id: 3,
    title: '疾病传播趋势可视化图表',
    description: '交互式数据可视化图表，展示疾病在不同地区的传播趋势...',
    type: 'chart',
    year: '2023',
    date: '2023-12-20',
    views: 2345,
    downloads: 876,
    icon: Picture,
    color: '#f093fb'
  },
  {
    id: 4,
    title: '医学影像数据集',
    description: '包含5000例标注的医学影像数据，可用于深度学习模型训练...',
    type: 'dataset',
    year: '2023',
    date: '2023-11-15',
    views: 3456,
    downloads: 1234,
    icon: Folder,
    color: '#4facfe'
  }
])

const filteredAchievements = computed(() => {
  let result = achievements.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(keyword) ||
      a.description.toLowerCase().includes(keyword)
    )
  }

  // 类型筛选
  if (selectedType.value !== 'all') {
    result = result.filter(a => a.type === selectedType.value)
  }

  // 年份筛选
  if (selectedYear.value !== 'all') {
    result = result.filter(a => a.year === selectedYear.value)
  }

  return result
})

const getTypeColor = (type: string) => {
  const typeMap: Record<string, any> = {
    paper: 'primary',
    report: 'success',
    chart: 'warning',
    dataset: 'info'
  }
  return typeMap[type] || ''
}

const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    paper: '论文',
    report: '报告',
    chart: '图表',
    dataset: '数据集'
  }
  return typeMap[type] || type
}

const handleCreate = () => {
  router.push('/achievements/create')
}
</script>

<style scoped>
.achievements-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.achievements-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.achievement-card {
  border: none;
  transition: all 0.3s;
}

.achievement-card:hover {
  transform: translateY(-8px);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.achievement-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievement-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.achievement-description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9CA3AF;
}

.achievement-actions {
  display: flex;
  gap: 8px;
}

@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .achievements-filters {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .achievement-actions {
    flex-direction: column;
  }
}
</style>
