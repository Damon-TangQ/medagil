<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="login-modal-overlay" @click.self="handleClose">
        <div class="login-modal-container">
          <div class="login-header">
            <h2>登录 Medagil AI</h2>
            <button class="close-button" @click="handleClose">
              <el-icon><Close /></el-icon>
            </button>
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
                  <!-- 验证码错误提示 -->
                  <div v-if="codeError" class="error-message">
                    <el-icon class="error-icon"><WarningFilled /></el-icon>
                    <span>{{ codeError }}</span>
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
                  <!-- 二维码状态提示 -->
                  <div v-if="qrCodeStatus !== 'loading'" class="qr-status">
                    <el-icon v-if="qrCodeStatus === 'scanned'" class="status-icon scanned"><CircleCheck /></el-icon>
                    <el-icon v-else-if="qrCodeStatus === 'expired'" class="status-icon expired"><Refresh /></el-icon>
                    <el-icon v-else-if="qrCodeStatus === 'error'" class="status-icon error"><CircleClose /></el-icon>
                  </div>
                </div>
                <p class="tip">{{ qrStatusText }}</p>
                <div v-if="qrCodeStatus === 'error'" class="refresh-tip">
                  <el-button @click="refreshQrCode" type="primary" size="small">
                    <el-icon><Refresh /></el-icon>
                    刷新二维码
                  </el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 手机号绑定弹窗 -->
            <el-dialog
              v-model="showBindPhoneModal"
              title="绑定手机号"
              width="400px"
              :close-on-click-modal="false"
            >
              <el-form
                ref="bindPhoneFormRef"
                :model="bindPhoneForm"
                :rules="phoneRules"
                label-position="top"
              >
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="bindPhoneForm.phone"
                    placeholder="请输入手机号"
                    clearable
                  >
                    <template #prefix>
                      <el-icon><Phone /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="code">
                  <div class="code-input-group">
                    <el-input
                      v-model="bindPhoneForm.code"
                      placeholder="请输入验证码"
                      clearable
                    >
                      <template #prefix>
                        <el-icon><Key /></el-icon>
                      </template>
                    </el-input>
                    <el-button
                      :disabled="bindCodeCountdown > 0"
                      @click="handleSendBindCode"
                    >
                      {{ bindCodeCountdown > 0 ? `${bindCodeCountdown}s后重试` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="loading"
                    class="login-button"
                    @click="handleBindPhone"
                    size="large"
                  >
                    确认绑定
                  </el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </el-tabs>

          <div class="agreement">
            登录即表示您同意
            <el-link type="primary" @click="handleAgreement">《用户服务协议》</el-link>
            和
            <el-link type="primary" @click="handlePrivacy">《隐私政策》</el-link>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ChatDotRound, Close, Phone, Key, InfoFilled, WarningFilled, CircleCheck, CircleClose, Refresh } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'login-success': []
}>()

const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('wechat')

// 加载状态
const loading = ref(false)

// 验证码倒计时
const codeCountdown = ref(0)
let countdownTimer: number | null = null

// 微信扫码登录状态
const qrCodeStatus = ref<'loading' | 'scanned' | 'expired' | 'error'>('loading')
const showBindPhoneModal = ref(false)
const bindPhoneForm = reactive({
  phone: '',
  code: ''
})
const bindPhoneFormRef = ref<FormInstance>()
const bindCodeCountdown = ref(0)
let bindCountdownTimer: number | null = null

// 手机号登录表单
const phoneFormRef = ref<FormInstance>()
const phoneForm = reactive({
  phone: '',
  code: ''
})

// 验证码错误提示
const codeError = ref('')

// 表单验证规则
const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { 
      validator: (_rule: any, value: any, callback: any) => {
        if (!value) {
          callback(new Error('请输入验证码'))
        } else if (!/^\d{6}$/.test(value)) {
          callback(new Error('请输入6位数字验证码'))
        } else {
          // 清除之前的错误提示
          codeError.value = ''
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 打开模态框时重置表单
    phoneForm.phone = ''
    phoneForm.code = ''
    activeTab.value = 'wechat'
  }
})

// 关闭模态框
const handleClose = () => {
  emit('update:visible', false)
}

// 发送验证码
const handleSendCode = async () => {
  // 清除之前的错误提示
  codeError.value = ''

  if (!phoneForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  try {
    // 调用后端API发送验证码
    // const response = await axios.post(`${API_BASE_URL}/auth/send-code`, {
    //   phone: phoneForm.phone
    // })

    // Demo模式：模拟发送验证码，自动填入6位验证码用于demo体验
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
    phoneForm.code = mockCode
    ElMessage.success(`验证码已发送: ${mockCode} (Demo模式自动填入)`)

    // 开始60秒倒计时，防止重复点击
    codeCountdown.value = 60
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }

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
          // 关闭模态框
          handleClose()
          // 触发登录成功事件
          emit('login-success')
        } else {
          // 其他错误
          ElMessage.error(result.message || '登录失败，请稍后重试')
        }
      } catch (error: any) {
        console.error('登录错误:', error)
        // 判断错误类型
        if (error.response?.data?.code === 4001) {
          codeError.value = '验证码错误，请重新输入'
          ElMessage.error('验证码错误，请重新输入')
        } else if (error.response?.data?.code === 4002) {
          codeError.value = '验证码已过期，请重新获取'
          ElMessage.error('验证码已过期，请重新获取')
        } else {
          ElMessage.error('登录失败，请稍后重试')
        }
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

// 计算二维码状态文本
const qrStatusText = computed(() => {
  switch (qrCodeStatus.value) {
    case 'loading':
      return '请使用微信扫码授权登录'
    case 'scanned':
      return '扫码成功，正在登录...'
    case 'expired':
      return '扫码超时，请重新扫码'
    case 'error':
      return '扫码失败，请重新扫码'
    default:
      return '请使用微信扫码授权登录'
  }
})

// 刷新二维码
const refreshQrCode = () => {
  qrCodeStatus.value = 'loading'
  // 模拟刷新二维码
  setTimeout(() => {
    qrCodeStatus.value = 'loading'
    // 模拟生成新二维码
    setTimeout(() => {
      qrCodeStatus.value = 'loading'
      // 实际项目中应调用后端API获取新二维码
    }, 500)
  }, 1000)
}

// 发送绑定验证码
const handleSendBindCode = async () => {
  if (!bindPhoneForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(bindPhoneForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  try {
    // 调用后端API发送验证码
    // const response = await axios.post(`${API_BASE_URL}/auth/send-code`, {
    //   phone: bindPhoneForm.phone
    // })

    // Demo模式：模拟发送验证码，自动填入6位验证码用于demo体验
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
    bindPhoneForm.code = mockCode
    ElMessage.success(`验证码已发送: ${mockCode} (Demo模式自动填入)`)

    // 开始60秒倒计时，防止重复点击
    bindCodeCountdown.value = 60
    if (bindCountdownTimer) {
      clearInterval(bindCountdownTimer)
    }

    bindCountdownTimer = window.setInterval(() => {
      bindCodeCountdown.value--
      if (bindCodeCountdown.value <= 0) {
        if (bindCountdownTimer) {
          clearInterval(bindCountdownTimer)
          bindCountdownTimer = null
        }
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('发送验证码失败，请稍后重试')
  }
}

// 处理手机号绑定
const handleBindPhone = async () => {
  if (!bindPhoneFormRef.value) return

  await bindPhoneFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用后端API进行手机号绑定
        // const result = await authStore.bindPhone(bindPhoneForm.phone, bindPhoneForm.code)

        // Demo模式：模拟绑定成功
        const result = {
          success: true,
          message: '绑定成功',
          data: {
            isNewUser: false,
            user: authStore.user
          }
        }

        if (result.success) {
          ElMessage.success('绑定成功，登录成功')
          // 关闭所有弹窗
          showBindPhoneModal.value = false
          handleClose()
          // 触发登录成功事件
          emit('login-success')
        } else {
          ElMessage.error(result.message || '绑定失败，请稍后重试')
        }
      } catch (error: any) {
        console.error('绑定错误:', error)
        ElMessage.error('绑定失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 模拟微信扫码状态变化
const simulateWechatScan = () => {
  // 模拟扫码成功
  setTimeout(() => {
    qrCodeStatus.value = 'scanned'
    // 模拟检测到微信未绑定手机号
    setTimeout(() => {
      showBindPhoneModal.value = true
    }, 1000)
  }, 3000)
}

// 监听微信扫码标签页激活，启动模拟
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'wechat') {
    qrCodeStatus.value = 'loading'
    // 启动模拟扫码流程
    simulateWechatScan()
  }
})
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.login-modal-container {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.login-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s;
  color: #6b7280;
}

.close-button:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.login-tabs {
  padding: 24px 32px 0;
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

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border-left: 3px solid #f56c6c;
  border-radius: 4px;
  font-size: 13px;
  color: #f56c6c;
}

.error-icon {
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
  position: relative;
}

.qrcode-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-status {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 20px;
}

.status-icon.scanned {
  color: #67c23a;
}

.status-icon.expired {
  color: #e6a23c;
}

.status-icon.error {
  color: #f56c6c;
}

.refresh-tip {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* 手机号绑定弹窗 */
:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

.tip {
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.agreement {
  text-align: center;
  margin: 24px 32px;
  font-size: 13px;
  color: #9ca3af;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

/* 动画 */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-modal-container {
    max-width: 90%;
  }

  .qrcode-container {
    width: 180px;
    height: 180px;
  }
}
</style>