<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>欢迎登录</h1>
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
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="phoneForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                show-password
                clearable
                @keyup.enter="handlePhoneLogin"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                class="login-button"
                @click="handlePhoneLogin"
              >
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
              <el-icon><ChatDotRound /></el-icon>
              微信一键登录
            </el-button>
            <p class="tip">首次使用微信登录将自动创建账户</p>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="login-footer">
        <el-link type="primary" @click="handleRegister">还没有账号？立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('phone')

// 加载状态
const loading = ref(false)

// 手机号登录表单
const phoneFormRef = ref<FormInstance>()
const phoneForm = reactive({
  phone: '',
  password: ''
})

// 表单验证规则
const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 处理手机号登录
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return

  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const result = await authStore.phoneLogin(phoneForm.phone, phoneForm.password)

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
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #909399;
}

.login-tabs {
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-button,
.wechat-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 10px;
}

.wechat-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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
  font-size: 12px;
  color: #909399;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .login-box {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-button,
  .wechat-button {
    height: 40px;
    font-size: 15px;
  }
}
</style>
