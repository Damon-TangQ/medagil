<template>
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-card">
      <div class="user-info">
        <el-avatar :size="100" :src="user?.avatar || defaultAvatar" />
        <div class="user-details">
          <h2 class="user-name">{{ user?.nickname || user?.username }}</h2>
          <p class="user-email">{{ user?.email }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ stats.projectCount }}</span>
              <span class="stat-label">项目</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.taskCount }}</span>
              <span class="stat-label">任务</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.likeCount }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
        </div>
        <el-button type="primary" @click="handleEditProfile">
          编辑资料
        </el-button>
      </div>
    </el-card>

    <!-- 订阅信息 -->
    <el-card class="subscription-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">订阅信息</span>
          <el-tag :type="getSubscriptionType(user?.subscriptionLevel)">
            {{ getSubscriptionName(user?.subscriptionLevel) }}
          </el-tag>
        </div>
      </template>

      <div class="subscription-info">
        <div class="info-item">
          <span class="label">到期时间：</span>
          <span class="value">{{ formatDate(user?.subscriptionExpireTime) }}</span>
        </div>
        <div class="info-item">
          <span class="label">项目限额：</span>
          <span class="value">{{ subscriptionConfig.maxProjects === -1 ? '无限制' : `${subscriptionConfig.maxProjects} 个` }}</span>
        </div>
        <div class="info-item">
          <span class="label">每月任务：</span>
          <span class="value">{{ subscriptionConfig.maxTasksPerMonth === -1 ? '无限制' : `${subscriptionConfig.maxTasksPerMonth} 次` }}</span>
        </div>
        <div class="info-item">
          <span class="label">AI调用：</span>
          <span class="value">{{ subscriptionConfig.maxAiCallsPerMonth === -1 ? '无限制' : `${subscriptionConfig.maxAiCallsPerMonth} 次` }}</span>
        </div>
      </div>

      <div class="subscription-actions">
        <el-button type="primary" @click="handleUpgrade">
          升级订阅
        </el-button>
      </div>
    </el-card>

    <!-- 快捷操作 -->
    <el-card class="quick-actions-card">
      <template #header>
        <span class="card-title">快捷操作</span>
      </template>

      <div class="action-grid">
        <div class="action-item" @click="handleMyProjects">
          <el-icon><Folder /></el-icon>
          <span>我的项目</span>
        </div>
        <div class="action-item" @click="handleMyTasks">
          <el-icon><List /></el-icon>
          <span>我的任务</span>
        </div>
        <div class="action-item" @click="handleMyFavorites">
          <el-icon><Star /></el-icon>
          <span>我的收藏</span>
        </div>
        <div class="action-item" @click="handleChangePassword">
          <el-icon><Lock /></el-icon>
          <span>修改密码</span>
        </div>
        <div class="action-item" @click="handleNotificationSettings">
          <el-icon><Bell /></el-icon>
          <span>通知设置</span>
        </div>
        <div class="action-item" @click="handlePrivacySettings">
          <el-icon><Lock /></el-icon>
          <span>隐私设置</span>
        </div>
      </div>
    </el-card>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="handleSaveProfile">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="passwordLoading" @click="handleChangePasswordSubmit">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Folder, List, Star, Lock, Bell } from '@element-plus/icons-vue'
import { getCurrentUser, updateUserInfo, changePassword } from '@/api'
import { formatDate, storage, SUBSCRIPTION_LEVEL, SUBSCRIPTION_LEVEL_NAMES } from '@/shared'
import { useForm } from '@/composables'

const router = useRouter()

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 用户信息
const user = ref<any>(null)
const stats = ref({
  projectCount: 0,
  taskCount: 0,
  likeCount: 0
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

// 编辑资料
const editDialogVisible = ref(false)
const editLoading = ref(false)
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/avatar`
const { formRef: editFormRef, formData: editForm, rules: editRules, submitForm: submitEditForm } = useForm(
  {
    avatar: '',
    nickname: '',
    email: '',
    phone: ''
  },
  {
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
  }
)

// 修改密码
const passwordDialogVisible = ref(false)
const passwordLoading = ref(false)
const { formRef: passwordFormRef, formData: passwordForm, rules: passwordRules, submitForm: submitPasswordForm } = useForm(
  {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  {
    oldPassword: [
      { required: true, message: '请输入原密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 8, message: '密码长度不能少于 8 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      {
        validator: (_rule: any, value: any, callback: any) => {
          if (value !== passwordForm.newPassword) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
)

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

// 编辑资料
const handleEditProfile = () => {
  editForm.avatar = user.value?.avatar || ''
  editForm.nickname = user.value?.nickname || ''
  editForm.email = user.value?.email || ''
  editForm.phone = user.value?.phone || ''
  editDialogVisible.value = true
}

// 保存资料
const handleSaveProfile = async () => {
  await submitEditForm(async () => {
    editLoading.value = true
    try {
      const response = await updateUserInfo({
        avatar: editForm.avatar,
        nickname: editForm.nickname,
        email: editForm.email,
        phone: editForm.phone
      })

      if (response.success && response.data) {
        user.value = response.data
        storage.set('user', response.data)
        ElMessage.success('保存成功')
        editDialogVisible.value = false
      }
    } finally {
      editLoading.value = false
    }
  })
}

// 头像上传成功
const handleAvatarSuccess = (response: any) => {
  if (response.success && response.data?.url) {
    editForm.avatar = response.data.url
  }
}

// 头像上传前验证
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 修改密码
const handleChangePassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordDialogVisible.value = true
}

// 提交修改密码
const handleChangePasswordSubmit = async () => {
  await submitPasswordForm(async () => {
    passwordLoading.value = true
    try {
      const response = await changePassword({
        oldPassword: passwordForm.oldPassword || '',
        newPassword: passwordForm.newPassword || ''
      })

      if (response.success) {
        ElMessage.success('密码修改成功')
        passwordDialogVisible.value = false
      }
    } finally {
      passwordLoading.value = false
    }
  })
}

// 升级订阅
const handleUpgrade = () => {
  router.push('/subscription')
}

// 快捷操作
const handleMyProjects = () => {
  router.push('/projects')
}

const handleMyTasks = () => {
  router.push('/tasks')
}

const handleMyFavorites = () => {
  router.push('/favorites')
}

const handleNotificationSettings = () => {
  ElMessage.info('通知设置功能开发中...')
}

const handlePrivacySettings = () => {
  ElMessage.info('隐私设置功能开发中...')
}

// 获取订阅类型
const getSubscriptionType = (level: number) => {
  if (level === SUBSCRIPTION_LEVEL.PREMIUM) return 'danger'
  if (level === SUBSCRIPTION_LEVEL.BASIC) return 'warning'
  return 'info'
}

// 获取订阅名称
const getSubscriptionName = (level: number) => {
  return SUBSCRIPTION_LEVEL_NAMES[level as keyof typeof SUBSCRIPTION_LEVEL_NAMES] || '免费版'
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.user-card {
  margin-bottom: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.user-email {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #909399;
}

.user-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.subscription-card {
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
  color: #303133;
}

.subscription-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item .label {
  font-size: 13px;
  color: #909399;
}

.info-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.subscription-actions {
  display: flex;
  justify-content: flex-end;
}

.quick-actions-card {
  margin-bottom: 24px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background-color: #e6f7ff;
  transform: translateY(-2px);
}

.action-item .el-icon {
  font-size: 32px;
  color: #409eff;
}

.action-item span {
  font-size: 14px;
  color: #606266;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .user-stats {
    justify-content: center;
  }

  .subscription-info {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
