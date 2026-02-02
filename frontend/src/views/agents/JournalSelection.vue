<template>
  <div class="journal-selection">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <el-button circle text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1 class="title">智能选刊助手</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleCompareSelected">
          <el-icon><DataAnalysis /></el-icon>
          对比选中期刊 ({{ selectedJournals.length }})
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入关键词"
              clearable
            />
          </el-form-item>
          <el-form-item label="学科领域">
            <el-select v-model="searchForm.field" placeholder="请选择学科领域" clearable>
              <el-option label="医学" value="medicine" />
              <el-option label="生物学" value="biology" />
              <el-option label="化学" value="chemistry" />
              <el-option label="药学" value="pharmacy" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="影响因子">
            <el-input-number v-model="searchForm.minImpact" :min="0" :max="50" :step="0.1" placeholder="最小值" />
            <span class="separator">-</span>
            <el-input-number v-model="searchForm.maxImpact" :min="0" :max="50" :step="0.1" placeholder="最大值" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 期刊匹配卡片列表 -->
    <div class="journals-grid">
      <div
        v-for="journal in filteredJournals"
        :key="journal.id"
        :class="['journal-card', { selected: selectedJournals.includes(journal.id) }]"
      >
        <div class="card-header">
          <div class="journal-info">
            <h3 class="journal-name">{{ journal.name }}</h3>
            <el-tag :type="getMatchType(journal.match)" size="large">
              匹配度 {{ journal.match }}%
            </el-tag>
          </div>
          <el-checkbox
            v-model="selectedJournals"
            :label="journal.id"
            @change="handleSelectJournal(journal.id)"
          />
        </div>

        <div class="card-content">
          <div class="info-row">
            <span class="label">影响因子：</span>
            <span class="value highlight">{{ journal.impactFactor }}</span>
          </div>
          <div class="info-row">
            <span class="label">审稿周期：</span>
            <span class="value">{{ journal.reviewPeriod }}</span>
          </div>
          <div class="info-row">
            <span class="label">学科领域：</span>
            <span class="value">{{ journal.field }}</span>
          </div>
          <div class="info-row">
            <span class="label">收录情况：</span>
            <span class="value">{{ journal.indexed }}</span>
          </div>
          <div class="info-row">
            <span class="label">版面费：</span>
            <span class="value">{{ journal.fee }}</span>
          </div>
        </div>

        <div class="card-actions">
          <el-button text @click="handleViewDetail(journal)">
            <el-icon><View /></el-icon>
            查看详情
          </el-button>
          <el-button text type="primary" @click="handleAddToCompare(journal)">
            <el-icon><Plus /></el-icon>
            加入对比
          </el-button>
        </div>
      </div>
    </div>

    <!-- 期刊详情模态框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="期刊详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <div v-if="selectedJournalDetail" class="journal-detail">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">期刊名称：</span>
              <span class="value">{{ selectedJournalDetail.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">ISSN：</span>
              <span class="value">{{ selectedJournalDetail.issn }}</span>
            </div>
            <div class="info-item">
              <span class="label">影响因子：</span>
              <span class="value highlight">{{ selectedJournalDetail.impactFactor }}</span>
            </div>
            <div class="info-item">
              <span class="label">审稿周期：</span>
              <span class="value">{{ selectedJournalDetail.reviewPeriod }}</span>
            </div>
            <div class="info-item">
              <span class="label">学科领域：</span>
              <span class="value">{{ selectedJournalDetail.field }}</span>
            </div>
            <div class="info-item">
              <span class="label">收录情况：</span>
              <span class="value">{{ selectedJournalDetail.indexed }}</span>
            </div>
            <div class="info-item">
              <span class="label">版面费：</span>
              <span class="value">{{ selectedJournalDetail.fee }}</span>
            </div>
            <div class="info-item">
              <span class="label">出版频率：</span>
              <span class="value">{{ selectedJournalDetail.frequency }}</span>
            </div>
          </div>
        </div>

        <!-- 投稿要求 -->
        <div class="detail-section">
          <h3 class="section-title">投稿要求</h3>
          <div class="requirements-content">
            <div class="requirement-item">
              <h4>文章类型</h4>
              <p>{{ selectedJournalDetail.articleTypes }}</p>
            </div>
            <div class="requirement-item">
              <h4>字数要求</h4>
              <p>{{ selectedJournalDetail.wordCount }}</p>
            </div>
            <div class="requirement-item">
              <h4>格式要求</h4>
              <p>{{ selectedJournalDetail.format }}</p>
            </div>
            <div class="requirement-item">
              <h4>图表要求</h4>
              <p>{{ selectedJournalDetail.figureRequirements }}</p>
            </div>
            <div class="requirement-item">
              <h4>参考文献格式</h4>
              <p>{{ selectedJournalDetail.referenceFormat }}</p>
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="detail-section">
          <h3 class="section-title">其他信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">投稿链接：</span>
              <el-link type="primary" :href="selectedJournalDetail.submitUrl" target="_blank">
                {{ selectedJournalDetail.submitUrl }}
              </el-link>
            </div>
            <div class="info-item">
              <span class="label">官网链接：</span>
              <el-link type="primary" :href="selectedJournalDetail.website" target="_blank">
                {{ selectedJournalDetail.website }}
              </el-link>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleAddToCompare(selectedJournalDetail)">
            加入对比
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 对比对话框 -->
    <el-dialog
      v-model="compareDialogVisible"
      title="期刊对比"
      width="90%"
      :close-on-click-modal="false"
    >
      <div class="compare-table-container">
        <el-table :data="compareTableData" border>
          <el-table-column prop="parameter" label="参数" width="150" fixed />
          <el-table-column
            v-for="journal in compareJournals"
            :key="journal.id"
            :label="journal.name"
            min-width="200"
          >
            <template #default="{ row }">
              <span :class="{ highlight: row.parameter === '影响因子' }">
                {{ journal[row.key] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="compareDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleExportCompare">
            <el-icon><Download /></el-icon>
            导出对比结果
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  DataAnalysis,
  Search,
  Refresh,
  View,
  Plus,
  Download
} from '@element-plus/icons-vue'

// 搜索表单
const searchForm = ref({
  keyword: '',
  field: '',
  minImpact: 0,
  maxImpact: 50
})

// 期刊列表
const journals = ref([
  {
    id: '1',
    name: 'New England Journal of Medicine',
    issn: '0028-4793',
    impactFactor: 91.245,
    reviewPeriod: '3-4个月',
    field: '医学',
    indexed: 'SCI',
    fee: '$5200',
    frequency: '周刊',
    match: 95,
    articleTypes: '原创研究、综述、评论、通信',
    wordCount: '3000-5000字',
    format: 'AMA格式',
    figureRequirements: 'TIFF格式，300dpi以上',
    referenceFormat: 'Vancouver格式',
    submitUrl: 'https://submit.nejm.org',
    website: 'https://www.nejm.org'
  },
  {
    id: '2',
    name: 'The Lancet',
    issn: '0140-6736',
    impactFactor: 79.321,
    reviewPeriod: '4-6周',
    field: '医学',
    indexed: 'SCI',
    fee: '$5000',
    frequency: '周刊',
    match: 92,
    articleTypes: '原创研究、综述、评论、通信',
    wordCount: '3000-5000字',
    format: 'Vancouver格式',
    figureRequirements: 'TIFF格式，300dpi以上',
    referenceFormat: 'Vancouver格式',
    submitUrl: 'https://submit.thelancet.com',
    website: 'https://www.thelancet.com'
  },
  {
    id: '3',
    name: 'Nature Medicine',
    issn: '1078-8956',
    impactFactor: 82.9,
    reviewPeriod: '2-3个月',
    field: '医学',
    indexed: 'SCI',
    fee: '$9500',
    frequency: '月刊',
    match: 88,
    articleTypes: '原创研究、综述、评论、通信',
    wordCount: '4000-6000字',
    format: 'Nature格式',
    figureRequirements: 'TIFF格式，300dpi以上',
    referenceFormat: 'Nature格式',
    submitUrl: 'https://submit.nature.com',
    website: 'https://www.nature.com/nm'
  },
  {
    id: '4',
    name: 'JAMA',
    issn: '0098-7484',
    impactFactor: 56.272,
    reviewPeriod: '4-8周',
    field: '医学',
    indexed: 'SCI',
    fee: '$3500',
    frequency: '周刊',
    match: 85,
    articleTypes: '原创研究、综述、评论、通信',
    wordCount: '3000-5000字',
    format: 'AMA格式',
    figureRequirements: 'TIFF格式，300dpi以上',
    referenceFormat: 'AMA格式',
    submitUrl: 'https://submit.jama.com',
    website: 'https://jamanetwork.com/journals/jama'
  },
  {
    id: '5',
    name: 'BMJ',
    issn: '0959-8138',
    impactFactor: 39.89,
    reviewPeriod: '3-4周',
    field: '医学',
    indexed: 'SCI',
    fee: '$3000',
    frequency: '周刊',
    match: 82,
    articleTypes: '原创研究、综述、评论、通信',
    wordCount: '3000-5000字',
    format: 'BMJ格式',
    figureRequirements: 'TIFF格式，300dpi以上',
    referenceFormat: 'Vancouver格式',
    submitUrl: 'https://submit.bmj.com',
    website: 'https://www.bmj.com'
  }
])

// 选中的期刊ID列表
const selectedJournals = ref<string[]>([])

// 详情对话框
const detailDialogVisible = ref(false)
const selectedJournalDetail = ref()

// 对比对话框
const compareDialogVisible = ref(false)
const compareJournals = ref<any[]>([])

// 过滤后的期刊列表
const filteredJournals = computed(() => {
  return journals.value.filter(journal => {
    // 关键词过滤
    if (searchForm.value.keyword && 
        !journal.name.toLowerCase().includes(searchForm.value.keyword.toLowerCase())) {
      return false
    }
    // 学科领域过滤
    if (searchForm.value.field && journal.field !== getFieldName(searchForm.value.field)) {
      return false
    }
    // 影响因子范围过滤
    if (searchForm.value.minImpact && journal.impactFactor < searchForm.value.minImpact) {
      return false
    }
    if (searchForm.value.maxImpact && journal.impactFactor > searchForm.value.maxImpact) {
      return false
    }
    return true
  })
})

// 对比表格数据
const compareTableData = computed(() => {
  return [
    { parameter: '影响因子', key: 'impactFactor' },
    { parameter: '审稿周期', key: 'reviewPeriod' },
    { parameter: '学科领域', key: 'field' },
    { parameter: '收录情况', key: 'indexed' },
    { parameter: '版面费', key: 'fee' },
    { parameter: '出版频率', key: 'frequency' },
    { parameter: '文章类型', key: 'articleTypes' },
    { parameter: '字数要求', key: 'wordCount' },
    { parameter: '格式要求', key: 'format' },
    { parameter: '图表要求', key: 'figureRequirements' }
  ]
})

// 获取学科领域名称
const getFieldName = (value: string) => {
  const map: Record<string, string> = {
    medicine: '医学',
    biology: '生物学',
    chemistry: '化学',
    pharmacy: '药学',
    other: '其他'
  }
  return map[value] || value
}

// 获取匹配度标签类型
const getMatchType = (match: number) => {
  if (match >= 90) return 'success'
  if (match >= 70) return 'warning'
  return 'info'
}

// 返回
const handleBack = () => {
  ElMessage.info('返回上一页')
}

// 搜索
const handleSearch = () => {
  ElMessage.success('搜索完成')
}

// 重置
const handleReset = () => {
  searchForm.value = {
    keyword: '',
    field: '',
    minImpact: 0,
    maxImpact: 50
  }
  ElMessage.success('已重置筛选条件')
}

// 选择期刊
const handleSelectJournal = (id: string) => {
  console.log('选择期刊:', id)
}

// 查看详情
const handleViewDetail = (journal: any) => {
  selectedJournalDetail.value = journal
  detailDialogVisible.value = true
}

// 加入对比
const handleAddToCompare = (journal: any) => {
  if (!compareJournals.value.find(j => j.id === journal.id)) {
    if (compareJournals.value.length >= 5) {
      ElMessage.warning('最多只能对比5本期刊')
      return
    }
    compareJournals.value.push(journal)
    ElMessage.success(`已添加 ${journal.name} 到对比列表`)
  } else {
    ElMessage.warning('该期刊已在对比列表中')
  }
}

// 对比选中期刊
const handleCompareSelected = () => {
  if (selectedJournals.value.length < 2) {
    ElMessage.warning('请至少选择2本期刊进行对比')
    return
  }
  compareJournals.value = journals.value.filter(j => selectedJournals.value.includes(j.id))
  compareDialogVisible.value = true
}

// 导出对比结果
const handleExportCompare = () => {
  ElMessage.success('导出对比结果中...')
}
</script>

<style scoped lang="scss">
.journal-selection {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 24px;

  // 顶部导航栏
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }
  }

  // 搜索和筛选区域
  .search-section {
    padding: 24px;

    .search-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;

      .separator {
        margin: 0 8px;
        color: #909399;
      }
    }
  }

  // 期刊匹配卡片列表
  .journals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    padding: 0 24px 24px;

    .journal-card {
      background-color: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      &.selected {
        border: 2px solid var(--el-color-primary);
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 16px;

        .journal-info {
          flex: 1;
          margin-right: 12px;

          .journal-name {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 8px;
            line-height: 1.4;
          }
        }
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;

        .info-row {
          display: flex;
          align-items: center;
          font-size: 14px;

          .label {
            color: #909399;
            min-width: 80px;
          }

          .value {
            color: #606266;
            flex: 1;

            &.highlight {
              color: var(--el-color-primary);
              font-weight: 600;
            }
          }
        }
      }

      .card-actions {
        display: flex;
        gap: 8px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;
      }
    }
  }

  // 期刊详情
  .journal-detail {
    .detail-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid var(--el-color-primary);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;

        .info-item {
          display: flex;
          align-items: center;
          font-size: 14px;

          .label {
            color: #909399;
            min-width: 100px;
          }

          .value {
            color: #606266;
            flex: 1;

            &.highlight {
              color: var(--el-color-primary);
              font-weight: 600;
            }
          }
        }
      }

      .requirements-content {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .requirement-item {
          h4 {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 8px;
          }

          p {
            font-size: 14px;
            color: #606266;
            margin: 0;
            line-height: 1.6;
          }
        }
      }
    }
  }

  // 对比表格
  .compare-table-container {
    :deep(.el-table) {
      .el-table__cell {
        padding: 12px;
      }

      .highlight {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }
  }
}
</style>
