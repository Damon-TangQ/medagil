<template>
  <div class="mobile-projects">
    <!-- 顶部导航栏 -->
    <div class="header">
      <h1 class="title">我的项目</h1>
      <div class="header-actions">
        <el-button circle text @click="handleCreateProject">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="projects-container" ref="projectsContainer">
      <el-pull-refresh
        v-model="loading"
        @refresh="handleRefresh"
      >
        <div v-if="projects.length === 0" class="empty-state">
          <el-icon :size="64" color="#909399"><FolderOpened /></el-icon>
          <p class="empty-text">暂无项目</p>
          <el-button type="primary" @click="handleCreateProject">
            创建第一个项目
          </el-button>
        </div>

        <div v-else class="projects-list">
          <div
            v-for="project in projects"
            :key="project.id"
            class="project-card"
            @click="handleViewProject(project)"
          >
            <div class="card-header">
              <div class="project-icon">
                <el-icon :size="32"><Folder /></el-icon>
              </div>
              <div class="project-info">
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-desc">{{ project.description }}</p>
              </div>
            </div>
            <div class="card-footer">
              <div class="project-meta">
                <span class="meta-item">
                  <el-icon><Clock /></el-icon>
                  {{ project.updateTime }}
                </span>
                <span class="meta-item">
                  <el-icon><Document /></el-icon>
                  {{ project.fileCount }} 个文件
                </span>
              </div>
              <el-dropdown trigger="click" @command="(cmd) => handleCardAction(cmd, project)">
                <el-button circle text size="small">
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
        </div>
      </el-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Folder,
  FolderOpened,
  Clock,
  Document,
  MoreFilled,
  Edit,
  Box,
  Delete
} from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 项目列表
const projects = ref([
  {
    id: '1',
    name: '心血管疾病风险预测模型',
    description: '基于机器学习的心血管疾病风险预测模型研究',
    fileCount: 12,
    updateTime: '2024-01-15'
  },
  {
    id: '2',
    name: '药物相互作用分析',
    description: '分析多种药物之间的相互作用机制',
    fileCount: 8,
    updateTime: '2024-01-14'
  },
  {
    id: '3',
    name: '临床试验数据可视化',
    description: '开发交互式数据可视化工具',
    fileCount: 15,
    updateTime: '2024-01-13'
  }
])

// 刷新列表
const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
  }, 1000)
}

// 创建项目
const handleCreateProject = () => {
  ElMessage.info('打开创建项目对话框')
}

// 查看项目
const handleViewProject = (project: any) => {
  ElMessage.success(`打开项目：${project.name}`)
}

// 卡片操作
const handleCardAction = (command: string, project: any) => {
  if (command === 'edit') {
    ElMessage.info(`编辑项目：${project.name}`)
  } else if (command === 'archive') {
    ElMessageBox.confirm('确定要归档该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('归档成功')
    }).catch(() => {})
  } else if (command === 'delete') {
    ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('删除成功')
    }).catch(() => {})
  }
}
</script>

<style scoped lang="scss">
.mobile-projects {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;

  // 顶部导航栏
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  // 项目列表容器
  .projects-container {
    flex: 1;
    overflow-y: auto;

    // 空状态
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 40px 20px;

      .empty-text {
        font-size: 16px;
        color: #909399;
        margin: 20px 0 30px;
      }
    }

    // 项目列表
    .projects-list {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .project-card {
        background-color: #fff;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;

        &:active {
          transform: scale(0.98);
        }

        .card-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;

          .project-icon {
            flex-shrink: 0;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;

            .el-icon {
              color: #fff;
            }
          }

          .project-info {
            flex: 1;
            min-width: 0;

            .project-name {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
              margin: 0 0 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .project-desc {
              font-size: 14px;
              color: #909399;
              margin: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;

          .project-meta {
            display: flex;
            gap: 16px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: #909399;

              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
