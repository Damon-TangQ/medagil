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
                    prefix-icon="Phone"
                    clearable
                    class="custom-input"
                  />
                </el-form-item>

                <el-form-item label="验证码" prop="code">
                  <div class="code-input-group">
                    <el-input
                      v-model="phoneForm.code"
                      placeholder="请输入验证码"
                      prefix-icon="Key"
                      clearable
                      class="custom-input"
                    />
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
import { ChatDotRound, Promotion, Check, Loading } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('phone')

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
    // 模拟发送验证码
    ElMessage.success('验证码已发送')
    
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

// 处理手机号登录
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return

  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录，实际项目中应该调用后端API
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
  ElMessage.info('注册功能开发中...')
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  padding: 24px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 48px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  line-height: 1.25;
}

.login-header p {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.login-tabs {
  margin-bottom: 24px;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: var(--el-border-color-lighter);
}

.login-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.login-tabs :deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 600;
}

.login-form {
  margin-top: 24px;
}

.login-button,
.wechat-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-button:hover,
.wechat-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  .login-box {
    padding: 32px 24px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-button,
  .wechat-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
