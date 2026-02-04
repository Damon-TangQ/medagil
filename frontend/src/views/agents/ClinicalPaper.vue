<template>
  <div class="clinical-paper-assistant">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <el-button circle text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1 class="title">临床论著助手</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleSave">
          <el-icon><Document /></el-icon>
          保存
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 步骤导航 -->
    <div class="steps-nav">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="研究信息采集" description="填写研究基本信息" />
        <el-step title="IMRAD框架预览" description="查看论文大纲" />
        <el-step title="章节写作" description="撰写论文内容" />
      </el-steps>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 研究信息采集表单 -->
      <div v-show="currentStep === 0" class="step-content research-form">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>研究信息采集</span>
              <el-tag type="info">步骤 1/3</el-tag>
            </div>
          </template>

          <el-form :model="researchForm" label-width="120px">
            <!-- 研究基本信息 -->
            <div class="form-section">
              <h3 class="section-title">研究基本信息</h3>
              <el-form-item label="研究标题">
                <el-input v-model="researchForm.title" placeholder="请输入研究标题" />
              </el-form-item>
              <el-form-item label="研究类型">
                <el-select v-model="researchForm.type" placeholder="请选择研究类型">
                  <el-option label="随机对照试验" value="rct" />
                  <el-option label="队列研究" value="cohort" />
                  <el-option label="病例对照研究" value="case-control" />
                  <el-option label="横断面研究" value="cross-sectional" />
                  <el-option label="系统评价/Meta分析" value="meta-analysis" />
                </el-select>
              </el-form-item>
              <el-form-item label="研究科室">
                <el-input v-model="researchForm.department" placeholder="请输入研究科室" />
              </el-form-item>
              <el-form-item label="研究周期">
                <el-date-picker
                  v-model="researchForm.period"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </div>

            <!-- 研究对象信息 -->
            <div class="form-section">
              <h3 class="section-title">研究对象信息</h3>
              <el-form-item label="样本量">
                <el-input-number v-model="researchForm.sampleSize" :min="1" />
              </el-form-item>
              <el-form-item label="纳入标准">
                <el-input
                  v-model="researchForm.inclusionCriteria"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入纳入标准"
                />
              </el-form-item>
              <el-form-item label="排除标准">
                <el-input
                  v-model="researchForm.exclusionCriteria"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入排除标准"
                />
              </el-form-item>
            </div>

            <!-- 研究方法 -->
            <div class="form-section">
              <h3 class="section-title">研究方法</h3>
              <el-form-item label="研究设计">
                <el-input
                  v-model="researchForm.studyDesign"
                  type="textarea"
                  :rows="4"
                  placeholder="请描述研究设计"
                />
              </el-form-item>
              <el-form-item label="数据收集">
                <el-input
                  v-model="researchForm.dataCollection"
                  type="textarea"
                  :rows="4"
                  placeholder="请描述数据收集方法"
                />
              </el-form-item>
              <el-form-item label="统计分析">
                <el-input
                  v-model="researchForm.statisticalAnalysis"
                  type="textarea"
                  :rows="4"
                  placeholder="请描述统计分析方法"
                />
              </el-form-item>
            </div>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button @click="handleResetForm">重置</el-button>
              <el-button type="primary" @click="handleNextStep">
                下一步
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-form>
        </el-card>
      </div>

      <!-- IMRAD框架预览 -->
      <div v-show="currentStep === 1" class="step-content imrad-preview">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>IMRAD框架预览</span>
              <el-tag type="info">步骤 2/3</el-tag>
            </div>
          </template>

          <div class="imrad-container">
            <!-- 左侧大纲导航 -->
            <div class="outline-nav">
              <div class="outline-header">
                <h3>论文大纲</h3>
                <el-button text @click="handleExpandAll">
                  <el-icon><Plus /></el-icon>
                  展开全部
                </el-button>
              </div>

              <el-tree
                ref="outlineTreeRef"
                :data="outlineData"
                :props="{ children: 'children', label: 'label' }"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :highlight-current="true"
                @node-click="handleNodeClick"
              >
                <template #default="{ node, data }">
                  <div class="tree-node">
                    <span class="node-label">{{ node.label }}</span>
                    <el-tag v-if="data.status" :type="getStatusType(data.status)" size="small">
                      {{ getStatusText(data.status) }}
                    </el-tag>
                  </div>
                </template>
              </el-tree>
            </div>

            <!-- 右侧内容预览 -->
            <div class="content-preview">
              <div class="preview-header">
                <h2>{{ currentSection.title }}</h2>
                <div class="preview-actions">
                  <el-button size="small" @click="handleEditSection">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                </div>
              </div>
              <div class="preview-content">
                <div v-html="currentSection.content"></div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <el-button @click="handlePrevStep">
              <el-icon><ArrowLeft /></el-icon>
              上一步
            </el-button>
            <el-button type="primary" @click="handleNextStep">
              下一步
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 章节写作面板 -->
      <div v-show="currentStep === 2" class="step-content writing-panel">
        <el-card class="writing-card">
          <template #header>
            <div class="card-header">
              <span>章节写作</span>
              <el-tag type="info">步骤 3/3</el-tag>
            </div>
          </template>

          <div class="writing-container">
            <!-- 左侧大纲 -->
            <div class="writing-outline">
              <div class="outline-header">
                <h3>章节大纲</h3>
                <el-button text @click="handleAddChapter">
                  <el-icon><Plus /></el-icon>
                  添加章节
                </el-button>
              </div>

              <el-tree
                ref="writingTreeRef"
                :data="writingOutlineData"
                :props="{ children: 'children', label: 'label' }"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :highlight-current="true"
                @node-click="handleWritingNodeClick"
              >
                <template #default="{ node, data }">
                  <div class="tree-node">
                    <span class="node-label">{{ node.label }}</span>
                    <div class="node-actions">
                      <el-button
                        circle
                        text
                        size="small"
                        @click.stop="handleEditChapter(data)"
                      >
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button
                        circle
                        text
                        size="small"
                        type="danger"
                        @click.stop="handleDeleteChapter(data)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </template>
              </el-tree>
            </div>

            <!-- 右侧富文本编辑器 -->
            <div class="rich-editor">
              <div class="editor-header">
                <h3>{{ currentWritingSection.title }}</h3>
                <div class="editor-toolbar">
                  <el-button-group>
                    <el-button size="small" @click="handleFormat('bold')">
                      <el-icon><Bold /></el-icon>
                    </el-button>
                    <el-button size="small" @click="handleFormat('italic')">
                      <el-icon><Italic /></el-icon>
                    </el-button>
                    <el-button size="small" @click="handleFormat('underline')">
                      <el-icon><Underline /></el-icon>
                    </el-button>
                  </el-button-group>
                  <el-button-group>
                    <el-button size="small" @click="handleInsert('table')">
                      <el-icon><Grid /></el-icon>
                    </el-button>
                    <el-button size="small" @click="handleInsert('image')">
                      <el-icon><Picture /></el-icon>
                    </el-button>
                    <el-button size="small" @click="handleInsert('reference')">
                      <el-icon><Reading /></el-icon>
                    </el-button>
                  </el-button-group>
                  <el-button-group>
                    <el-button size="small" @click="handleAIAssist">
                      <el-icon><MagicStick /></el-icon>
                      AI辅助
                    </el-button>
                  </el-button-group>
                </div>
              </div>

              <div class="editor-content">
                <el-input
                  v-model="currentWritingSection.content"
                  type="textarea"
                  :rows="20"
                  placeholder="开始写作..."
                />
              </div>

              <div class="editor-footer">
                <div class="word-count">
                  字数：{{ currentWritingSection.content.length }}
                </div>
                <div class="editor-actions">
                  <el-button @click="handleSaveDraft">保存草稿</el-button>
                  <el-button type="primary" @click="handlePublish">发布</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <el-button @click="handlePrevStep">
              <el-icon><ArrowLeft /></el-icon>
              上一步
            </el-button>
            <el-button type="success" @click="handleComplete">
              <el-icon><Check /></el-icon>
              完成
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Document,
  Download,
  Plus,
  Edit,
  Delete,
  Grid,
  Picture,
  Reading,
  MagicStick,
  Check
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

// 登录检查
const authStore = useAuthStore()

// 当前步骤
const currentStep = ref(0)

// 研究信息表单
const researchForm = reactive({
  title: '',
  type: '',
  department: '',
  period: [],
  sampleSize: 100,
  inclusionCriteria: '',
  exclusionCriteria: '',
  studyDesign: '',
  dataCollection: '',
  statisticalAnalysis: ''
})

// IMRAD大纲数据
const outlineData = ref([
  {
    id: '1',
    label: 'Introduction (引言)',
    status: 'completed',
    children: [
      { id: '1-1', label: '研究背景', status: 'completed' },
      { id: '1-2', label: '文献综述', status: 'completed' },
      { id: '1-3', label: '研究目的', status: 'completed' }
    ]
  },
  {
    id: '2',
    label: 'Methods (方法)',
    status: 'in-progress',
    children: [
      { id: '2-1', label: '研究对象', status: 'completed' },
      { id: '2-2', label: '研究设计', status: 'in-progress' },
      { id: '2-3', label: '数据收集', status: 'pending' },
      { id: '2-4', label: '统计分析', status: 'pending' }
    ]
  },
  {
    id: '3',
    label: 'Results (结果)',
    status: 'pending',
    children: [
      { id: '3-1', label: '基线特征', status: 'pending' },
      { id: '3-2', label: '主要结果', status: 'pending' },
      { id: '3-3', label: '次要结果', status: 'pending' }
    ]
  },
  {
    id: '4',
    label: 'And Discussion (讨论)',
    status: 'pending',
    children: [
      { id: '4-1', label: '结果解读', status: 'pending' },
      { id: '4-2', label: '与文献比较', status: 'pending' },
      { id: '4-3', label: '研究局限性', status: 'pending' },
      { id: '4-4', label: '结论', status: 'pending' }
    ]
  }
])

// 写作大纲数据
const writingOutlineData = ref([
  {
    id: '1',
    label: 'Introduction (引言)',
    children: [
      { id: '1-1', label: '研究背景' },
      { id: '1-2', label: '文献综述' },
      { id: '1-3', label: '研究目的' }
    ]
  },
  {
    id: '2',
    label: 'Methods (方法)',
    children: [
      { id: '2-1', label: '研究对象' },
      { id: '2-2', label: '研究设计' },
      { id: '2-3', label: '数据收集' },
      { id: '2-4', label: '统计分析' }
    ]
  },
  {
    id: '3',
    label: 'Results (结果)',
    children: [
      { id: '3-1', label: '基线特征' },
      { id: '3-2', label: '主要结果' },
      { id: '3-3', label: '次要结果' }
    ]
  },
  {
    id: '4',
    label: 'And Discussion (讨论)',
    children: [
      { id: '4-1', label: '结果解读' },
      { id: '4-2', label: '与文献比较' },
      { id: '4-3', label: '研究局限性' },
      { id: '4-4', label: '结论' }
    ]
  }
])

// 当前预览章节
const currentSection = ref({
  title: 'Introduction (引言)',
  content: `<p>本研究旨在探讨...</p>`
})

// 当前写作章节
const currentWritingSection = ref({
  title: '研究背景',
  content: ''
})

// 返回
const handleBack = () => {
  ElMessage.info('返回上一页')
}

// 保存
const handleSave = () => {
  if (!authStore.requireAuth()) {
    return
  }
  ElMessage.success('保存成功')
}

// 导出
const handleExport = () => {
  if (!authStore.requireAuth()) {
    return
  }
  ElMessage.success('导出成功')
}

// 重置表单
const handleResetForm = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    Object.assign(researchForm, {
      title: '',
      type: '',
      department: '',
      period: [],
      sampleSize: 100,
      inclusionCriteria: '',
      exclusionCriteria: '',
      studyDesign: '',
      dataCollection: '',
      statisticalAnalysis: ''
    })
    ElMessage.success('重置成功')
  }).catch(() => {})
}

// 下一步
const handleNextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
    ElMessage.success(`进入步骤 ${currentStep.value + 1}/3`)
  }
}

// 上一步
const handlePrevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    ElMessage.success(`返回步骤 ${currentStep.value + 1}/3`)
  }
}

// 展开/折叠全部
const handleExpandAll = () => {
  ElMessage.info('展开全部章节')
}

// 节点点击
const handleNodeClick = (data: any) => {
  currentSection.value.title = data.label
  ElMessage.success(`切换到：${data.label}`)
}

// 编辑章节
const handleEditSection = () => {
  ElMessage.info('编辑章节内容')
}

// 写作节点点击
const handleWritingNodeClick = (data: any) => {
  currentWritingSection.value.title = data.label
  currentWritingSection.value.content = ''
  ElMessage.success(`切换到：${data.label}`)
}

// 添加章节
const handleAddChapter = () => {
  ElMessage.info('添加新章节')
}

// 编辑章节
const handleEditChapter = (data: any) => {
  ElMessage.info(`编辑章节：${data.label}`)
}

// 删除章节
const handleDeleteChapter = (data: any) => {
  ElMessageBox.confirm(`确定要删除章节"${data.label}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 文本格式化
const handleFormat = (type: string) => {
  ElMessage.info(`应用格式：${type}`)
}

// 插入内容
const handleInsert = (type: string) => {
  ElMessage.info(`插入${type}`)
}

// AI辅助
const handleAIAssist = () => {
  ElMessage.info('AI辅助写作')
}

// 保存草稿
const handleSaveDraft = () => {
  if (!authStore.requireAuth()) {
    return
  }
  ElMessage.success('草稿已保存')
}

// 发布
const handlePublish = () => {
  if (!authStore.requireAuth()) {
    return
  }
  ElMessage.success('发布成功')
}

// 完成
const handleComplete = () => {
  ElMessageBox.confirm('确定要完成论文写作吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    ElMessage.success('论文已完成')
  }).catch(() => {})
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    completed: 'success',
    'in-progress': 'warning',
    pending: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    completed: '已完成',
    'in-progress': '进行中',
    pending: '待完成'
  }
  return textMap[status] || '待完成'
}
</script>

<style scoped lang="scss">
.clinical-paper-assistant {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;

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
      gap: 16px;

      .title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  // 步骤导航
  .steps-nav {
    padding: 24px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
  }

  // 内容区域
  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;

    .step-content {
      max-width: 1400px;
      margin: 0 auto;

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
      }

      .form-section {
        margin-bottom: 32px;

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #409eff;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      // IMRAD框架预览
      .imrad-container {
        display: flex;
        gap: 24px;
        height: 600px;

        .outline-nav {
          width: 300px;
          border-right: 1px solid #e4e7ed;
          padding-right: 24px;

          .outline-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;

            h3 {
              font-size: 16px;
              font-weight: 600;
              margin: 0;
            }
          }

          .tree-node {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;

            .node-label {
              flex: 1;
            }
          }
        }

        .content-preview {
          flex: 1;
          overflow-y: auto;

          .preview-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e4e7ed;

            h2 {
              font-size: 20px;
              font-weight: 600;
              margin: 0;
            }
          }

          .preview-content {
            line-height: 1.8;
            color: #606266;

            :deep(p) {
              margin-bottom: 16px;
            }
          }
        }
      }

      // 章节写作面板
      .writing-container {
        display: flex;
        gap: 24px;
        height: 700px;

        .writing-outline {
          width: 300px;
          border-right: 1px solid #e4e7ed;
          padding-right: 24px;

          .outline-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;

            h3 {
              font-size: 16px;
              font-weight: 600;
              margin: 0;
            }
          }

          .tree-node {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;

            .node-label {
              flex: 1;
            }

            .node-actions {
              display: flex;
              gap: 4px;
              opacity: 0;
              transition: opacity 0.3s;

              &:hover {
                opacity: 1;
              }
            }
          }
        }

        .rich-editor {
          flex: 1;
          display: flex;
          flex-direction: column;

          .editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e4e7ed;

            h3 {
              font-size: 18px;
              font-weight: 600;
              margin: 0;
            }

            .editor-toolbar {
              display: flex;
              gap: 8px;
            }
          }

          .editor-content {
            flex: 1;
            margin-bottom: 16px;

            :deep(.el-textarea__inner) {
              font-size: 15px;
              line-height: 1.8;
            }
          }

          .editor-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 12px;
            border-top: 1px solid #e4e7ed;

            .word-count {
              font-size: 13px;
              color: #909399;
            }

            .editor-actions {
              display: flex;
              gap: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
