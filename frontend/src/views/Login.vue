<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <el-icon :size="40" color="#667eea"><Promotion /></el-icon>
          <h1>Medagil AI</h1>
        </div>
        <p class="slogan">智能科研助手，让研究更高效</p>
      </div>

      <el-tabs v-model="activeTab" class="login-tabs">
        <!-- 手机验证码登录 -->
        <el-tab-pane label="手机验证码登录" name="phone">
          <el-form
            ref="phoneFormRef"
            :model="phoneForm"
            :rules="phoneRules"
            label-position="top"
            class="login-form"
          >
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入手机号"
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
                  placeholder="请输入验证码"
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
                type="primary"
                :loading="loading"
                class="login-button"
                @click="handlePhoneLogin"
                size="large"
              >
                登录 / 注册
              </el-button>
            </el-form-item>

            <div class="login-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>首次登录将自动创建账号</span>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 微信扫码登录 -->
        <el-tab-pane label="微信扫码登录" name="wechat">
          <div class="wechat-login">
            <div class="qrcode-container">
              <div class="qrcode-placeholder">
                <el-icon :size="100" color="#667eea"><ChatDotRound /></el-icon>
              </div>
            </div>
            <p class="tip">请使用微信扫描二维码登录</p>
            <div class="login-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>首次扫码将自动创建账号</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="agreement">
        登录即表示您同意
        <el-link type="primary" @click="handleAgreement">《用户服务协议》</el-link>
        和
        <el-link type="primary" @click="handlePrivacy">《隐私政策》</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ChatDotRound, Promotion, Phone, Key, InfoFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('wechat')

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
  background: #f5f7fa;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 48px 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.5px;
}

.slogan {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-tabs {
  margin-bottom: 24px;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

.login-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  font-size: 16px;
  color: #6b7280;
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
  background: #667eea;
  height: 3px;
  border-radius: 2px;
}

.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input-group .el-input {
  flex: 1;
}

.code-input-group .el-button {
  white-space: nowrap;
  padding: 0 20px;
}

.login-button {
  width: 100%;
  margin-top: 8px;
  font-weight: 600;
  border-radius: 8px;
}

.login-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 13px;
  color: #9ca3af;
}

.login-tip .el-icon {
  font-size: 16px;
}

.wechat-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}

.qrcode-container {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
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
  color: #6b7280;
  line-height: 1.5;
}

.agreement {
  text-align: center;
  margin-top: 32px;
  font-size: 13px;
  color: #9ca3af;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
  }

  .logo h1 {
    font-size: 24px;
  }

  .slogan {
    font-size: 13px;
  }

  .qrcode-container {
    width: 180px;
    height: 180px;
  }
}
</style>