<template>
  <div class="dashboard-container">
    <!-- 侧边栏管理导航 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>管理控制台</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="tasks">
          <el-icon><Monitor /></el-icon>
          <span>任务监控</span>
        </el-menu-item>
        <el-menu-item index="finance">
          <el-icon><Money /></el-icon>
          <span>财务管理</span>
        </el-menu-item>
        <el-menu-item index="content">
          <el-icon><Document /></el-icon>
          <span>内容审核</span>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部关键指标卡片 -->
      <div class="metrics-grid">
        <el-card class="metric-card" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: rgba(var(--el-color-primary-rgb), 0.1)">
              <el-icon :size="32" color="var(--el-color-primary)"><DataBoard /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">2,458</div>
              <div class="metric-label">总用户数</div>
            </div>
          </div>
          <div class="metric-trend">
            <el-icon color="var(--el-color-success)"><Top /></el-icon>
            <span class="trend-value">+12.5%</span>
            <span class="trend-label">较上月</span>
          </div>
        </el-card>

        <el-card class="metric-card" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: rgba(var(--el-color-success-rgb), 0.1)">
              <el-icon :size="32" color="var(--el-color-success)"><User /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">324</div>
              <div class="metric-label">今日活跃用户</div>
            </div>
          </div>
          <div class="metric-trend">
            <el-icon color="var(--el-color-success)"><Top /></el-icon>
            <span class="trend-value">+8.3%</span>
            <span class="trend-label">较昨日</span>
          </div>
        </el-card>

        <el-card class="metric-card" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: rgba(var(--el-color-warning-rgb), 0.1)">
              <el-icon :size="32" color="var(--el-color-warning)"><Money /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">¥45,820</div>
              <div class="metric-label">本月收入</div>
            </div>
          </div>
          <div class="metric-trend">
            <el-icon color="var(--el-color-success)"><Top /></el-icon>
            <span class="trend-value">+23.1%</span>
            <span class="trend-label">较上月</span>
          </div>
        </el-card>

        <el-card class="metric-card" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon" style="background-color: rgba(var(--el-color-info-rgb), 0.1)">
              <el-icon :size="32" color="var(--el-color-info)"><CircleCheck /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">98.5%</div>
              <div class="metric-label">任务成功率</div>
            </div>
          </div>
          <div class="metric-trend">
            <el-icon color="var(--el-color-success)"><Top /></el-icon>
            <span class="trend-value">+2.3%</span>
            <span class="trend-label">较上周</span>
          </div>
        </el-card>
      </div>

      <!-- 中部图表区域 -->
      <div class="charts-grid">
        <!-- 用户增长趋势折线图 -->
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="userGrowthPeriod" size="small">
                <el-radio-button value="week">周</el-radio-button>
                <el-radio-button value="month">月</el-radio-button>
                <el-radio-button value="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="userGrowthChart"></div>
        </el-card>

        <!-- 任务类型分布饼图 -->
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>任务类型分布</span>
            </div>
          </template>
          <div class="chart-container" ref="taskTypeChart"></div>
        </el-card>

        <!-- 收入变化面积图 -->
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>收入变化趋势</span>
              <el-radio-group v-model="incomePeriod" size="small">
                <el-radio-button value="week">周</el-radio-button>
                <el-radio-button value="month">月</el-radio-button>
                <el-radio-button value="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="incomeChart"></div>
        </el-card>

        <!-- 智能体使用热度图 -->
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>智能体使用热度</span>
            </div>
          </template>
          <div class="chart-container" ref="agentHeatmapChart"></div>
        </el-card>
      </div>

      <!-- 底部数据表格 -->
      <div class="tables-grid">
        <!-- 最新用户注册列表 -->
        <el-card class="table-card" shadow="hover">
          <template #header>
            <div class="table-header">
              <span>最新用户注册</span>
              <el-button text @click="handleViewAllUsers">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentUsers" stripe>
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="registerTime" label="注册时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'warning'" size="small">
                  {{ row.status === 'active' ? '已激活' : '待激活' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 异常任务监控 -->
        <el-card class="table-card" shadow="hover">
          <template #header>
            <div class="table-header">
              <span>异常任务监控</span>
              <el-badge :value="abnormalTasks.length" class="badge-item">
                <el-button text>查看全部</el-button>
              </el-badge>
            </div>
          </template>
          <el-table :data="abnormalTasks" stripe>
            <el-table-column prop="taskId" label="任务ID" width="100" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="error" label="错误信息" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'pending' ? 'warning' : 'danger'" size="small">
                  {{ row.status === 'pending' ? '处理中' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 系统状态监控面板 -->
        <el-card class="status-card" shadow="hover">
          <template #header>
            <div class="table-header">
              <span>系统状态监控</span>
              <el-tag :type="systemStatus.health === 'good' ? 'success' : 'warning'" size="small">
                {{ systemStatus.health === 'good' ? '运行正常' : '需要注意' }}
              </el-tag>
            </div>
          </template>
          <div class="status-panel">
            <div class="status-item">
              <div class="status-label">CPU 使用率</div>
              <el-progress :percentage="systemStatus.cpu" :color="getProgressColor(systemStatus.cpu)" />
            </div>
            <div class="status-item">
              <div class="status-label">内存使用率</div>
              <el-progress :percentage="systemStatus.memory" :color="getProgressColor(systemStatus.memory)" />
            </div>
            <div class="status-item">
              <div class="status-label">磁盘使用率</div>
              <el-progress :percentage="systemStatus.disk" :color="getProgressColor(systemStatus.disk)" />
            </div>
            <div class="status-item">
              <div class="status-label">网络流量</div>
              <el-progress :percentage="systemStatus.network" :color="getProgressColor(systemStatus.network)" />
            </div>
            <div class="status-item">
              <div class="status-label">数据库连接</div>
              <el-progress :percentage="systemStatus.database" :color="getProgressColor(systemStatus.database)" />
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  DataBoard,
  User,
  Monitor,
  Money,
  Document,
  Setting,
  Top,
  CircleCheck
} from '@element-plus/icons-vue'

// 当前激活的菜单
const activeMenu = ref('dashboard')

// 用户增长趋势周期
const userGrowthPeriod = ref('month')

// 收入变化周期
const incomePeriod = ref('month')

// 最新用户数据
const recentUsers = ref([
  { username: 'user001', email: 'user001@example.com', registerTime: '2024-01-15 10:30', status: 'active' },
  { username: 'user002', email: 'user002@example.com', registerTime: '2024-01-15 09:45', status: 'active' },
  { username: 'user003', email: 'user003@example.com', registerTime: '2024-01-15 08:20', status: 'pending' },
  { username: 'user004', email: 'user004@example.com', registerTime: '2024-01-14 23:15', status: 'active' },
  { username: 'user005', email: 'user005@example.com', registerTime: '2024-01-14 21:30', status: 'active' }
])

// 异常任务数据
const abnormalTasks = ref([
  { taskId: 'TASK001', type: '文档分析', error: '超时错误', status: 'pending' },
  { taskId: 'TASK002', type: '数据同步', error: '连接失败', status: 'failed' },
  { taskId: 'TASK003', type: 'AI对话', error: '服务异常', status: 'pending' },
  { taskId: 'TASK004', type: '文件上传', error: '格式不支持', status: 'failed' },
  { taskId: 'TASK005', type: '任务调度', error: '资源不足', status: 'pending' }
])

// 系统状态数据
const systemStatus = ref({
  health: 'good',
  cpu: 45,
  memory: 62,
  disk: 78,
  network: 34,
  database: 55
})

// 图表实例
let userGrowthChartInstance: echarts.ECharts | null = null
let taskTypeChartInstance: echarts.ECharts | null = null
let incomeChartInstance: echarts.ECharts | null = null
let agentHeatmapChartInstance: echarts.ECharts | null = null

// 图表容器引用
const userGrowthChart = ref<HTMLElement>()
const taskTypeChart = ref<HTMLElement>()
const incomeChart = ref<HTMLElement>()
const agentHeatmapChart = ref<HTMLElement>()

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 50) return 'var(--el-color-success)'
  if (percentage < 80) return 'var(--el-color-warning)'
  return 'var(--el-color-danger)'
}

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  ElMessage.info(`切换到：${index}`)
}

// 查看所有用户
const handleViewAllUsers = () => {
  ElMessage.info('跳转到用户管理页面')
}

// 初始化用户增长趋势图
const initUserGrowthChart = () => {
  if (!userGrowthChart.value) return

  userGrowthChartInstance = echarts.init(userGrowthChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        },
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  userGrowthChartInstance.setOption(option)
}

// 初始化任务类型分布图
const initTaskTypeChart = () => {
  if (!taskTypeChart.value) return

  taskTypeChartInstance = echarts.init(taskTypeChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '任务类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '文档分析' },
          { value: 735, name: 'AI对话' },
          { value: 580, name: '数据同步' },
          { value: 484, name: '任务调度' },
          { value: 300, name: '其他' }
        ]
      }
    ]
  }
  taskTypeChartInstance.setOption(option)
}

// 初始化收入变化图
const initIncomeChart = () => {
  if (!incomeChart.value) return

  incomeChartInstance = echarts.init(incomeChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [12000, 13200, 10100, 13400, 9000, 23000],
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  incomeChartInstance.setOption(option)
}

// 初始化智能体使用热度图
const initAgentHeatmapChart = () => {
  if (!agentHeatmapChart.value) return

  agentHeatmapChartInstance = echarts.init(agentHeatmapChart.value)
  const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p']
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const data: [string, string, number][] = []
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      data.push([j.toString(), i.toString(), Math.floor(Math.random() * 10)])
    }
  }

  const option = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [
      {
        name: '使用热度',
        type: 'heatmap',
        data: data,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  agentHeatmapChartInstance.setOption(option)
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  userGrowthChartInstance?.resize()
  taskTypeChartInstance?.resize()
  incomeChartInstance?.resize()
  agentHeatmapChartInstance?.resize()
}

onMounted(() => {
  // 初始化所有图表
  initUserGrowthChart()
  initTaskTypeChart()
  initIncomeChart()
  initAgentHeatmapChart()

  // 添加窗口大小改变事件监听
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 销毁图表实例
  userGrowthChartInstance?.dispose()
  taskTypeChartInstance?.dispose()
  incomeChartInstance?.dispose()
  agentHeatmapChartInstance?.dispose()

  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;

  // 侧边栏
  .sidebar {
    width: 240px;
    background-color: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid var(--el-border-color-light);

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .sidebar-menu {
      border: none;

      :deep(.el-menu-item) {
        height: 48px;
        line-height: 48px;
        margin: 4px 12px;
        border-radius: 8px;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        &.is-active {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);

          &::before {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 24px;
            background-color: var(--el-color-primary);
            border-radius: 0 2px 2px 0;
            content: '';
          }
        }
      }
    }
  }

  // 主内容区
  .main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;

    // 顶部关键指标卡片
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;

      .metric-card {
        border-radius: 12px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .metric-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;

          .metric-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border-radius: 12px;
          }

          .metric-info {
            flex: 1;

            .metric-value {
              font-size: 28px;
              font-weight: 600;
              color: var(--el-text-color-primary);
              line-height: 1.2;
            }

            .metric-label {
              font-size: 14px;
              color: var(--el-text-color-secondary);
              margin-top: 4px;
            }
          }
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding-top: 16px;
          border-top: 1px solid var(--el-border-color-lighter);

          .trend-value {
            font-weight: 600;
            color: var(--el-color-success);
          }

          .trend-label {
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }

    // 中部图表区域
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;

      .chart-card {
        border-radius: 12px;
        height: 400px;

        :deep(.el-card__header) {
          padding: 16px 20px;
          border-bottom: 1px solid var(--el-border-color-light);
        }

        :deep(.el-card__body) {
          height: calc(100% - 60px);
          padding: 16px 20px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
        }

        .chart-container {
          width: 100%;
          height: 100%;
        }
      }
    }

    // 底部数据表格
    .tables-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      .table-card,
      .status-card {
        border-radius: 12px;

        :deep(.el-card__header) {
          padding: 16px 20px;
          border-bottom: 1px solid var(--el-border-color-light);
        }

        :deep(.el-card__body) {
          padding: 16px 20px;
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .badge-item {
            :deep(.el-badge__content) {
              transform: translateY(50%);
            }
          }
        }
      }

      .status-card {
        .status-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .status-item {
            .status-label {
              font-size: 14px;
              color: var(--el-text-color-regular);
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }
}

// 响应式布局
/* 大屏 > 1440px */
@media (min-width: 1441px) {
  .dashboard-container {
    .sidebar {
      width: 280px;
    }
    
    .main-content {
      max-width: calc(100% - 280px);
      padding: 32px;
      
      .metrics-grid {
        gap: 28px;
      }
      
      .charts-grid {
        gap: 28px;
      }
      
      .tables-grid {
        gap: 28px;
      }
    }
  }
}

/* 桌面端 1024px - 1440px */
@media (min-width: 1024px) and (max-width: 1440px) {
  .dashboard-container {
    .sidebar {
      width: 260px;
    }
    
    .main-content {
      max-width: calc(100% - 260px);
      padding: 24px;
    }
  }
}

/* 平板端 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .dashboard-container {
    .sidebar {
      width: 200px;
    }
    
    .main-content {
      max-width: calc(100% - 200px);
      padding: 20px;
      
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .tables-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      
      .chart-card {
        height: 380px;
      }
    }
  }
}

/* 移动端 < 768px */
@media (max-width: 767px) {
  .dashboard-container {
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1000;
      transform: translateX(-100%);
      width: 280px;
      box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
    }
    
    .sidebar.sidebar-visible {
      transform: translateX(0);
    }
    
    .main-content {
      max-width: 100%;
      padding: 16px;
      
      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .tables-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .chart-card {
        height: 340px;
      }
    }
  }
}
</style>
