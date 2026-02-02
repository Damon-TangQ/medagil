<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo">
            <el-icon :size="48" color="white"><Promotion /></el-icon>
          </div>
          <h1 class="brand-title">医学科研AI智能体平台</h1>
          <p class="brand-slogan">Medagil AI Platform</p>
          <div class="brand-features">
            <div class="feature-item">
              <el-icon :size="24" color="white"><Check /></el-icon>
              <span>智能文献检索</span>
            </div>
            <div class="feature-item">
              <el-icon :size="24" color="white"><Check /></el-icon>
              <span>AI辅助科研</span>
            </div>
            <div class="feature-item">
              <el-icon :size="24" color="white"><Check /></el-icon>
              <span>数据分析可视化</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="form-card">
          <div class="form-header">
            <h2>欢迎登录</h2>
            <p>Medagil AI平台</p>
          </div>

          <el-tabs v-model="activeTab" class="login-tabs">
            <!-- 用户名/密码登录 -->
            <el-tab-pane label="账号登录" name="account">
              <el-form
                ref="accountFormRef"
                :model="accountForm"
                :rules="accountRules"
                label-position="top"
                class="login-form"
              >
                <el-form-item label="用户名/邮箱" prop="username">
                  <el-input
                    v-model="accountForm.username"
                    placeholder="请输入用户名或邮箱"
                    clearable
                    class="custom-input"
                  >
                    <template #prefix>
                      <el-icon><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="accountForm.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                    clearable
                    class="custom-input"
                    @keyup.enter="handleAccountLogin"
                  >
                    <template #prefix>
                      <el-icon><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="loading"
                    class="login-button"
                    @click="handleAccountLogin"
                  >
                    <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
                    登录
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 手机号登录 -->
            <el-tab-pane label="手机号登录" name="phone">
              <el-form
                ref="phoneFormRef"
                :model="phoneForm"
                :rules="phoneRules"
                label-position="top"
                class="login-form"
              >
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="phoneForm.phone"
                    placeholder="请输入手机号"
                    clearable
                    class="custom-input"
                  >
                    <template #prefix>
                      <el-icon><Phone /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="code">
                  <div class="code-input-group">
                    <el-input
                      v-model="phoneForm.code"
                      placeholder="请输入验证码"
                      clearable
                      class="custom-input"
                    >
                      <template #prefix>
                        <el-icon><Key /></el-icon>
                      </template>
                    </el-input>
                    <el-button
                      :disabled="codeCountdown > 0"
                      @click="handleSendCode"
                      class="code-button"
                    >
                      {{ codeCountdown > 0 ? `${codeCountdown}s后重试` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="loading"
                    class="login-button"
                    @click="handlePhoneLogin"
                  >
                    <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
                    登录
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 微信登录 -->
            <el-tab-pane label="微信登录" name="wechat">
              <div class="wechat-login">
                <el-button
                  type="success"
                  :loading="loading"
                  class="wechat-button"
                  @click="handleWechatLogin"
                >
                  <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
                  <el-icon v-else><ChatDotRound /></el-icon>
                  微信一键登录
                </el-button>
                <p class="tip">首次使用微信登录将自动创建账户</p>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="form-footer">
            <el-link type="primary" @click="handleRegister">还没有账号？立即注册</el-link>
          </div>

          <div class="agreement">
            登录即表示您同意
            <el-link type="primary" @click="handleAgreement">《用户服务协议》</el-link>
            和
            <el-link type="primary" @click="handlePrivacy">《隐私政策》</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ChatDotRound, Promotion, Check, Loading, User, Lock, Phone, Key } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('account')

// 账号登录表单
const accountFormRef = ref<FormInstance>()
const accountForm = reactive({
  username: '',
  password: ''
})

// 账号登录表单验证规则
const accountRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 加载状态
const loading = ref(false)

// 验证码倒计时
const codeCountdown = ref(0)
let countdownTimer: number | null = null

// 手机号登录表单
const phoneFormRef = ref<FormInstance>()
const phoneForm = reactive({
  phone: '',
  code: ''
})

// 表单验证规则
const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
  ]
}

// 发送验证码
const handleSendCode = async () => {
  if (!phoneForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  
  try {
    // 模拟发送验证码，自动填入6位验证码用于demo体验
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
    phoneForm.code = mockCode
    ElMessage.success(`验证码已发送: ${mockCode} (Demo模式自动填入)`)
    
    // 开始倒计时
    codeCountdown.value = 60
    countdownTimer = window.setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('发送验证码失败，请稍后重试')
  }
}

// 处理账号登录
const handleAccountLogin = async () => {
  if (!accountFormRef.value) return

  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const result = await authStore.login(accountForm.username, accountForm.password)

        if (result.success) {
          ElMessage.success('登录成功')
          // 登录成功后跳转到首页
          router.push('/')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理手机号登录
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return

  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用后端API进行手机号登录
        const result = await authStore.phoneLogin(phoneForm.phone, phoneForm.code)

        if (result.success) {
          ElMessage.success('登录成功')
          // 登录成功后跳转到首页
          router.push('/')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理微信登录
const handleWechatLogin = async () => {
  loading.value = true
  try {
    // 模拟微信登录，实际项目中应该调用微信SDK获取openid
    const mockOpenid = 'mock_wx_openid_' + Date.now()
    const mockUnionid = 'mock_wx_unionid_' + Date.now()
    const mockNickname = '微信用户'
    const mockAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

    const result = await authStore.wechatLogin(mockOpenid, mockUnionid, mockNickname, mockAvatar)

    if (result.success) {
      if (result.isNewUser) {
        ElMessage.success('欢迎新用户，登录成功')
      } else {
        ElMessage.success('登录成功')
      }
      // 登录成功后跳转到首页
      router.push('/')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = () => {
  router.push('/register')
}

// 处理用户协议
const handleAgreement = () => {
  ElMessage.info('用户服务协议页面开发中...')
}

// 处理隐私政策
const handlePrivacy = () => {
  ElMessage.info('隐私政策页面开发中...')
}
</script>

<style scoped>
.login-card {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  animation: rotate 30s linear infinite;
}

.brand-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
}

.brand-logo {
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.brand-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.brand-slogan {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 48px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.95;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-item:hover {
  transform: translateX(8px);
  opacity: 1;
}

.form-section {
  flex: 1;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 420px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1.25;
}

.form-header p {
  font-size: 15px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
}

.agreement {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input-group .el-input {
  flex: 1;
}

.code-button {
  white-space: nowrap;
  padding: 0 20px;
  border-radius: 12px;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 48px;
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1.25;
}

.login-header p {
  font-size: 15px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.login-tabs {
  margin-bottom: 24px;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

.login-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: var(--el-text-color-regular);
  padding: 0 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-tabs :deep(.el-tabs__item:hover) {
  color: #667eea;
}

.login-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
  font-weight: 600;
}

.login-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  height: 3px;
  border-radius: 2px;
}

.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.login-button,
.wechat-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.login-button::before,
.wechat-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.login-button:hover::before,
.wechat-button:hover::before {
  left: 100%;
}

.login-button:hover,
.wechat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.wechat-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.wechat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.wechat-button .el-icon {
  font-size: 20px;
}

.tip {
  margin-top: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .brand-section {
    padding: 32px;
  }

  .brand-title {
    font-size: 28px;
  }

  .brand-slogan {
    font-size: 16px;
  }

  .form-section {
    padding: 32px 24px;
  }

  .form-header h2 {
    font-size: 28px;
  }

  .login-button,
  .wechat-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
