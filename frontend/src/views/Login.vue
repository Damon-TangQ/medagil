<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 标题区 -->
      <div class="login-header">
        <h1 class="main-title">欢迎登录 Medagil AI</h1>
        <p class="sub-title">和 Medagil AI 一起开启智能科研</p>
      </div>

      <!-- 手机号登录表单 -->
      <el-form
        v-if="loginType === 'phone'"
        ref="phoneFormRef"
        :model="phoneForm"
        :rules="phoneRules"
        label-position="top"
        class="login-form"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="phoneForm.phone"
            placeholder="您的手机号"
            clearable
            size="large"
          >
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <div class="code-input-group">
            <el-input
              v-model="phoneForm.code"
              placeholder="短信验证码"
              clearable
              size="large"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
            <el-button
              :disabled="codeCountdown > 0"
              @click="handleSendCode"
              size="large"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s后重试` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
            @click="handlePhoneLogin"
            size="large"
          >
            立即登录
          </el-button>
        </el-form-item>

        <!-- 保持登录选项 -->
        <el-form-item>
          <el-checkbox v-model="keepLoggedIn">30天内保持登录</el-checkbox>
        </el-form-item>

        <!-- 登录方式切换按钮 -->
        <div class="login-type-switch">
          <el-button
            :type="phoneButtonType"
            @click="loginType = 'phone'"
            size="large"
            class="switch-button"
          >
            <el-icon><Phone /></el-icon>
            手机登录
          </el-button>
          <el-button
            :type="wechatButtonType"
            @click="loginType = 'wechat'"
            size="large"
            class="switch-button"
          >
            <el-icon><ChatDotRound /></el-icon>
            微信登录
          </el-button>
        </div>

        <!-- 协议链接 -->
        <div class="agreement-links">
          <el-link type="primary" @click="handleAgreement" class="agreement-link">法律条款</el-link>
          <span class="agreement-separator">|</span>
          <el-link type="primary" @click="handlePrivacy" class="agreement-link">隐私政策</el-link>
        </div>
      </el-form>

      <!-- 微信扫码登录表单 -->
      <div v-else class="wechat-login">
        <div class="qrcode-container">
          <div class="qrcode-placeholder">
            <el-icon :size="100" color="#667eea"><ChatDotRound /></el-icon>
          </div>
        </div>
        <p class="tip">请使用微信扫描二维码登录</p>

        <!-- 登录方式切换按钮 -->
        <div class="login-type-switch">
          <el-button
            :type="phoneButtonType"
            @click="loginType = 'phone'"
            size="large"
            class="switch-button"
          >
            <el-icon><Phone /></el-icon>
            手机登录
          </el-button>
          <el-button
            :type="wechatButtonType"
            @click="loginType = 'wechat'"
            size="large"
            class="switch-button"
          >
            <el-icon><ChatDotRound /></el-icon>
            微信登录
          </el-button>
        </div>

        <!-- 协议链接 -->
        <div class="agreement-links">
          <el-link type="primary" @click="handleAgreement" class="agreement-link">法律条款</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ChatDotRound, Phone, Key } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

const router = useRouter()
const authStore = useAuthStore()

// 登录类型：phone 或 wechat
const loginType = ref<'phone' | 'wechat'>('phone')

// 加载状态
const loading = ref(false)

// 验证码倒计时
const codeCountdown = ref(0)
let countdownTimer: number | null = null

// 是否保持登录
const keepLoggedIn = ref(false)

// 计算按钮类型
const phoneButtonType = computed(() => loginType.value === 'phone' ? 'primary' : 'default')
const wechatButtonType = computed(() => loginType.value === 'wechat' ? 'primary' : 'default')

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

// 处理手机号登录/注册
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return

  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用后端API进行手机号登录，后端会自动判断是新用户还是老用户
        const result = await authStore.phoneLogin(phoneForm.phone, phoneForm.code)

        if (result.success) {
          // 判断是否为新用户
          if (result.data?.isNewUser) {
            ElMessage.success('欢迎加入！账号已自动创建')
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
  })
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
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-primary, #f5f5f7);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 48px;
}

.main-title {
  font-size: 32px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 32px 0;
  letter-spacing: -0.5px;
}

.sub-title {
  font-size: 14px;
  color: #86868b;
  margin: 0 0 40px 0;
  font-weight: 400;
}

.login-form {
  margin-top: 24px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-form :deep(.el-form-item__label) {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 400;
  line-height: 1.5;
  padding-bottom: 8px;
}

.login-form :deep(.el-input__wrapper) {
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-bottom-color: #c7c7cc;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-bottom-color: #8b5cf6;
}

.login-form :deep(.el-input__inner) {
  color: #1d1d1f;
  font-size: 15px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #a1a1aa;
}

.code-input-group {
  display: flex;
  gap: 8px;
}

.code-input-group .el-input {
  flex: 1;
}

.code-input-group .el-button {
  white-space: nowrap;
  padding: 0 20px;
  background: transparent;
  border: 1px solid #8b5cf6;
  color: #8b5cf6;
  border-radius: 8px;
  transition: all 0.3s;
  font-size: 14px;
  height: 40px;
}

.code-input-group .el-button:hover {
  background: rgba(139, 92, 246, 0.05);
  border-color: #7c3aed;
  color: #7c3aed;
}

.login-button {
  width: 100%;
  margin-top: 20px;
  font-weight: 500;
  border-radius: 6px;
  background: #10b981;
  border: none;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  transition: all 0.3s;
  padding: 12px 20px;
}

.login-button:hover {
  background: #059669;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.login-type-switch {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
}

.login-type-switch .el-button {
  flex: 1;
  max-width: 200px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.login-type-switch .el-button:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-button {
  flex: 1;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #d2d2d7);
  color: var(--text-secondary, #86868b);
  border-radius: var(--radius-sm, 8px);
  transition: all var(--transition-normal, 0.3s);
}

.switch-button:hover {
  background: var(--bg-hover, #f2f2f7);
  color: var(--text-primary, #1d1d1f);
  border-color: var(--primary, #8b5cf6);
}

.switch-button.is-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border: none;
  color: #ffffff;
  box-shadow: var(--shadow-button, 0 2px 8px rgba(139, 92, 246, 0.25));
}

.switch-button.is-primary:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.wechat-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  position: relative;
  min-height: 500px;
}

.qrcode-container {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-light, #d2d2d7);
  border-radius: var(--radius-sm, 8px);
  background: var(--bg-card, #ffffff);
  margin: 0 auto;
}

.qrcode-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip {
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary, #86868b);
  line-height: var(--line-height-normal, 1.5);
}

/* 复选框样式 */
.login-form :deep(.el-checkbox) {
  display: flex;
  align-items: center;
}

.login-form :deep(.el-checkbox__label) {
  color: #86868b;
  font-size: 13px;
  padding-left: 8px;
  line-height: 1.5;
}

.login-form :deep(.el-checkbox__input) {
  display: flex;
  align-items: center;
}

.login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.login-form :deep(.el-checkbox__inner) {
  border-color: #c7c7cc;
  border-radius: 4px;
}

/* 链接样式 */
.login-form :deep(.el-link) {
  color: #8b5cf6;
  text-decoration: none;
}

.login-form :deep(.el-link:hover) {
  color: #7c3aed;
}

/* 协议链接样式 */
.agreement-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  padding: 0 16px;
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
}

.agreement-links .agreement-link {
  color: #9ca3af;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.3s;
}

.agreement-separator {
  color: #d1d5db;
  font-size: 12px;
}

.agreement-links .agreement-link:hover {
  color: #8b5cf6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
  }

  .main-title {
    font-size: 24px;
  }
}
</style>