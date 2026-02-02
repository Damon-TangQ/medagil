<template>
  <div class="literature-analysis">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <el-button circle text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1 class="title">文献分析助手</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
      </div>
    </div>

    <!-- 文献上传区域 -->
    <div class="upload-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>文献上传</span>
            <el-tag type="info">支持 PDF、Word 格式</el-tag>
          </div>
        </template>

        <el-upload
          class="upload-area"
          drag
          :action="uploadAction"
          :on-success="handleUploadSuccess"
          :on-progress="handleUploadProgress"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          :file-list="fileList"
          multiple
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 PDF、Word 格式，单个文件不超过 50MB
            </div>
          </template>
        </el-upload>

        <!-- 上传进度显示 -->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
          <el-progress :percentage="uploadProgress" :status="uploadStatus" />
          <p class="progress-text">{{ progressText }}</p>
        </div>
      </el-card>
    </div>

    <!-- 对比分析视图 -->
    <div v-if="literatureList.length > 0" class="analysis-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>对比分析</span>
            <div class="header-actions">
              <el-button-group>
                <el-button :type="viewMode === 'grid' ? 'primary' : ''" @click="viewMode = 'grid'">
                  <el-icon><Grid /></el-icon>
                </el-button>
                <el-button :type="viewMode === 'list' ? 'primary' : ''" @click="viewMode = 'list'">
                  <el-icon><List /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="analysis-grid">
          <div
            v-for="literature in literatureList"
            :key="literature.id"
            class="literature-card"
          >
            <div class="card-header">
              <h3 class="title">{{ literature.title }}</h3>
              <el-tag :type="getAnalysisStatusType(literature.status)">
                {{ getAnalysisStatusText(literature.status) }}
              </el-tag>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="label">作者：</span>
                <span class="value">{{ literature.authors }}</span>
              </div>
              <div class="info-item">
                <span class="label">发表年份：</span>
                <span class="value">{{ literature.year }}</span>
              </div>
              <div class="info-item">
                <span class="label">研究类型：</span>
                <span class="value">{{ literature.studyType }}</span>
              </div>
              <div class="info-item">
                <span class="label">样本量：</span>
                <span class="value">{{ literature.sampleSize }}</span>
              </div>
              <div class="info-item">
                <span class="label">主要发现：</span>
                <span class="value">{{ literature.mainFindings }}</span>
              </div>
              <div class="info-item">
                <span class="label">研究结论：</span>
                <span class="value">{{ literature.conclusion }}</span>
              </div>
            </div>
            <div class="card-actions">
              <el-button text @click="handleViewDetail(literature)">
                <el-icon><View /></el-icon>
                查看详情
              </el-button>
              <el-button text type="primary" @click="handleCompare(literature)">
                <el-icon><DataAnalysis /></el-icon>
                对比分析
              </el-button>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <el-table v-else :data="literatureList" stripe>
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="authors" label="作者" width="150" />
          <el-table-column prop="year" label="年份" width="100" />
          <el-table-column prop="studyType" label="研究类型" width="120" />
          <el-table-column prop="sampleSize" label="样本量" width="100" />
          <el-table-column prop="status" label="分析状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getAnalysisStatusType(row.status)">
                {{ getAnalysisStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button text @click="handleViewDetail(row)">
                <el-icon><View /></el-icon>
                查看详情
              </el-button>
              <el-button text type="primary" @click="handleCompare(row)">
                <el-icon><DataAnalysis /></el-icon>
                对比
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 结论生成面板 -->
    <div v-if="literatureList.length > 0" class="conclusion-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>综述结论</span>
            <div class="header-actions">
              <el-button @click="handleRegenerate">
                <el-icon><Refresh /></el-icon>
                重新生成
              </el-button>
              <el-button type="primary" @click="handleSaveConclusion">
                <el-icon><Document /></el-icon>
                保存
              </el-button>
            </div>
          </div>
        </template>

        <div class="conclusion-content">
          <div class="conclusion-header">
            <h3>智能生成的综述结论</h3>
            <el-tag type="success">已生成</el-tag>
          </div>
          <el-input
            v-model="conclusion"
            type="textarea"
            :rows="10"
            placeholder="系统将根据分析结果自动生成综述结论..."
          />
          <div class="conclusion-footer">
            <div class="word-count">
              字数：{{ conclusion.length }}
            </div>
            <div class="ai-suggestions">
              <el-button text @click="handleShowSuggestions">
                <el-icon><MagicStick /></el-icon>
                AI建议
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 对比分析对话框 -->
    <el-dialog v-model="compareDialogVisible" title="文献对比分析" width="80%">
      <div class="compare-container">
        <div class="compare-item">
          <h4>{{ selectedLiterature?.title }}</h4>
          <div class="compare-content">
            <div class="compare-row">
              <span class="label">作者：</span>
              <span class="value">{{ selectedLiterature?.authors }}</span>
            </div>
            <div class="compare-row">
              <span class="label">发表年份：</span>
              <span class="value">{{ selectedLiterature?.year }}</span>
            </div>
            <div class="compare-row">
              <span class="label">研究类型：</span>
              <span class="value">{{ selectedLiterature?.studyType }}</span>
            </div>
            <div class="compare-row">
              <span class="label">样本量：</span>
              <span class="value">{{ selectedLiterature?.sampleSize }}</span>
            </div>
            <div class="compare-row">
              <span class="label">主要发现：</span>
              <span class="value">{{ selectedLiterature?.mainFindings }}</span>
            </div>
            <div class="compare-row">
              <span class="label">研究结论：</span>
              <span class="value">{{ selectedLiterature?.conclusion }}</span>
            </div>
          </div>
        </div>
        <div class="compare-divider">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="compare-item">
          <h4>对比分析结果</h4>
          <div class="compare-content">
            <div class="compare-row">
              <span class="label">相似度：</span>
              <el-progress :percentage="compareResult.similarity" />
            </div>
            <div class="compare-row">
              <span class="label">共同发现：</span>
              <span class="value">{{ compareResult.commonFindings }}</span>
            </div>
            <div class="compare-row">
              <span class="label">差异点：</span>
              <span class="value">{{ compareResult.differences }}</span>
            </div>
            <div class="compare-row">
              <span class="label">建议：</span>
              <span class="value">{{ compareResult.suggestions }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Download,
  UploadFilled,
  Grid,
  List,
  View,
  DataAnalysis,
  Refresh,
  Document,
  MagicStick
} from '@element-plus/icons-vue'

// 上传配置
const uploadAction = '/api/upload'
const fileList = ref([])
const uploadProgress = ref(0)
const uploadStatus = ref<'success' | 'exception' | ''>('')
const progressText = ref('')

// 文献列表
const literatureList = ref([
  {
    id: '1',
    title: '心血管疾病风险预测模型研究',
    authors: '张三, 李四, 王五',
    year: '2023',
    studyType: '队列研究',
    sampleSize: '1,234',
    mainFindings: '发现年龄、血压、血脂是主要风险因素',
    conclusion: '该模型具有良好的预测能力',
    status: 'completed'
  },
  {
    id: '2',
    title: '糖尿病并发症的预防与治疗',
    authors: '赵六, 钱七',
    year: '2022',
    studyType: '随机对照试验',
    sampleSize: '567',
    mainFindings: '早期干预可显著降低并发症发生率',
    conclusion: '建议加强早期筛查和干预',
    status: 'completed'
  }
])

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 综述结论
const conclusion = ref('基于对多篇文献的分析，心血管疾病和糖尿病是当前研究的热点领域。多项研究表明，早期干预和风险因素管理对于疾病预防具有重要意义。建议在临床实践中加强对高危人群的筛查和干预，同时开展更多大规模、多中心的临床研究以验证现有发现。')

// 对比分析
const compareDialogVisible = ref(false)
const selectedLiterature = ref()
const compareResult = ref({
  similarity: 75,
  commonFindings: '都强调了早期干预的重要性',
  differences: '研究方法和样本量存在差异',
  suggestions: '建议进行更大规模的对比研究'
})

// 返回
const handleBack = () => {
  ElMessage.info('返回上一页')
}

// 导出报告
const handleExport = () => {
  ElMessage.success('导出报告中...')
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isPDF = file.type === 'application/pdf'
  const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const isLt50M = file.size / 1024 / 1024 < 50

  if (!isPDF && !isWord) {
    ElMessage.error('只能上传 PDF 或 Word 文件!')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }
  return true
}

// 上传成功
const handleUploadSuccess = (response: any, file: any) => {
  ElMessage.success(`${file.name} 上传成功`)
  uploadProgress.value = 100
  uploadStatus.value = 'success'
  progressText.value = '解析完成'

  // 添加到文献列表
  literatureList.value.push({
    id: Date.now().toString(),
    title: file.name.replace(/\.[^/.]+$/, ''),
    authors: '待解析',
    year: '待解析',
    studyType: '待解析',
    sampleSize: '待解析',
    mainFindings: '待解析',
    conclusion: '待解析',
    status: 'analyzing'
  })
}

// 上传进度
const handleUploadProgress = (event: any) => {
  uploadProgress.value = Math.floor(event.percent)
  progressText.value = '正在解析文献...'
}

// 上传错误
const handleUploadError = () => {
  ElMessage.error('上传失败')
  uploadStatus.value = 'exception'
  progressText.value = '上传失败'
}

// 获取分析状态类型
const getAnalysisStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    analyzing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取分析状态文本
const getAnalysisStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    analyzing: '分析中',
    completed: '已完成',
    failed: '失败'
  }
  return textMap[status] || '未知'
}

// 查看详情
const handleViewDetail = (literature: any) => {
  ElMessage.success(`查看文献详情：${literature.title}`)
}

// 对比分析
const handleCompare = (literature: any) => {
  selectedLiterature.value = literature
  compareDialogVisible.value = true
}

// 重新生成结论
const handleRegenerate = () => {
  ElMessage.info('正在重新生成综述结论...')
  setTimeout(() => {
    ElMessage.success('综述结论已更新')
  }, 2000)
}

// 保存结论
const handleSaveConclusion = () => {
  ElMessage.success('综述结论已保存')
}

// 显示AI建议
const handleShowSuggestions = () => {
  ElMessage.info('显示AI写作建议')
}
</script>

<style scoped lang="scss">
.literature-analysis {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;

  // 顶部导航栏
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    background-color: #fff;
    padding: 16px 24px;
    border-radius: 12px;
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

  // 文献上传区域
  .upload-section {
    margin-bottom: 24px;

    .upload-area {
      :deep(.el-upload-dragger) {
        padding: 40px;
        border-radius: 12px;
        border: 2px dashed #dcdfe6;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
          background-color: rgba(64, 158, 255, 0.05);
        }
      }

      .el-icon--upload {
        font-size: 64px;
        color: #c0c4cc;
        margin-bottom: 16px;
      }

      .el-upload__text {
        font-size: 14px;
        color: #606266;

        em {
          color: #409eff;
          font-style: normal;
        }
      }

      .el-upload__tip {
        margin-top: 12px;
        font-size: 12px;
        color: #909399;
      }
    }

    .upload-progress {
      margin-top: 20px;
      padding: 16px;
      background-color: #f5f7fa;
      border-radius: 8px;

      .progress-text {
        margin-top: 8px;
        font-size: 14px;
        color: #606266;
        text-align: center;
      }
    }
  }

  // 对比分析视图
  .analysis-section {
    margin-bottom: 24px;

    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;

      .literature-card {
        background-color: #fff;
        border: 1px solid #e4e7ed;
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;

          .title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0;
            flex: 1;
            margin-right: 12px;
          }
        }

        .card-content {
          .info-item {
            display: flex;
            margin-bottom: 12px;
            font-size: 14px;

            .label {
              color: #909399;
              min-width: 80px;
            }

            .value {
              color: #303133;
              flex: 1;
            }
          }
        }

        .card-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }
      }
    }
  }

  // 结论生成面板
  .conclusion-section {
    .conclusion-content {
      .conclusion-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }
      }

      .conclusion-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;

        .word-count {
          font-size: 13px;
          color: #909399;
        }
      }
    }
  }

  // 对比分析对话框
  .compare-container {
    display: flex;
    gap: 24px;
    padding: 20px;

    .compare-item {
      flex: 1;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid #409eff;
      }

      .compare-content {
        .compare-row {
          display: flex;
          margin-bottom: 16px;
          font-size: 14px;

          .label {
            color: #909399;
            min-width: 100px;
            font-weight: 500;
          }

          .value {
            color: #303133;
            flex: 1;
          }
        }
      }
    }

    .compare-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 24px;
      color: #fff;
    }
  }
}
</style>
