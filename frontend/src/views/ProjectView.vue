<template>
  <div class="project-view-container">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <!-- 分类树形导航 -->
      <div class="sidebar-section">
        <div class="section-header">
          <el-icon><Folder /></el-icon>
          <span>项目分类</span>
        </div>
        <el-tree
          :data="categoryTreeData"
          :props="{ children: 'children', label: 'label' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="handleNodeClick"
          class="category-tree"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <el-icon v-if="data.type === 'folder'"><Folder /></el-icon>
              <el-icon v-else><Document /></el-icon>
              <span>{{ node.label }}</span>
              <span v-if="data.count" class="node-count">({{ data.count }})</span>
            </div>
          </template>
        </el-tree>
      </div>

      <!-- 项目统计信息 -->
      <div class="sidebar-section">
        <div class="section-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>项目统计</span>
        </div>
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: rgba(var(--el-color-primary-rgb), 0.1)">
              <el-icon color="var(--el-color-primary)"><Folder /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ projectStats.total }}</div>
              <div class="stat-label">全部项目</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: rgba(var(--el-color-success-rgb), 0.1)">
              <el-icon color="var(--el-color-success)"><CircleCheck /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ projectStats.active }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: rgba(var(--el-color-info-rgb), 0.1)">
              <el-icon color="var(--el-color-info)"><CircleClose /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ projectStats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: rgba(var(--el-color-warning-rgb), 0.1)">
              <el-icon color="var(--el-color-warning)"><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ projectStats.paused }}</div>
              <div class="stat-label">已暂停</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作区域 -->
      <div class="sidebar-section">
        <div class="section-header">
          <el-icon><Lightning /></el-icon>
          <span>快速操作</span>
        </div>
        <div class="quick-actions">
          <el-button type="primary" class="quick-action-btn" @click="handleCreateProject">
            <el-icon><Plus /></el-icon>
            新建项目
          </el-button>
          <el-button class="quick-action-btn" @click="handleImportProject">
            <el-icon><Upload /></el-icon>
            导入项目
          </el-button>
          <el-button class="quick-action-btn" @click="handleExportProjects">
            <el-icon><Download /></el-icon>
            导出项目
          </el-button>
          <el-button class="quick-action-btn" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新列表
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部操作栏 -->
      <div class="top-bar">
      <!-- 创建项目按钮 -->
      <el-button type="primary" size="large" class="create-button" @click="handleCreateProject">
        <el-icon><Plus /></el-icon>
        创建项目
      </el-button>

      <!-- 搜索框 -->
      <el-input
        v-model="searchQuery"
        placeholder="搜索项目..."
        prefix-icon="Search"
        clearable
        class="search-input"
      />

      <!-- 视图切换 -->
      <el-radio-group v-model="viewMode" class="view-toggle">
        <el-radio-button value="list">
          <el-icon><List /></el-icon>
          列表
        </el-radio-button>
        <el-radio-button value="grid">
          <el-icon><Grid /></el-icon>
          网格
        </el-radio-button>
      </el-radio-group>

      <!-- 筛选下拉 -->
      <div class="filter-group">
        <el-select v-model="filterCategory" placeholder="按分类筛选" clearable class="filter-select">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>

        <el-select v-model="filterStatus" placeholder="按状态筛选" clearable class="filter-select">
          <el-option
            v-for="status in statuses"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </div>
    </div>

    <!-- 项目列表/网格视图 -->
    <div v-if="viewMode === 'list'" class="project-list">
      <el-table :data="filteredProjects" stripe style="width: 100%">
        <el-table-column prop="name" label="项目名称" min-width="200">
          <template #default="{ row }">
            <div class="project-name-cell">
              <el-icon class="project-icon"><Folder /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="150" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" text @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-else class="project-grid">
      <!-- 空状态 -->
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <el-empty description="暂无项目">
          <el-button type="primary" size="large" @click="handleCreateProject">
            <el-icon><Plus /></el-icon>
            创建第一个项目
          </el-button>
        </el-empty>
      </div>

      <!-- 项目卡片 -->
      <el-card
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        shadow="hover"
      >
        <div class="card-cover" @click="handleViewProject(project)">
          <el-icon class="cover-icon" :size="48"><Folder /></el-icon>
        </div>
        
        <div class="card-body">
          <!-- 项目名称 -->
          <div class="card-title">
            <span 
              class="project-name" 
              :contenteditable="editingName === project.id"
              @blur="handleNameBlur(project)"
              @keydown.enter.prevent="handleNameBlur(project)"
            >
              {{ project.name }}
            </span>
            <el-button 
              text 
              size="small" 
              @click="startEditName(project)"
              v-if="editingName !== project.id"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
          </div>

          <!-- 描述摘要 -->
          <div class="card-description">
            {{ project.description || '暂无描述' }}
          </div>

          <!-- 分类标签 -->
          <div class="card-tags">
            <el-tag size="small" type="primary" effect="plain">
              {{ project.category }}
            </el-tag>
          </div>

          <!-- 最后修改时间 -->
          <div class="card-footer">
            <div class="update-time">
              <el-icon><Clock /></el-icon>
              <span>{{ project.updateTime }}</span>
            </div>

            <!-- 操作菜单 -->
            <el-dropdown trigger="click" @command="(cmd) => handleCardAction(cmd, project)">
              <el-button circle size="small" text>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="archive">
                    <el-icon><Box /></el-icon>
                    归档
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑项目对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '编辑项目' : '创建项目'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="projectForm" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目分类" prop="category">
          <el-cascader
            v-model="projectForm.category"
            :options="categoryOptions"
            :props="{ expandTrigger: 'hover' }"
            placeholder="请选择项目分类"
          />
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input
            v-model="projectForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入项目描述"
          />
        </el-form-item>
        <el-form-item label="项目状态" prop="status">
          <el-select v-model="projectForm.status" placeholder="请选择项目状态">
            <el-option
              v-for="status in statuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  Plus,
  Search,
  List,
  Grid,
  Folder,
  Edit,
  Delete,
  MoreFilled,
  FolderOpened,
  Clock,
  Box,
  Document,
  DataAnalysis,
  CircleCheck,
  CircleClose,
  Warning,
  Lightning,
  Upload,
  Download,
  Refresh
} from '@element-plus/icons-vue'

// 分类树形数据
const categoryTreeData = ref([
  {
    id: '1',
    label: '医学文献研究',
    type: 'folder',
    count: 2,
    children: [
      { id: '1-1', label: '心血管疾病', type: 'file', count: 1 },
      { id: '1-2', label: '神经科学', type: 'file', count: 1 }
    ]
  },
  {
    id: '2',
    label: '临床试验',
    type: 'folder',
    count: 3,
    children: [
      { id: '2-1', label: '一期试验', type: 'file', count: 1 },
      { id: '2-2', label: '二期试验', type: 'file', count: 1 },
      { id: '2-3', label: '三期试验', type: 'file', count: 1 }
    ]
  },
  {
    id: '3',
    label: '药物研发',
    type: 'folder',
    count: 1,
    children: [
      { id: '3-1', label: '靶点发现', type: 'file', count: 1 },
      { id: '3-2', label: '化合物筛选', type: 'file', count: 0 }
    ]
  }
])

// 项目统计数据
const projectStats = computed(() => ({
  total: projects.value.length,
  active: projects.value.filter(p => p.status === 'active').length,
  completed: projects.value.filter(p => p.status === 'completed').length,
  paused: projects.value.filter(p => p.status === 'paused').length
}))

// 视图模式
const viewMode = ref('list')

// 搜索查询
const searchQuery = ref('')

// 筛选条件
const filterCategory = ref('')
const filterStatus = ref('')

// 对话框显示
const dialogVisible = ref(false)
const isEditMode = ref(false)
const editingName = ref<string | null>(null)

// 表单引用
const formRef = ref<FormInstance>()

// 项目表单
const projectForm = ref({
  name: '',
  category: [] as string[],
  description: '',
  status: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择项目分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择项目状态', trigger: 'change' }
  ]
}

// 分类选项
const categories = ref([
  { id: '1', name: '医学文献研究' },
  { id: '2', name: '临床试验' },
  { id: '3', name: '药物研发' },
  { id: '4', name: '数据分析' }
])

// 状态选项
const statuses = ref([
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'paused', label: '已暂停' }
])

// 分类级联选项
const categoryOptions = ref([
  {
    value: '1',
    label: '医学文献研究',
    children: [
      { value: '1-1', label: '心血管疾病' },
      { value: '1-2', label: '神经科学' },
      { value: '1-3', label: '肿瘤研究' }
    ]
  },
  {
    value: '2',
    label: '临床试验',
    children: [
      { value: '2-1', label: '一期试验' },
      { value: '2-2', label: '二期试验' },
      { value: '2-3', label: '三期试验' }
    ]
  },
  {
    value: '3',
    label: '药物研发',
    children: [
      { value: '3-1', label: '靶点发现' },
      { value: '3-2', label: '化合物筛选' }
    ]
  }
])

// 项目列表数据
const projects = ref([
  {
    id: '1',
    name: '心血管疾病风险预测模型',
    category: '医学文献研究',
    status: 'active',
    description: '基于机器学习的心血管疾病风险预测模型研究，包含数据收集、模型训练和验证阶段。',
    updateTime: '2024-01-15 14:30'
  },
  {
    id: '2',
    name: '药物相互作用分析',
    category: '药物研发',
    status: 'completed',
    description: '分析多种药物之间的相互作用机制，评估潜在的安全风险。',
    updateTime: '2024-01-14 10:20'
  },
  {
    id: '3',
    name: '临床试验数据可视化',
    category: '数据分析',
    status: 'active',
    description: '开发交互式数据可视化工具，用于展示临床试验结果和统计分析。',
    updateTime: '2024-01-13 16:45'
  },
  {
    id: '4',
    name: '阿尔茨海默病文献综述',
    category: '医学文献研究',
    status: 'paused',
    description: '系统回顾阿尔茨海默病相关文献，总结最新研究进展和治疗策略。',
    updateTime: '2024-01-12 09:15'
  }
])

// 过滤后的项目
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchSearch = !searchQuery.value || 
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = !filterCategory.value || 
      project.category === categories.value.find(c => c.id === filterCategory.value)?.name
    const matchStatus = !filterStatus.value || 
      project.status === filterStatus.value
    return matchSearch && matchCategory && matchStatus
  })
})

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    active: 'success',
    completed: 'info',
    paused: 'warning'
  }
  return typeMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '进行中',
    completed: '已完成',
    paused: '已暂停'
  }
  return statusMap[status] || status
}

// 创建项目
const handleCreateProject = () => {
  isEditMode.value = false
  resetForm()
  dialogVisible.value = true
}

// 树节点点击
const handleNodeClick = (data: any) => {
  console.log('点击节点:', data)
  // 实际应用中这里应该根据选中的分类过滤项目
  ElMessage.success(`已选择分类：${data.label}`)
}

// 导入项目
const handleImportProject = () => {
  ElMessage.info('打开导入项目对话框')
  // 实际应用中这里应该打开导入对话框
}

// 导出项目
const handleExportProjects = () => {
  ElMessage.success('项目导出中...')
  // 实际应用中这里应该导出项目数据
}

// 刷新列表
const handleRefresh = () => {
  ElMessage.success('列表已刷新')
  // 实际应用中这里应该重新加载项目数据
}

// 编辑项目
const handleEdit = (row: any) => {
  isEditMode.value = true
  projectForm.value = {
    name: row.name,
    category: [row.category],
    description: '',
    status: row.status
  }
  dialogVisible.value = true
}

// 删除项目
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = projects.value.findIndex(p => p.id === row.id)
    if (index !== -1) {
      projects.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 查看项目
const handleViewProject = (project: any) => {
  ElMessage.info(`查看项目：${project.name}`)
}

// 卡片操作
const handleCardAction = (command: string, project: any) => {
  if (command === 'edit') {
    handleEdit(project)
  } else if (command === 'archive') {
    handleArchive(project)
  } else if (command === 'delete') {
    handleDelete(project)
  }
}

// 开始编辑名称
const startEditName = (project: any) => {
  editingName.value = project.id
}

// 完成编辑名称
const handleNameBlur = (project: any) => {
  if (editingName.value) {
    editingName.value = null
    ElMessage.success('项目名称已更新')
  }
}

// 归档项目
const handleArchive = (project: any) => {
  ElMessageBox.confirm('确定要归档该项目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('归档成功')
  }).catch(() => {})

// 重置表单
const resetForm = () => {
  projectForm.value = {
    name: '',
    category: [] as string[],
    description: '',
    status: ''
  }
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        ElMessage.success('更新成功')
      } else {
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.project-view-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;

  // 左侧边栏
  .sidebar {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .sidebar-section {
      background-color: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--el-border-color-light);
      }

      // 分类树形导航
      .category-tree {
        :deep(.el-tree-node__content) {
          padding: 8px 0;
          border-radius: 6px;
          transition: all 0.3s;

          &:hover {
            background-color: var(--el-fill-color-light);
          }
        }

        :deep(.el-tree-node__content.is-current) {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }

        .tree-node {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;

          .node-count {
            margin-left: auto;
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }

      // 项目统计信息
      .stats-container {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background-color: var(--el-fill-color-lighter);
          transition: all 0.3s;

          &:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }

          .stat-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            font-size: 20px;
          }

          .stat-content {
            flex: 1;

            .stat-value {
              font-size: 24px;
              font-weight: 600;
              color: var(--el-text-color-primary);
              line-height: 1.2;
            }

            .stat-label {
              font-size: 13px;
              color: var(--el-text-color-secondary);
              margin-top: 4px;
            }
          }
        }
      }

      // 快速操作区域
      .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .quick-action-btn {
          width: 100%;
          justify-content: flex-start;
          padding: 12px 16px;
          border-radius: 8px;
          transition: all 0.3s;

          &:hover {
            transform: translateX(4px);
          }

          &:active {
            transform: translateX(0);
          }
        }
      }
    }
  }

  // 主内容区
  .main-content {
    flex: 1;
    min-width: 0;
  }

// 顶部操作栏
.top-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .create-button {
    flex-shrink: 0;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .search-input {
    flex: 1;
    max-width: 400px;

    :deep(.el-input__wrapper) {
      border-radius: 20px;
      padding: 4px 16px;
    }
  }

  .view-toggle {
    flex-shrink: 0;

    :deep(.el-radio-button) {
      padding: 8px 16px;
      border-radius: 8px;

      &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }

  .filter-group {
    display: flex;
    gap: 12px;
    flex-shrink: 0;

    .filter-select {
      width: 160px;

      :deep(.el-input__wrapper) {
        border-radius: 8px;
      }
    }
  }
}

// 项目列表视图
.project-list {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .project-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .project-icon {
      color: var(--el-color-primary);
      font-size: 18px;
    }
  }
}

// 项目网格视图
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 20px;

  // 空状态
  .empty-state {
    grid-column: 1 / -1;
    padding: 60px 20px;
    text-align: center;
  }

  // 项目卡片
  .project-card {
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 16px;
    overflow: hidden;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    :deep(.el-card__body) {
      padding: 0;
    }

    // 卡片封面
    .card-cover {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-7) 100%);
      transition: all 0.3s;

      .cover-icon {
        color: var(--el-color-primary);
      }

      &:hover {
        background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-6) 100%);
      }
    }

    // 卡片内容
    .card-body {
      padding: 20px;

      // 卡片标题
      .card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        gap: 8px;

        .project-name {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          transition: all 0.3s;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid transparent;

          &:hover,
          &:focus {
            background-color: var(--el-fill-color-light);
            border-color: var(--el-border-color);
            outline: none;
          }

          &[contenteditable="true"] {
            background-color: var(--el-fill-color-light);
            border-color: var(--el-color-primary);
          }
        }
      }

      // 卡片描述
      .card-description {
        font-size: 14px;
        color: var(--el-text-color-regular);
        line-height: 1.6;
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 44px;
      }

      // 卡片标签
      .card-tags {
        margin-bottom: 16px;
      }

      // 卡片底部
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid var(--el-border-color-lighter);

        .update-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

// 对话框样式
:deep(.el-dialog) {
  border-radius: 12px;

  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-light);
  }
}
</style>
