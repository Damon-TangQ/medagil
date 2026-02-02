
<template>
  <div class="register-container">
    <div class="register-card">
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

      <!-- 右侧注册表单 -->
      <div class="form-section">
        <div class="form-card">
          <div class="form-header">
            <h2>创建账号</h2>
            <p>加入Medagil AI平台</p>
          </div>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-position="top"
            class="register-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                clearable
                class="custom-input"
              />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                prefix-icon="Message"
                clearable
                class="custom-input"
              />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="请输入手机号"
                prefix-icon="Phone"
                clearable
                class="custom-input"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                show-password
                clearable
                class="custom-input"
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                prefix-icon="Lock"
                show-password
                clearable
                class="custom-input"
                @keyup.enter="handleRegister"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                class="register-button"
                @click="handleRegister"
              >
                <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
                注册
              </el-button>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <span>已有账号？</span>
            <el-link type="primary" @click="handleLogin">立即登录</el-link>
          </div>

          <div class="agreement">
            注册即表示您同意
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
import { Promotion, Check, Loading } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 加载状态
const loading = ref(false)

// 注册表单
const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 自定义验证规则：确认密码
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const result = await authStore.register({
          username: registerForm.username,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password
        })

        if (result.success) {
          ElMessage.success('注册成功，正在自动登录...')
          // 注册成功后跳转到首页
          router.push('/')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('注册失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理登录
const handleLogin = () => {
  router.push('/login')
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  padding: 24px;
}

.register-card {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-content {
  color: white;
}

.brand-logo {
  margin-bottom: 32px;
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.25;
}

.brand-slogan {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 48px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
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
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  line-height: 1.25;
}

.form-header p {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.register-form {
  margin-bottom: 24px;
}

.custom-input {
  margin-bottom: 8px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-footer {
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.agreement {
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .register-card {
    flex-direction: column;
  }

  .brand-section {
    padding: 32px;
  }

  .form-section {
    padding: 32px;
  }
}
</style>
