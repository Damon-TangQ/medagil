<template>
  <div class="settings-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">个人中心与设置</h1>
      <p class="page-subtitle">管理您的个人信息、订阅和偏好设置</p>
    </div>

    <!-- 选项卡导航 -->
    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- 个人资料 -->
      <el-tab-pane label="个人资料" name="profile">
        <div class="tab-content">
          <el-card class="profile-card">
            <!-- 头像上传区域 -->
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <el-avatar :size="120" :src="userAvatar" class="avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  action="/api/upload"
                >
                  <el-button type="primary" circle class="upload-btn">
                    <el-icon><Camera /></el-icon>
                  </el-button>
                </el-upload>
              </div>
              <div class="avatar-tips">
                <p>点击相机图标上传头像</p>
                <p class="tips-text">支持 JPG、PNG 格式，最大 2MB</p>
              </div>
            </div>

            <!-- 基本信息表单 -->
            <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="profileForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="职业背景" prop="profession">
                <el-select v-model="profileForm.profession" placeholder="请选择职业背景">
                  <el-option label="临床医生" value="doctor" />
                  <el-option label="医学研究员" value="researcher" />
                  <el-option label="医学生" value="student" />
                  <el-option label="药剂师" value="pharmacist" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
              <el-form-item label="所在机构" prop="institution">
                <el-input v-model="profileForm.institution" placeholder="请输入所在机构" />
              </el-form-item>
              <el-form-item label="个人简介" prop="bio">
                <el-input
                  v-model="profileForm.bio"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入个人简介"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveProfile">保存修改</el-button>
                <el-button @click="handleResetProfile">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 订阅计划 -->
      <el-tab-pane label="订阅计划" name="subscription">
        <div class="tab-content">
          <!-- 当前计划展示卡片 -->
          <el-card class="current-plan-card">
            <div class="plan-header">
              <div class="plan-info">
                <h2 class="plan-title">当前计划：Pro</h2>
                <p class="plan-desc">有效期至：2024-12-31</p>
              </div>
              <el-tag type="success" size="large">已激活</el-tag>
            </div>
            <div class="plan-features">
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>无限次AI对话</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>高级文档分析</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>优先客服支持</span>
              </div>
            </div>
          </el-card>

          <!-- 套餐对比表格 -->
          <el-card class="plans-card">
            <h3 class="card-title">选择适合您的计划</h3>
            <div class="plans-table">
              <div class="plan-column free">
                <div class="plan-header">
                  <h4>Free</h4>
                  <div class="price">¥0<span class="period">/月</span></div>
                </div>
                <div class="plan-features">
                  <div class="feature-item">
                    <el-icon><Close /></el-icon>
                    <span>每日10次AI对话</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Close /></el-icon>
                    <span>基础文档分析</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Close /></el-icon>
                    <span>标准客服支持</span>
                  </div>
                </div>
                <el-button class="plan-btn" disabled>当前计划</el-button>
              </div>

              <div class="plan-column pro">
                <div class="plan-header">
                  <h4>Pro</h4>
                  <div class="price">¥99<span class="period">/月</span></div>
                  <el-tag type="success" size="small">推荐</el-tag>
                </div>
                <div class="plan-features">
                  <div class="feature-item">
                    <el-icon><Check /></el-icon>
                    <span>无限次AI对话</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Check /></el-icon>
                    <span>高级文档分析</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Check /></el-icon>
                    <span>优先客服支持</span>
                  </div>
                </div>
                <el-button type="primary" class="plan-btn" @click="handleUpgrade('pro')">升级到Pro</el-button>
              </div>

              <div class="plan-column max">
                <div class="plan-header">
                  <h4>Max</h4>
                  <div class="price">¥199<span class="period">/月</span></div>
                </div>
                <div class="plan-features">
                  <div class="feature-item">
                    <el-icon><Check /></el-icon>
                    <span>无限次AI对话</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Check /></el-icon>
                    <span>高级文档分析</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Check /></el-icon>
                    <span>专属客服支持</span>
                  </div>
                </div>
                <el-button type="primary" class="plan-btn" @click="handleUpgrade('max')">升级到Max</el-button>
              </div>
            </div>
          </el-card>

          <!-- 微信支付二维码 -->
          <el-dialog v-model="paymentDialogVisible" title="扫码支付" width="400px">
            <div class="payment-qr">
              <el-image :src="qrCodeUrl" class="qr-code" />
              <p class="payment-tips">请使用微信扫描二维码完成支付</p>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>

      <!-- 积分管理 -->
      <el-tab-pane label="积分管理" name="points">
        <div class="tab-content">
          <!-- 积分余额展示 -->
          <el-card class="points-card">
            <div class="points-balance">
              <div class="points-icon">
                <el-icon :size="48"><Coin /></el-icon>
              </div>
              <div class="points-info">
                <h2 class="points-value">{{ pointsBalance }}</h2>
                <p class="points-label">当前积分</p>
              </div>
              <el-button type="primary" @click="handleGetPoints">获取积分</el-button>
            </div>
          </el-card>

          <!-- 获取积分任务列表 -->
          <el-card class="tasks-card">
            <h3 class="card-title">获取积分任务</h3>
            <div class="tasks-list">
              <div v-for="task in pointsTasks" :key="task.id" class="task-item">
                <div class="task-info">
                  <h4>{{ task.title }}</h4>
                  <p>{{ task.description }}</p>
                </div>
                <div class="task-reward">
                  <span class="reward-value">+{{ task.points }}</span>
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleCompleteTask(task)"
                    :disabled="task.completed"
                  >
                    {{ task.completed ? '已完成' : '领取' }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 积分消耗记录 -->
          <el-card class="records-card">
            <h3 class="card-title">积分记录</h3>
            <el-table :data="pointsRecords" stripe>
              <el-table-column prop="type" label="类型" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.type === 'earn' ? 'success' : 'danger'" size="small">
                    {{ row.type === 'earn' ? '获得' : '消耗' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" />
              <el-table-column prop="points" label="积分" width="120">
                <template #default="{ row }">
                  <span :class="{ 'points-earn': row.type === 'earn', 'points-spend': row.type === 'spend' }">
                    {{ row.type === 'earn' ? '+' : '-' }}{{ row.points }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" width="180" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 外观设置 -->
      <el-tab-pane label="外观设置" name="appearance">
        <div class="tab-content">
          <el-card class="appearance-card">
            <!-- 主题选择 -->
            <div class="setting-section">
              <h3 class="section-title">主题</h3>
              <div class="theme-options">
                <div
                  v-for="theme in themes"
                  :key="theme.value"
                  :class="['theme-option', { active: currentTheme === theme.value }]"
                  @click="handleThemeChange(theme.value)"
                >
                  <el-icon><component :is="theme.icon" /></el-icon>
                  <span>{{ theme.label }}</span>
                  <el-icon v-if="currentTheme === theme.value" class="check-icon"><Check /></el-icon>
                </div>
              </div>
            </div>

            <!-- 布局偏好设置 -->
            <div class="setting-section">
              <h3 class="section-title">布局偏好</h3>
              <div class="layout-options">
                <div
                  v-for="layout in layouts"
                  :key="layout.value"
                  :class="['layout-option', { active: currentLayout === layout.value }]"
                  @click="handleLayoutChange(layout.value)"
                >
                  <div class="layout-preview">
                    <div class="preview-sidebar" />
                    <div class="preview-content" />
                  </div>
                  <span>{{ layout.label }}</span>
                  <el-icon v-if="currentLayout === layout.value" class="check-icon"><Check /></el-icon>
                </div>
              </div>
            </div>

            <!-- 字体大小调整 -->
            <div class="setting-section">
              <h3 class="section-title">字体大小</h3>
              <div class="font-size-options">
                <div
                  v-for="size in fontSizes"
                  :key="size.value"
                  :class="['font-size-option', { active: currentFontSize === size.value }]"
                  @click="handleFontSizeChange(size.value)"
                >
                  <span :style="{ fontSize: size.preview }">A</span>
                  <span>{{ size.label }}</span>
                  <el-icon v-if="currentFontSize === size.value" class="check-icon"><Check /></el-icon>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 帮助与反馈 -->
      <el-tab-pane label="帮助与反馈" name="help">
        <div class="tab-content">
          <!-- 常见问题折叠面板 -->
          <el-card class="faq-card">
            <h3 class="card-title">常见问题</h3>
            <el-collapse v-model="activeFaq">
              <el-collapse-item
                v-for="faq in faqs"
                :key="faq.id"
                :title="faq.question"
                :name="faq.id"
              >
                {{ faq.answer }}
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 问题反馈表单 -->
          <el-card class="feedback-card">
            <h3 class="card-title">问题反馈</h3>
            <el-form :model="feedbackForm" :rules="feedbackRules" ref="feedbackFormRef" label-width="100px">
              <el-form-item label="反馈类型" prop="type">
                <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
                  <el-option label="功能建议" value="feature" />
                  <el-option label="问题反馈" value="bug" />
                  <el-option label="使用咨询" value="question" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
              <el-form-item label="问题描述" prop="content">
                <el-input
                  v-model="feedbackForm.content"
                  type="textarea"
                  :rows="6"
                  placeholder="请详细描述您的问题或建议"
                />
              </el-form-item>
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model="feedbackForm.contact" placeholder="请输入您的联系方式（可选）" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmitFeedback">提交反馈</el-button>
                <el-button @click="handleResetFeedback">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 在线客服入口 -->
          <el-card class="support-card">
            <div class="support-content">
              <div class="support-icon">
                <el-icon :size="48"><Service /></el-icon>
              </div>
              <div class="support-info">
                <h3>需要帮助？</h3>
                <p>我们的客服团队随时为您服务</p>
              </div>
              <el-button type="primary" @click="handleContactSupport">联系客服</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import {
  User,
  Camera,
  Check,
  Close,
  Coin,
  Sunny,
  Moon,
  Grid,
  List,
  Service
} from '@element-plus/icons-vue'

// 当前激活的选项卡
const activeTab = ref('profile')

// 用户头像
const userAvatar = ref('')

// 个人资料表单
const profileForm = ref({
  username: '',
  email: '',
  phone: '',
  profession: '',
  institution: '',
  bio: ''
})

// 个人资料表单验证规则
const profileRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  profession: [
    { required: true, message: '请选择职业背景', trigger: 'change' }
  ]
}

const profileFormRef = ref<FormInstance>()

// 头像上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  userAvatar.value = response.url
  ElMessage.success('头像上传成功')
}

// 头像上传前验证
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 保存个人资料
const handleSaveProfile = async () => {
  if (!profileFormRef.value) return
  await profileFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('个人资料保存成功')
    }
  })
}

// 重置个人资料
const handleResetProfile = () => {
  profileFormRef.value?.resetFields()
}

// 支付对话框
const paymentDialogVisible = ref(false)
const qrCodeUrl = ref('')

// 升级订阅
const handleUpgrade = (plan: string) => {
  paymentDialogVisible.value = true
  // 实际应用中这里应该生成支付二维码
  qrCodeUrl.value = 'https://via.placeholder.com/200'
}

// 积分余额
const pointsBalance = ref(1250)

// 积分任务
const pointsTasks = ref([
  {
    id: 1,
    title: '完善个人资料',
    description: '填写完整的个人信息',
    points: 100,
    completed: false
  },
  {
    id: 2,
    title: '首次创建项目',
    description: '创建您的第一个项目',
    points: 200,
    completed: true
  },
  {
    id: 3,
    title: '邀请好友',
    description: '邀请好友注册并使用',
    points: 500,
    completed: false
  }
])

// 积分记录
const pointsRecords = ref([
  {
    type: 'earn',
    description: '完成任务：首次创建项目',
    points: 200,
    time: '2024-01-15 10:30'
  },
  {
    type: 'spend',
    description: '使用AI文档分析',
    points: 50,
    time: '2024-01-14 15:20'
  },
  {
    type: 'earn',
    description: '每日登录奖励',
    points: 10,
    time: '2024-01-14 09:00'
  }
])

// 获取积分
const handleGetPoints = () => {
  ElMessage.info('查看获取积分的任务')
}

// 完成任务
const handleCompleteTask = (task: any) => {
  task.completed = true
  pointsBalance.value += task.points
  ElMessage.success(`获得 ${task.points} 积分`)
}

// 主题选项
const themes = ref([
  { label: '浅色', value: 'light', icon: Sunny },
  { label: '深色', value: 'dark', icon: Moon }
])

const currentTheme = ref('light')

// 切换主题
const handleThemeChange = (theme: string) => {
  currentTheme.value = theme
  ElMessage.success(`已切换到${theme === 'light' ? '浅色' : '深色'}主题`)
}

// 布局选项
const layouts = ref([
  { label: '网格布局', value: 'grid' },
  { label: '列表布局', value: 'list' }
])

const currentLayout = ref('grid')

// 切换布局
const handleLayoutChange = (layout: string) => {
  currentLayout.value = layout
  ElMessage.success(`已切换到${layout === 'grid' ? '网格' : '列表'}布局`)
}

// 字体大小选项
const fontSizes = ref([
  { label: '小', value: 'small', preview: '14px' },
  { label: '中', value: 'medium', preview: '16px' },
  { label: '大', value: 'large', preview: '18px' }
])

const currentFontSize = ref('medium')

// 切换字体大小
const handleFontSizeChange = (size: string) => {
  currentFontSize.value = size
  ElMessage.success(`已切换到${size === 'small' ? '小' : size === 'medium' ? '中' : '大'}字体`)
}

// 常见问题
const faqs = ref([
  {
    id: '1',
    question: '如何升级订阅计划？',
    answer: '您可以在"订阅计划"选项卡中查看当前计划，并选择适合您的升级方案，支持微信支付。'
  },
  {
    id: '2',
    question: '积分如何获取和使用？',
    answer: '您可以通过完成任务、每日登录、邀请好友等方式获取积分。积分可用于兑换高级功能或延长订阅时间。'
  },
  {
    id: '3',
    question: '如何修改个人信息？',
    answer: '在"个人资料"选项卡中，您可以修改用户名、邮箱、手机号、职业背景等信息。'
  }
])

const activeFaq = ref(['1'])

// 反馈表单
const feedbackForm = ref({
  type: '',
  content: '',
  contact: ''
})

const feedbackRules: FormRules = {
  type: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入问题描述', trigger: 'blur' }
  ]
}

const feedbackFormRef = ref<FormInstance>()

// 提交反馈
const handleSubmitFeedback = async () => {
  if (!feedbackFormRef.value) return
  await feedbackFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('反馈提交成功，感谢您的建议！')
    }
  })
}

// 重置反馈
const handleResetFeedback = () => {
  feedbackFormRef.value?.resetFields()
}

// 联系客服
const handleContactSupport = () => {
  ElMessage.info('正在为您连接客服...')
}
</script>

<style scoped lang="scss">
.settings-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

// 页面标题
.page-header {
  margin-bottom: 24px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 8px 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

// 选项卡
.settings-tabs {
  :deep(.el-tabs__header) {
    background-color: #fff;
    border-radius: 12px 12px 0 0;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  :deep(.el-tabs__content) {
    background-color: #fff;
    border-radius: 0 0 12px 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}

// 选项卡内容
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 卡片通用样式
.el-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 20px 0;
  }
}

// 个人资料
.profile-card {
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;

    .avatar-wrapper {
      position: relative;
      margin-bottom: 16px;

      .avatar {
        border: 4px solid #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .upload-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40px;
        height: 40px;
      }
    }

    .avatar-tips {
      text-align: center;

      p {
        margin: 4px 0;
        font-size: 14px;
        color: var(--el-text-color-regular);

        &.tips-text {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

// 订阅计划
.current-plan-card {
  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .plan-info {
      .plan-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 8px 0;
      }

      .plan-desc {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin: 0;
      }
    }
  }

  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }
}

.plans-card {
  .plans-table {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;

    .plan-column {
      padding: 24px;
      border: 2px solid var(--el-border-color-light);
      border-radius: 12px;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary);
        transform: translateY(-4px);
      }

      &.pro {
        border-color: var(--el-color-primary);
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 16px;
          background-color: var(--el-color-primary);
          color: #fff;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
      }

      .plan-header {
        text-align: center;
        margin-bottom: 20px;

        h4 {
          font-size: 20px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0 0 12px 0;
        }

        .price {
          font-size: 32px;
          font-weight: 700;
          color: var(--el-color-primary);
          margin: 0;

          .period {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            font-weight: 400;
          }
        }
      }

      .plan-features {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }

      .plan-btn {
        width: 100%;
      }
    }
  }
}

.payment-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .qr-code {
    width: 200px;
    height: 200px;
    border-radius: 8px;
  }

  .payment-tips {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

// 积分管理
.points-card {
  .points-balance {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-7) 100%);
    border-radius: 12px;

    .points-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background-color: #fff;
      border-radius: 50%;
      color: var(--el-color-primary);
    }

    .points-info {
      flex: 1;

      .points-value {
        font-size: 36px;
        font-weight: 700;
        color: var(--el-color-primary);
        margin: 0 0 8px 0;
      }

      .points-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin: 0;
      }
    }
  }
}

.tasks-card {
  .tasks-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: var(--el-fill-color-light);
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background-color: var(--el-fill-color);
      }

      .task-info {
        flex: 1;

        h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0 0 4px 0;
        }

        p {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          margin: 0;
        }
      }

      .task-reward {
        display: flex;
        align-items: center;
        gap: 12px;

        .reward-value {
          font-size: 18px;
          font-weight: 600;
          color: var(--el-color-success);
        }
      }
    }
  }
}

.records-card {
  :deep(.el-table) {
    .points-earn {
      color: var(--el-color-success);
      font-weight: 600;
    }

    .points-spend {
      color: var(--el-color-danger);
      font-weight: 600;
    }
  }
}

// 外观设置
.appearance-card {
  .setting-section {
    margin-bottom: 32px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 16px 0;
    }
  }

  .theme-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .theme-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid var(--el-border-color-light);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover {
        border-color: var(--el-color-primary);
      }

      &.active {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);

        .check-icon {
          position: absolute;
          right: 12px;
          color: var(--el-color-primary);
        }
      }
    }
  }

  .layout-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .layout-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border: 2px solid var(--el-border-color-light);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover {
        border-color: var(--el-color-primary);
      }

      &.active {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);

        .check-icon {
          position: absolute;
          right: 12px;
          top: 12px;
          color: var(--el-color-primary);
        }
      }

      .layout-preview {
        display: flex;
        gap: 4px;
        width: 80px;
        height: 60px;

        .preview-sidebar {
          width: 20px;
          height: 100%;
          background-color: var(--el-color-primary-light-7);
          border-radius: 4px;
        }

        .preview-content {
          flex: 1;
          background-color: var(--el-fill-color-light);
          border-radius: 4px;
        }
      }
    }
  }

  .font-size-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .font-size-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid var(--el-border-color-light);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover {
        border-color: var(--el-color-primary);
      }

      &.active {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);

        .check-icon {
          position: absolute;
          right: 12px;
          color: var(--el-color-primary);
        }
      }
    }
  }
}

// 帮助与反馈
.faq-card {
  :deep(.el-collapse) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  :deep(.el-collapse-item__content) {
    font-size: 14px;
    color: var(--el-text-color-regular);
    line-height: 1.6;
  }
}

.feedback-card {
  .el-form {
    max-width: 600px;
  }
}

.support-card {
  .support-content {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-7) 100%);
    border-radius: 12px;

    .support-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background-color: #fff;
      border-radius: 50%;
      color: var(--el-color-primary);
    }

    .support-info {
      flex: 1;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 8px 0;
      }

      p {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin: 0;
      }
    }
  }
}
</style>
