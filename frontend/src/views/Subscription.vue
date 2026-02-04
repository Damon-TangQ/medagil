<template>
  <div class="subscription-container">
    <!-- 当前订阅信息 -->
    <el-card class="current-subscription">
      <template #header>
        <div class="card-header">
          <span class="card-title">当前订阅</span>
          <el-tag :type="getSubscriptionType(user?.subscriptionLevel)">
            {{ getSubscriptionName(user?.subscriptionLevel) }}
          </el-tag>
        </div>
      </template>

      <div class="subscription-content">
        <div class="info-row">
          <span class="label">到期时间：</span>
          <span class="value">{{ formatDate(user?.subscriptionExpireTime) }}</span>
        </div>

        <div class="usage-stats">
          <div class="usage-item">
            <div class="usage-bar">
              <div
                class="usage-progress"
                :style="{ width: getUsageProgress(stats.projectCount, subscriptionConfig.maxProjects) + '%' }"
              />
            </div>
            <div class="usage-info">
              <span class="usage-label">项目</span>
              <span class="usage-text">{{ stats.projectCount }} / {{ subscriptionConfig.maxProjects === -1 ? '无限制' : subscriptionConfig.maxProjects }}</span>
            </div>
          </div>

          <div class="usage-item">
            <div class="usage-bar">
              <div
                class="usage-progress"
                :style="{ width: getUsageProgress(stats.taskCount, subscriptionConfig.maxTasksPerMonth) + '%' }"
              />
            </div>
            <div class="usage-info">
              <span class="usage-label">任务</span>
              <span class="usage-text">{{ stats.taskCount }} / {{ subscriptionConfig.maxTasksPerMonth === -1 ? '无限制' : subscriptionConfig.maxTasksPerMonth }}</span>
            </div>
          </div>

          <div class="usage-item">
            <div class="usage-bar">
              <div
                class="usage-progress"
                :style="{ width: getUsageProgress(stats.aiCallCount, subscriptionConfig.maxAiCallsPerMonth) + '%' }"
              />
            </div>
            <div class="usage-info">
              <span class="usage-label">AI调用</span>
              <span class="usage-text">{{ stats.aiCallCount }} / {{ subscriptionConfig.maxAiCallsPerMonth === -1 ? '无限制' : subscriptionConfig.maxAiCallsPerMonth }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 订阅套餐 -->
    <div class="plans-section">
      <h2 class="section-title">选择订阅套餐</h2>

      <div class="plans-grid">
        <div
          v-for="plan in subscriptionPlans"
          :key="plan.level"
          :class="['plan-card', { active: plan.level === user?.subscriptionLevel, recommended: plan.recommended }]"
        >
          <div v-if="plan.recommended" class="recommended-badge">推荐</div>

          <div class="plan-header">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price">¥{{ plan.price }}</span>
              <span class="unit">/月</span>
            </div>
          </div>

          <div class="plan-features">
            <div
              v-for="feature in plan.features"
              :key="feature.label"
              class="feature-item"
            >
              <el-icon class="feature-icon"><Check /></el-icon>
              <span>{{ feature.label }}</span>
            </div>
          </div>

          <el-button
            :type="plan.level === user?.subscriptionLevel ? 'info' : 'primary'"
            :disabled="plan.level === user?.subscriptionLevel"
            class="plan-button"
            @click="handleSubscribe(plan)"
          >
            {{ plan.level === user?.subscriptionLevel ? '当前套餐' : '立即订阅' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 订阅记录 -->
    <el-card class="subscription-records">
      <template #header>
        <span class="card-title">订阅记录</span>
      </template>

      <el-table :data="records" v-loading="recordsLoading">
        <el-table-column prop="subscriptionName" label="套餐名称" />
        <el-table-column prop="amount" label="金额">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template #default="{ row }">
            {{ formatDate(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
          <template #default="{ row }">
            {{ formatDate(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="状态">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.paymentStatus)">
              {{ getPaymentStatusName(row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 支付对话框 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="确认支付"
      width="400px"
    >
      <div class="payment-content">
        <div class="payment-info">
          <span class="label">订阅套餐：</span>
          <span class="value">{{ selectedPlan?.name }}</span>
        </div>
        <div class="payment-info">
          <span class="label">支付金额：</span>
          <span class="value price">¥{{ selectedPlan?.price }}</span>
        </div>

        <div class="payment-methods">
          <div class="method-title">选择支付方式</div>
          <el-radio-group v-model="paymentMethod">
            <el-radio label="wechat">
              <el-icon><WechatPay /></el-icon>
              微信支付
            </el-radio>
            <el-radio label="alipay">
              <el-icon><Alipay /></el-icon>
              支付宝
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <template #footer>
        <el-button @click="paymentDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="paymentLoading" @click="handlePayment">
          确认支付
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@/icons-vue'
import { getCurrentUser, getUserSubscriptionRecords, createSubscriptionOrder } from '@/api'
import { formatDate, storage, SUBSCRIPTION_LEVEL, SUBSCRIPTION_LEVEL_NAMES, PAYMENT_STATUS, PAYMENT_STATUS_NAMES } from '@/shared'

// 用户信息
const user = ref<any>(null)

// 使用统计
const stats = ref({
  projectCount: 0,
  taskCount: 0,
  aiCallCount: 0
})

// 订阅配置
const subscriptionConfig = computed(() => {
  const level = user.value?.subscriptionLevel || SUBSCRIPTION_LEVEL.FREE
  return {
    maxProjects: level === SUBSCRIPTION_LEVEL.FREE ? 3 : level === SUBSCRIPTION_LEVEL.BASIC ? 10 : -1,
    maxTasksPerMonth: level === SUBSCRIPTION_LEVEL.FREE ? 10 : level === SUBSCRIPTION_LEVEL.BASIC ? 100 : -1,
    maxAiCallsPerMonth: level === SUBSCRIPTION_LEVEL.FREE ? 50 : level === SUBSCRIPTION_LEVEL.BASIC ? 500 : -1
  }
})

// 订阅套餐
const subscriptionPlans = ref([
  {
    level: SUBSCRIPTION_LEVEL.FREE,
    name: '免费版',
    price: 0,
    recommended: false,
    features: [
      { label: '最多创建 3 个项目' },
      { label: '每月 10 次任务' },
      { label: '每月 50 次 AI 调用' },
      { label: '基础功能' }
    ]
  },
  {
    level: SUBSCRIPTION_LEVEL.BASIC,
    name: '基础版',
    price: 99,
    recommended: true,
    features: [
      { label: '最多创建 10 个项目' },
      { label: '每月 100 次任务' },
      { label: '每月 500 次 AI 调用' },
      { label: '高级功能' },
      { label: '优先客服' }
    ]
  },
  {
    level: SUBSCRIPTION_LEVEL.PREMIUM,
    name: '高级版',
    price: 299,
    recommended: false,
    features: [
      { label: '无限制项目数量' },
      { label: '无限制任务次数' },
      { label: '无限制 AI 调用' },
      { label: '所有高级功能' },
      { label: '专属客服' },
      { label: 'API 访问' }
    ]
  }
])

// 订阅记录
const records = ref<any[]>([])
const recordsLoading = ref(false)

// 支付
const paymentDialogVisible = ref(false)
const paymentLoading = ref(false)
const paymentMethod = ref('wechat')
const selectedPlan = ref<any>(null)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getCurrentUser()
    if (response.success && response.data) {
      user.value = response.data
      storage.set('user', response.data)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取订阅记录
const fetchSubscriptionRecords = async () => {
  recordsLoading.value = true
  try {
    const response = await getUserSubscriptionRecords()
    if (response.success && response.data) {
      records.value = response.data.records
    }
  } catch (error) {
    console.error('获取订阅记录失败:', error)
  } finally {
    recordsLoading.value = false
  }
}

// 订阅
const handleSubscribe = (plan: any) => {
  if (plan.level === user.value?.subscriptionLevel) {
    return
  }

  if (plan.level === SUBSCRIPTION_LEVEL.FREE) {
    ElMessage.info('您当前已经是免费版用户')
    return
  }

  selectedPlan.value = plan
  paymentDialogVisible.value = true
}

// 支付
const handlePayment = async () => {
  if (!selectedPlan.value) {
    return
  }

  paymentLoading.value = true
  try {
    const response = await createSubscriptionOrder({
      subscriptionId: selectedPlan.value.id,
      paymentMethod: paymentMethod.value
    })

    if (response.success && response.data) {
      // TODO: 跳转到支付页面或打开支付二维码
      ElMessage.success('订单创建成功')
      paymentDialogVisible.value = false

      // 模拟支付成功
      setTimeout(() => {
        ElMessage.success('支付成功')
        fetchUserInfo()
        fetchSubscriptionRecords()
      }, 2000)
    }
  } catch (error) {
    console.error('支付失败:', error)
  } finally {
    paymentLoading.value = false
  }
}

// 获取订阅类型
const getSubscriptionType = (level?: number) => {
  return level === SUBSCRIPTION_LEVEL.PREMIUM ? 'danger' : level === SUBSCRIPTION_LEVEL.BASIC ? 'warning' : 'info'
}

// 获取订阅名称
const getSubscriptionName = (level?: number) => {
  return level !== undefined ? SUBSCRIPTION_LEVEL_NAMES[level as keyof typeof SUBSCRIPTION_LEVEL_NAMES] : '未知'
}

// 获取支付状态类型
const getPaymentStatusType = (status: number) => {
  return status === PAYMENT_STATUS.PAID ? 'success' : status === PAYMENT_STATUS.CANCELLED ? 'info' : 'warning'
}

// 获取支付状态名称
const getPaymentStatusName = (status: number) => {
  return PAYMENT_STATUS_NAMES[status as keyof typeof PAYMENT_STATUS_NAMES] || '未知'
}

// 计算使用进度
const getUsageProgress = (current: number, max: number) => {
  if (max === -1) {
    return 0
  }
  return Math.min((current / max) * 100, 100)
}

onMounted(() => {
  fetchUserInfo()
  fetchSubscriptionRecords()
})
</script>

<style scoped>
.subscription-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.current-subscription {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.subscription-content {
  padding: 16px 0;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.info-row .label {
  color: #606266;
  margin-right: 12px;
}

.info-row .value {
  color: #303133;
  font-weight: 500;
}

.usage-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.usage-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.usage-bar {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.usage-progress {
  height: 100%;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  transition: width 0.3s;
}

.usage-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.usage-label {
  color: #909399;
}

.usage-text {
  color: #606266;
}

.plans-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.plan-card {
  position: relative;
  padding: 24px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.plan-card:hover {
  border-color: #409eff;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.plan-card.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.plan-card.recommended {
  border-color: #67c23a;
}

.recommended-badge {
  position: absolute;
  top: -12px;
  right: 24px;
  padding: 4px 12px;
  background: #67c23a;
  color: white;
  border-radius: 12px;
  font-size: 12px;
}

.plan-header {
  text-align: center;
  margin-bottom: 24px;
}

.plan-name {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
}

.unit {
  color: #909399;
}

.plan-features {
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #606266;
}

.feature-icon {
  color: #67c23a;
  font-size: 16px;
}

.plan-button {
  width: 100%;
}

.subscription-records {
  margin-bottom: 24px;
}

.payment-content {
  padding: 16px 0;
}

.payment-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 16px;
}

.payment-info .label {
  color: #606266;
}

.payment-info .value {
  color: #303133;
  font-weight: 500;
}

.payment-info .value.price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: 700;
}

.payment-methods {
  margin-top: 24px;
}

.method-title {
  margin-bottom: 12px;
  color: #606266;
}

.el-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.el-radio .el-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .subscription-container {
    padding: 16px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
