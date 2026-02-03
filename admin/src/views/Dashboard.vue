<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="page-title">数据看板</h1>
      <div class="header-actions">
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <div class="metrics-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="(metric, index) in metrics" :key="index">
          <el-card class="metric-card" shadow="hover">
            <div class="metric-content">
              <div class="metric-icon" :style="{ backgroundColor: metric.color }">
                <el-icon :size="24">
                  <component :is="metric.icon" />
                </el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-trend" :class="metric.trend > 0 ? 'positive' : 'negative'">
                  <el-icon>
                    <component :is="metric.trend > 0 ? TrendCharts : Bottom" />
                  </el-icon>
                  <span>{{ Math.abs(metric.trend) }}%</span>
                  <span class="trend-text">较上期</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">增长趋势</span>
                <el-radio-group v-model="trendPeriod" size="small">
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div ref="trendChartRef" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <span class="card-title">用户分布</span>
            </template>
            <div ref="userChartRef" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 最近活动和系统状态 -->
    <div class="bottom-container">
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <el-card class="activity-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">最近活动</span>
                <el-button type="primary" link @click="viewAllActivities">查看全部</el-button>
              </div>
            </template>
            <div class="activity-list">
              <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                <div class="activity-icon">
                  <el-icon :size="20" :color="activity.color">
                    <component :is="activity.icon" />
                  </el-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-desc">{{ activity.description }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-card class="status-card" shadow="hover">
            <template #header>
              <span class="card-title">系统状态</span>
            </template>
            <div class="status-list">
              <div v-for="(status, index) in systemStatus" :key="index" class="status-item">
                <div class="status-label">{{ status.label }}</div>
                <div class="status-indicator">
                  <el-tag :type="status.type" size="small">
                    {{ status.value }}
                  </el-tag>
                  <el-progress
                    :percentage="status.progress"
                    :color="status.type === 'success' ? '#67c23a' : status.type === 'warning' ? '#e6a23c' : '#f56c6c'"
                    :stroke-width="6"
                  />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  User,
  Money,
  Document,
  TrendCharts,
  Bottom,
  CircleCheck,
  Warning,
  UserFilled,
  Setting
} from '@element-plus/icons-vue'

// 日期范围
const dateRange = ref<[Date, Date]>([
  new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  new Date()
])

// 趋势周期
const trendPeriod = ref('week')

// 图表引用
const trendChartRef = ref<HTMLElement>()
const userChartRef = ref<HTMLElement>()

// 图表实例
let trendChartInstance: echarts.ECharts | null = null
let userChartInstance: echarts.ECharts | null = null

// 关键指标
const metrics = ref([
  {
    label: '总用户数',
    value: '12,580',
    icon: User,
    color: '#409eff',
    trend: 12.5
  },
  {
    label: '活跃用户',
    value: '8,420',
    icon: UserFilled,
    color: '#67c23a',
    trend: 8.3
  },
  {
    label: '任务总数',
    value: '45,620',
    icon: Document,
    color: '#e6a23c',
    trend: -2.4
  },
  {
    label: '总收入',
    value: '¥328,500',
    icon: Money,
    color: '#f56c6c',
    trend: 15.7
  }
])

// 最近活动
const recentActivities = ref([
  {
    title: '新用户注册',
    description: '用户 张三 完成了注册',
    time: '5分钟前',
    icon: UserFilled,
    color: '#409eff'
  },
  {
    title: '任务完成',
    description: '项目 "市场分析报告" 任务已完成',
    time: '15分钟前',
    icon: CircleCheck,
    color: '#67c23a'
  },
  {
    title: '系统警告',
    description: 'API响应时间超过阈值',
    time: '30分钟前',
    icon: Warning,
    color: '#e6a23c'
  },
  {
    title: '支付成功',
    description: '用户 李四 完成了高级版订阅',
    time: '1小时前',
    icon: Money,
    color: '#f56c6c'
  },
  {
    title: '系统更新',
    description: '系统已更新至 v1.2.3',
    time: '2小时前',
    icon: Setting,
    color: '#909399'
  }
])

// 系统状态
const systemStatus = ref([
  {
    label: '服务器状态',
    value: '正常',
    type: 'success',
    progress: 85
  },
  {
    label: '数据库连接',
    value: '良好',
    type: 'success',
    progress: 92
  },
  {
    label: 'API响应',
    value: '较慢',
    type: 'warning',
    progress: 68
  },
  {
    label: '存储空间',
    value: '充足',
    type: 'success',
    progress: 75
  }
])

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChartInstance = echarts.init(trendChartRef.value)

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
    legend: {
      data: ['用户数', '任务数', '收入']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '用户数',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '任务数',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '收入',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      }
    ]
  }

  trendChartInstance.setOption(option)
}

// 初始化用户分布图表
const initUserChart = () => {
  if (!userChartRef.value) return

  userChartInstance = echarts.init(userChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '用户分布',
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
          { value: 1048, name: '免费用户' },
          { value: 735, name: '基础版' },
          { value: 580, name: '高级版' },
          { value: 484, name: '企业版' }
        ]
      }
    ]
  }

  userChartInstance.setOption(option)
}

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已刷新')

  // 模拟数据更新
  metrics.value.forEach(metric => {
    const value = parseInt(metric.value.replace(/[^0-9]/g, ''))
    const change = Math.floor(Math.random() * 100) - 50
    const newValue = value + change
    metric.value = newValue.toLocaleString()
    metric.trend = +(Math.random() * 20 - 10).toFixed(1)
  })

  // 更新图表数据
  if (trendChartInstance) {
    const newData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 500))
    trendChartInstance.setOption({
      series: [
        { data: newData },
        { data: newData.map(v => v + Math.floor(Math.random() * 100)) },
        { data: newData.map(v => v + Math.floor(Math.random() * 200)) }
      ]
    })
  }
}

// 日期范围变化
const handleDateChange = () => {
  ElMessage.success('日期范围已更新')
  refreshData()
}

// 查看所有活动
const viewAllActivities = () => {
  ElMessage.info('跳转到活动列表页面')
  // 实际应用中这里应该跳转到活动列表页面
}

// 监听窗口大小变化
const handleResize = () => {
  trendChartInstance?.resize()
  userChartInstance?.resize()
}

// 监听趋势周期变化
watch(trendPeriod, () => {
  refreshData()
})

// 组件挂载
onMounted(() => {
  initTrendChart()
  initUserChart()

  window.addEventListener('resize', handleResize)
})

// 组件卸载
onBeforeUnmount(() => {
  trendChartInstance?.dispose()
  userChartInstance?.dispose()

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;

  .page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    color: #303133;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.metrics-container {
  margin-bottom: 20px;
}

.metric-card {
  margin-bottom: 20px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  color: #fff;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  &.positive {
    color: #67c23a;
  }

  &.negative {
    color: #f56c6c;
  }

  .trend-text {
    color: #909399;
    margin-left: 4px;
  }
}

.charts-container {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
  height: 400px;

  :deep(.el-card__body) {
    height: calc(100% - 55px);
    padding: 20px;
  }
}

.chart-container {
  height: 100%;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.bottom-container {
  margin-bottom: 20px;
}

.activity-card {
  height: 100%;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f7fa;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.status-card {
  height: 100%;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.status-indicator {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .chart-card {
    height: 300px;
  }
}
</style>
