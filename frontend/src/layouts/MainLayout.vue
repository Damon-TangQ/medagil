<template>
  <div class="main-layout">
    <!-- 主体内容 -->
    <div class="main-body">
      <!-- 左侧导航栏 -->
      <aside class="sidebar" :class="{ 'sidebar-visible': sidebarVisible }">
        <!-- Logo 区域 -->
        <div class="sidebar-header">
          <div class="sidebar-logo" :class="{ 'is-active': isActive('/') }" @click="handleNavClick('/')">
            <div class="logo-icon">M</div>
            <div class="logo-text">
              <span class="logo-name">medagil</span>
              <span class="logo-version">Medagil 2.0</span>
            </div>
          </div>
          <div class="sidebar-toggle" @click="toggleSidebar">
            <el-icon :size="20">
              <Fold v-if="sidebarVisible" />
              <Expand v-else />
            </el-icon>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="sidebar-nav">

          <div v-for="(module, index) in sidebarMenu" :key="module.moduleName" class="nav-module">
            <div v-if="index > 0" class="nav-module-divider"></div>
            <div class="nav-module-title">{{ module.moduleName }}</div>
            <div
              v-for="item in module.items"
              :key="item.route"
              class="nav-item"
              :class="{ 'nav-item-active': isActive(item.route) }"
              @click="handleNavClick(item.route)"
            >
              <el-icon :size="20">
                <component :is="item.icon" />
              </el-icon>
              <span class="nav-text">{{ item.name }}</span>
              <div v-if="item.badge && item.badge > 0" class="nav-badge">
                <el-badge :value="item.badge" type="danger" />
              </div>
 </div>
          </div>
        </nav>

        <!-- 底部区域 -->
        <div class="sidebar-footer">
          <div class="sidebar-settings" @click="settingsDialogVisible = true">
            <el-icon :size="20"><Setting /></el-icon>
            <span class="settings-text">设置</span>
          </div>
        </div>

        <!-- 设置弹窗 -->
        <el-dialog
          v-model="settingsDialogVisible"
          title="设置"
          width="40%"
          :close-on-click-modal="false"
          class="settings-dialog"
          center
          :destroy-on-close="false"
        >
          <div class="settings-content">
            <!-- 左侧功能入口 -->
            <div class="settings-menu">
              <div
                v-for="item in settingsMenuItems"
                :key="item.id"
                class="settings-menu-item"
                :class="{ 'is-active': activeSettingsTab === item.id }"
                @click="activeSettingsTab = item.id"
              >
                <el-icon :size="20">
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.name }}</span>
              </div>
            </div>
            <!-- 右侧内容区域 -->
            <div class="settings-panel">
              <div v-if="activeSettingsTab === 'account'" class="settings-panel-content">
                <h2>账户设置</h2>
                <p>管理您的账户信息和安全设置</p>

                <!-- 账户信息 -->
                <div class="settings-section">
                  <h3>账户信息</h3>
                  <div class="account-info">
                    <div class="account-avatar">
                      <el-avatar :size="64" :src="userInfo.avatar">
                        <el-icon><User /></el-icon>
                      </el-avatar>
                    </div>
                    <div class="account-details">
                      <div class="account-name">tangqing574839</div>
                      <div class="account-email">tangqing574839@163.com</div>
                    </div>
                  </div>
                </div>

                <!-- 会员状态 -->
                <div class="settings-section">
                  <h3>会员状态</h3>
                  <div class="membership-card">
                    <div class="membership-info">
                      <div class="membership-type">免费</div>
                      <el-button type="primary" @click="handleUpgrade">升级</el-button>
                    </div>
                  </div>
                </div>

                <!-- 积分信息 -->
                <div class="settings-section">
                  <h3>积分</h3>
                  <div class="points-info">
                    <div class="points-item">
                      <div class="points-value">1,000</div>
                      <div class="points-label">免费积分</div>
                    </div>
                    <div class="points-divider"></div>
                    <div class="points-item">
                      <div class="points-value">1,000</div>
                      <div class="points-label">每日刷新积分</div>
                    </div>
                    <div class="points-divider"></div>
                    <div class="points-item">
                      <div class="points-value">247</div>
                      <div class="points-label">每天 00:00 刷新为 300</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeSettingsTab === 'appearance'" class="settings-panel-content">
                <h2>界面设置</h2>
                <p>自定义您的界面外观和偏好</p>

                <!-- 语言设置 -->
                <div class="settings-section">
                  <h3>语言</h3>
                  <div class="settings-option">
                    <span>简体中文</span>
                    <el-radio-group v-model="languageSetting">
                      <el-radio-button label="zh-CN">简体中文</el-radio-button>
                      <el-radio-button label="en-US">English</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 外观设置 -->
                <div class="settings-section">
                  <h3>外观</h3>
                  <div class="settings-option">
                    <el-radio-group v-model="themeSetting">
                      <el-radio-button label="light">浅色</el-radio-button>
                      <el-radio-button label="dark">深色</el-radio-button>
                      <el-radio-button label="auto">跟随系统</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 通讯偏好 -->
                <div class="settings-section">
                  <h3>通讯偏好</h3>
                  <div class="settings-option">
                    <div class="option-item">
                      <div class="option-content">
                        <span class="option-title">接收独家内容</span>
                        <span class="option-desc">获取独家优惠、活动更新、优秀案例示例和新功能指南。</span>
                      </div>
                      <el-switch v-model="exclusiveContent" />
                    </div>
                    <div class="option-item">
                      <div class="option-content">
                        <span class="option-title">正在排队的任务开始时给我发送电子邮件</span>
                        <span class="option-desc">启用后，一旦您的任务完成排队并开始处理，我们将及时发送电子邮件通知您。</span>
                      </div>
                      <el-switch v-model="taskEmailNotification" />
                    </div>
                  </div>
                </div>

                <!-- Cookies管理 -->
                <div class="settings-section">
                  <h3>管理 Cookies</h3>
                  <div class="settings-option">
                    <el-button type="primary" @click="handleManageCookies">管理 Cookies</el-button>
                  </div>
                </div>
              </div>
              <div v-if="activeSettingsTab === 'profile'" class="settings-panel-content">
                <h2>个人中心</h2>
                <p>查看和管理您的个人资料</p>

                <!-- 个人资料 -->
                <div class="settings-section">
                  <h3>个人资料</h3>
                  <div class="profile-info">
                    <div class="profile-avatar">
                      <el-avatar :size="80" :src="userInfo.avatar">
                        <el-icon><User /></el-icon>
                      </el-avatar>
                      <el-button type="primary" size="small" class="upload-avatar-btn">
                        <el-icon><Camera /></el-icon>
                        更换头像
                      </el-button>
                    </div>
                    <el-form :model="profileForm" label-width="100px" class="profile-form">
                      <el-form-item label="用户名">
                        <el-input v-model="profileForm.username" placeholder="请输入用户名" />
                      </el-form-item>
                      <el-form-item label="邮箱">
                        <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
                      </el-form-item>
                      <el-form-item label="手机号">
                        <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
                      </el-form-item>
                      <el-form-item label="职业背景">
                        <el-select v-model="profileForm.profession" placeholder="请选择职业背景">
                          <el-option label="临床医生" value="doctor" />
                          <el-option label="医学研究员" value="researcher" />
                          <el-option label="医学生" value="student" />
                          <el-option label="药剂师" value="pharmacist" />
                          <el-option label="其他" value="other" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="所在机构">
                        <el-input v-model="profileForm.institution" placeholder="请输入所在机构" />
                      </el-form-item>
                      <el-form-item label="个人简介">
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
                  </div>
                </div>
              </div>
              <div v-if="activeSettingsTab === 'subscription'" class="settings-panel-content">
                <h2>订阅管理</h2>
                <p>管理您的订阅计划和支付信息</p>

                <!-- 当前计划 -->
                <div class="settings-section">
                  <h3>当前计划</h3>
                  <div class="current-plan-card">
                    <div class="plan-header">
                      <div class="plan-info">
                        <h4 class="plan-title">当前计划：Pro</h4>
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
                  </div>
                </div>

                <!-- 套餐选择 -->
                <div class="settings-section">
                  <h3>选择适合您的计划</h3>
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
                </div>

                <!-- 支付信息 -->
                <div class="settings-section">
                  <h3>支付信息</h3>
                  <div class="payment-info">
                    <div class="payment-item">
                      <div class="payment-icon">
                        <el-icon :size="24"><Wallet /></el-icon>
                      </div>
                      <div class="payment-details">
                        <div class="payment-title">微信支付</div>
                        <div class="payment-desc">已绑定</div>
                      </div>
                      <el-button type="primary" size="small">管理</el-button>
                    </div>
                    <div class="payment-item">
                      <div class="payment-icon">
                        <el-icon :size="24"><CreditCard /></el-icon>
                      </div>
                      <div class="payment-details">
                        <div class="payment-title">支付宝</div>
                        <div class="payment-desc">未绑定</div>
                      </div>
                      <el-button type="primary" size="small" plain>绑定</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeSettingsTab === 'member'" class="settings-panel-content">
                <h2>会员中心</h2>
                <p>查看您的会员权益和积分信息</p>
              </div>
              <div v-if="activeSettingsTab === 'help'" class="settings-panel-content">
                <h2>帮助反馈</h2>
                <p>获取帮助或向我们反馈问题</p>
              </div>
            </div>
          </div>
        </el-dialog>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <!-- 顶部登录按钮 -->
        <div class="top-right-actions">
          <template v-if="!isLoggedIn">
            <el-button type="primary" @click="handleLogin" class="login-btn">
              登录
            </el-button>
          </template>
          <template v-else>
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userInfo.username }}</span>
            </div>
            <el-dropdown @command="handleUserCommand" trigger="click" class="user-menu-dropdown">
              <div class="user-dropdown">
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
        
        <!-- 历史对话记录面板 -->
        <transition name="panel-slide">
          <aside v-if="historyPanelVisible" class="history-panel">
            <div class="history-panel-header">
              <h2 class="history-panel-title">任务列表</h2>
              <el-button class="refresh-button" :icon="Refresh" circle size="small" @click="refreshHistory" />
            </div>
            <div class="history-panel-body">
              <div class="history-search">
                <el-input
                  v-model="historySearchKeyword"
                  placeholder="搜索对话"
                  clearable
                  prefix-icon="Search"
                />
              </div>
              <div class="history-list">
                <div
                  v-for="item in filteredHistoryItems"
                  :key="item.id"
                  class="history-item"
                  :class="{ 'is-active': activeHistoryId === item.id }"
                  @click="selectHistory(item.id)"
                >
                  <div class="history-item-content">
                    <div class="history-item-name">{{ item.name }}</div>
                    <div class="history-item-time">{{ formatHistoryTime(item.time) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </transition>
        <div class="content-wrapper" :class="{ 'panel-open': historyPanelVisible }">
          <router-view />
        </div>
      </main>
    </div>

    <!-- 移动端导航切换按钮 -->
    <div v-if="isMobile" class="mobile-nav-toggle" @click="toggleSidebar">
      <el-icon :size="24"><Menu /></el-icon>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  ArrowDown,
  Wallet,
  SwitchButton,
  Menu,
  Refresh,
  Folder,
  Document,
  Clock,
  ChatLineSquare,
  Star,
  QuestionFilled,
  Setting,
  Brush,
  Fold,
  Expand,
  Camera,
  CreditCard,
  Check,
  Close,
  Plus
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth_mock'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 历史对话记录状态
const historyPanelVisible = ref(false)
const historySearchKeyword = ref('')
const activeHistoryId = ref<number | null>(null)

// 模拟历史对话数据
const historyItems = ref([
  {
    id: 1,
    name: '心血管疾病学术论文大纲',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    messages: []
  },
  {
    id: 2,
    name: '医学影像分析报告',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    messages: []
  },
  {
    id: 3,
    name: '临床数据分析结果',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2天前
    messages: []
  },
  {
    id: 4,
    name: 'AI科研助手对话记录',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7天前
    messages: []
  }
])

// 登录状态
const isLoggedIn = computed(() => authStore.isAuthenticated)

// 用户信息
const userInfo = computed(() => authStore.user || { username: '用户', avatar: '' })

// 移动端检测
const isMobile = ref(false)
const sidebarVisible = ref(true)

// 设置弹窗
const settingsDialogVisible = ref(false)
const activeSettingsTab = ref('account')

// 界面设置
const languageSetting = ref('zh-CN')
const themeSetting = ref('light')
const exclusiveContent = ref(false)
const taskEmailNotification = ref(false)

// 管理 Cookies
const handleManageCookies = () => {
  ElMessage.info('Cookies 管理功能即将上线')
}

// 升级会员
const handleUpgrade = (plan: string) => {
  ElMessage.info(`升级到${plan === 'pro' ? 'Pro' : 'Max'}功能即将上线`)
}

// 个人资料表单
const profileForm = ref({
  username: 'tangqing574839',
  email: 'tangqing574839@163.com',
  phone: '',
  profession: '',
  institution: '',
  bio: ''
})

// 保存个人资料
const handleSaveProfile = () => {
  ElMessage.success('个人资料保存成功')
}

// 重置个人资料
const handleResetProfile = () => {
  profileForm.value = {
    username: 'tangqing574839',
    email: 'tangqing574839@163.com',
    phone: '',
    profession: '',
    institution: '',
    bio: ''
  }
  ElMessage.info('已重置为原始信息')
}

// 设置菜单项
const settingsMenuItems = [
  { id: 'account', name: '账户设置', icon: User },
  { id: 'appearance', name: '界面设置', icon: Brush },
  { id: 'profile', name: '个人中心', icon: User },
  { id: 'subscription', name: '订阅管理', icon: Wallet },
  { id: 'member', name: '会员中心', icon: Star },
  { id: 'help', name: '帮助反馈', icon: QuestionFilled }
]

// 新的侧边栏菜单配置
const sidebarMenu = [
  // ====== 模块1：个人工作区（高频核心）======
  {
    moduleName: '个人工作区',
    items: [
      {
        name: '新建任务',
        icon: Plus,
        route: '/',
        badge: null
      },
      {
        name: '我的项目',
        icon: Folder,
        route: '/projects',
        badge: 0
      },
      {
        name: '我的成果',
        icon: Document,
        route: '/outputs'
      },
      {
        name: '最近使用',
        icon: Clock,
        route: '/recent'
      }
    ]
  },
  // ====== 模块2：任务管理 =====
  {
    moduleName: '任务管理',
    items: [
      {
        name: '我的任务',
        icon: ChatLineSquare,
        route: '/my-tasks',
        badge: 0
      }
    ]
  }
]

// 判断是否激活
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// 角标动态更新逻辑
const updateBadge = () => {
  // 为'我的项目'条目更新角标（跳过'新建任务'）
  sidebarMenu[0].items[1].badge = Math.floor(Math.random() * 5) + 1
}

// 每30秒更新一次角标
let badgeUpdateInterval: number | null = null

// 导航点击
const handleNavClick = (path: string) => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }

  // 如果是新建任务（首页），强制重新加载
  if (path === '/') {
    if (route.path === '/') {
      // 如果已经在首页，强制刷新
      window.location.reload()
    } else {
      // 如果不在首页，跳转到首页
      router.push('/')
    }
  } else {
    router.push(path)
  }
}

// 用户菜单命令
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'logout':
      handleLogout()
      break
  }
}

// 登录
const handleLogin = () => {
  router.push('/login')
}

// 退出登录
const handleLogout = () => {
  authStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 刷新历史记录
const refreshHistory = () => {
  ElMessage.success('历史记录已刷新')
  // 实际项目中这里应该调用API刷新数据
}

// 格式化历史记录时间
const formatHistoryTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// 选择历史记录
const selectHistory = (id: number) => {
  activeHistoryId.value = id
  // 实际项目中这里应该加载对应对话的详细内容
  ElMessage.success('已加载历史对话')
}

// 过滤历史记录
const filteredHistoryItems = computed(() => {
  if (!historySearchKeyword.value) return historyItems.value
  const keyword = historySearchKeyword.value.toLowerCase()
  return historyItems.value.filter(item =>
    item.name.toLowerCase().includes(keyword)
  )
})

// 检测屏幕尺寸
const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
  sidebarVisible.value = !isMobile.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  
  // 初始化角标
  updateBadge()
  
  // 设置定时更新
  badgeUpdateInterval = window.setInterval(() => {
    updateBadge()
  }, 30000)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
  
  // 清除定时器
  if (badgeUpdateInterval !== null) {
    clearInterval(badgeUpdateInterval)
    badgeUpdateInterval = null
  }
})
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f7;
}

/* 主体内容 */
.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 顶部右侧操作区域 */
.top-right-actions {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
}

/* 登录按钮 */
.login-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border: none;
  border-radius: 8px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.95);
}

.user-avatar {
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.username {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

/* 用户下拉菜单 */
.user-menu-dropdown {
  cursor: pointer;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
}

.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

/* 左侧导航栏 - Manus Style */
.sidebar {
  width: 200px;
  background-color: #f5f5f7;
  padding: 20px 8px;
  overflow-y: auto;
  flex-shrink: 0;
  transition: transform var(--transition-normal, 0.3s), width var(--transition-normal, 0.3s);
  border-right: 1px solid #d2d2d7;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  position: sticky;
  top: 0;
}

/* 侧边栏收起状态 */
.sidebar:not(.sidebar-visible) {
  width: 60px;
}

.sidebar:not(.sidebar-visible) .logo-text,
.sidebar:not(.sidebar-visible) .nav-text,
.sidebar:not(.sidebar-visible) .nav-module-title,
.sidebar:not(.sidebar-visible) .personalize-text,
.sidebar:not(.sidebar-visible) .share-text,
.sidebar:not(.sidebar-visible) .settings-text {
  display: none;
}

.sidebar:not(.sidebar-visible) .nav-item,
.sidebar:not(.sidebar-visible) .sidebar-settings {
  justify-content: center;
  padding: 10px;
}

.sidebar:not(.sidebar-visible) .nav-badge {
  display: none;
}

.sidebar:not(.sidebar-visible) .logo-icon {
  margin: 0 auto;
}

.sidebar:not(.sidebar-visible) .sidebar-logo {
  justify-content: center;
  padding-bottom: 0;
}

.sidebar:not(.sidebar-visible) .sidebar-toggle {
  position: static;
  margin-top: 8px;
}

.sidebar:not(.sidebar-visible) .sidebar-header {
  position: static;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
}

/* 侧边栏头部 */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

/* Logo 区域 */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  padding: 8px;
}

.sidebar-logo:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sidebar-logo.is-active {
  background-color: rgba(139, 92, 246, 0.1);
}

/* 侧边栏切换按钮 */
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #86868b;
}

.sidebar-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.logo-version {
  font-size: 11px;
  color: #86868b;
  font-weight: 400;
}

/* 导航菜单 */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* 导航模块 */
.nav-module {
  margin-bottom: 12px;
}

.nav-module-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 14px;
}

.nav-module-title {
  font-size: 11px;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 14px;
  margin-bottom: 6px;
}

/* 首页入口 */
.home-entry {
  margin-bottom: 8px;
  font-weight: 500;
}

.home-entry:hover {
  background-color: rgba(139, 92, 246, 0.1);
}

/* 导航角标 */
.nav-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  position: relative;
  margin-bottom: 2px;
  font-size: 14px;
  color: #1d1d1f;
  min-height: 40px;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
  transform: translateX(2px);
}

.nav-item-active {
  background-color: #2d2d32;
  color: #ffffff;
  font-weight: 500;
}

.nav-item-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: #8b5cf6;
  border-radius: 0 2px 2px 0;
}

.nav-text {
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1f;
  line-height: 1.4;
}

.nav-item-active .nav-text {
  color: #ffffff;
  font-weight: 500;
}

/* 底部区域 */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: 8px;
  border-top: 1px solid #d2d2d7;
  flex-shrink: 0;
}

.sidebar-settings {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar-settings:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sidebar-settings .el-icon {
  color: #666;
  transition: all 0.3s;
}

.sidebar-settings:hover .el-icon {
  color: #8b5cf6;
}

.settings-text {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

/* 设置弹窗样式 - Manus Style */
.settings-dialog .el-dialog__body {
  padding: 0;
  overflow: hidden;
}

.settings-dialog .el-dialog__header {
  border-bottom: 1px solid var(--border-light);
  padding: 20px 24px;
}

.settings-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

/* 固定弹窗高度并添加滚动条 - 使用更深的选择器 */
.settings-dialog :deep(.el-dialog) {
  height: 600px !important;
  max-height: 600px !important;
  display: flex !important;
  flex-direction: column !important;
}

.settings-dialog :deep(.el-dialog__body) {
  flex: 1 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 0 !important;
}

.settings-dialog :deep(.el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

.settings-dialog :deep(.el-dialog__body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.settings-dialog :deep(.el-dialog__body::-webkit-scrollbar-thumb) {
  background: #ccc;
  border-radius: 3px;
}

.settings-dialog :deep(.el-dialog__body::-webkit-scrollbar-thumb:hover) {
  background: #999;
}

.settings-dialog :deep(.settings-content) {
  height: 100%;
  overflow: hidden;
  display: flex;
}

.settings-dialog :deep(.settings-menu) {
  overflow-y: auto;
  overflow-x: hidden;
}

.settings-dialog :deep(.settings-panel) {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.settings-dialog :deep(.settings-panel::-webkit-scrollbar) {
  width: 6px;
}

.settings-dialog :deep(.settings-panel::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.settings-dialog :deep(.settings-panel::-webkit-scrollbar-thumb) {
  background: #ccc;
  border-radius: 3px;
}

.settings-dialog :deep(.settings-panel::-webkit-scrollbar-thumb:hover) {
  background: #999;
}

/* 修改按钮颜色为灰色 */
.settings-dialog .el-button--primary {
  background-color: #999 !important;
  border-color: #999 !important;
  color: #fff !important;
}

.settings-dialog .el-button--primary:hover {
  background-color: #888 !important;
  border-color: #888 !important;
}

/* 修改单选按钮颜色为灰色 */
.settings-dialog .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background-color: #999 !important;
  border-color: #999 !important;
  color: #fff !important;
}

.settings-dialog .el-radio-button__inner:hover {
  color: #999 !important;
}

/* 修改开关按钮颜色为灰色 */
.settings-dialog .el-switch.is-checked .el-switch__core {
  background-color: #999 !important;
  border-color: #999 !important;
}

.settings-dialog .el-switch.is-checked .el-switch__action {
  background-color: #fff !important;
}

.settings-content {
  display: flex;
  min-height: 600px;
  background-color: var(--bg-primary);
}

.settings-menu {
  width: 240px;
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-light);
  padding: 8px;
}

.settings-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: var(--font-weight-body);
}

.settings-menu-item:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.settings-menu-item.is-active {
  background-color: #f0f0f0;
  color: #333;
  font-weight: var(--font-weight-title);
}

.settings-panel {
  flex: 1;
  padding: 32px;
  background-color: var(--bg-primary);
}

.settings-panel-content h2 {
  font-size: 28px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.settings-panel-content p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
  margin-bottom: 32px;
}

.settings-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.settings-section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.settings-section h3 {
  font-size: 18px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.settings-option {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-card);
}

.option-item:hover {
  background-color: var(--bg-hover);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-title {
  font-size: 15px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

.option-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: var(--line-height-comfortable);
}

/* 账户信息样式 - Manus Style */
.account-info {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-name {
  font-size: 20px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.account-email {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 会员状态样式 - Manus Style */
.membership-card {
  padding: 24px;
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  border-radius: var(--radius-md);
  color: #333;
  box-shadow: var(--shadow-button);
}

.membership-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.membership-type {
  font-size: 28px;
  font-weight: var(--font-weight-title);
  letter-spacing: -0.5px;
}

/* 积分信息样式 - Manus Style */
.points-info {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.points-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.points-value {
  font-size: 28px;
  font-weight: var(--font-weight-title);
  color: #666;
  letter-spacing: -0.5px;
}

.points-label {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}

.points-divider {
  width: 1px;
  height: 48px;
  background-color: var(--border-light);
}

/* 个人中心样式 - Manus Style */
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-avatar-btn {
  margin-top: 8px;
}

.profile-form {
  max-width: 600px;
}

/* 订阅管理样式 - Manus Style */
.current-plan-card {
  padding: 28px;
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  border-radius: var(--radius-md);
  color: #333;
  box-shadow: var(--shadow-button);
}

.current-plan-card .plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.current-plan-card .plan-title {
  font-size: 22px;
  font-weight: var(--font-weight-title);
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
}

.current-plan-card .plan-desc {
  font-size: 14px;
  opacity: 0.95;
  margin: 0;
}

.current-plan-card .plan-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.current-plan-card .feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}

.plans-table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.plan-column {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all var(--transition-normal);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.plan-column:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
  transform: translateY(-4px);
}

.plan-column .plan-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-column h4 {
  font-size: 22px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.3px;
}

.plan-column .price {
  font-size: 36px;
  font-weight: var(--font-weight-title);
  color: var(--primary);
  margin: 8px 0;
  letter-spacing: -0.5px;
}

.plan-column .period {
  font-size: 14px;
  font-weight: var(--font-weight-body);
  color: var(--text-secondary);
}

.plan-column .plan-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.plan-column .feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}

.plan-btn {
  width: 100%;
  margin-top: auto;
}

/* 支付信息样式 - Manus Style */
.payment-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-card);
}

.payment-item:hover {
  background-color: var(--bg-hover);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.payment-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-active) 100%);
  border-radius: var(--radius-sm);
  color: var(--text-button);
  flex-shrink: 0;
  box-shadow: var(--shadow-button);
}

.payment-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment-title {
  font-size: 16px;
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

.payment-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.personalize-section,
.share-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.personalize-section:hover,
.share-section:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.personalize-icon,
.share-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  color: #8b5cf6;
  flex-shrink: 0;
}

.personalize-text,
.share-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.personalize-title,
.share-title {
  font-size: 13px;
  font-weight: 500;
  color: #1d1d1f;
}

.personalize-desc {
  font-size: 11px;
  color: #86868b;
}

.share-reward {
  font-size: 11px;
  color: #8b5cf6;
  font-weight: 500;
}

/* 主内容区域 - Manus Style */
.main-content {
  background-color: #f5f5f7;
  overflow-y: auto;
  flex: 1;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.content-wrapper.panel-open {
  max-width: calc(100% - 240px);
}



/* 历史对话记录面板 */
.history-panel {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 240px;
  background-color: var(--bg-secondary, #1a1a1c);
  border-right: 1px solid var(--border-dark, #3a3a3c);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  z-index: 999;
  overflow-y: auto;
  transition: transform var(--transition-normal, 0.3s) var(--ease-out, cubic-bezier(0.215, 0.61, 0.355, 1));
}

.history-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-dark, #3a3a3c);
}

.history-panel-title {
  font-size: 16px;
  font-weight: var(--font-weight-title, 600);
  color: var(--text-sidebar, #e5e5e7);
  margin: 0;
}

.refresh-button {
  color: var(--text-sidebar, #e5e5e7);
  background-color: transparent;
  border: none;
}

.refresh-button:hover {
  color: var(--text-sidebar, #e5e5e7);
  background-color: rgba(255, 255, 255, 0.1);
}

.history-panel-body {
  padding: 16px;
}

.history-search {
  margin-bottom: 16px;
}

.history-search :deep(.el-input__wrapper) {
  background-color: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #d2d2d7);
  border-radius: var(--radius-sm, 8px);
}

.history-search :deep(.el-input__inner) {
  color: var(--text-primary, #1d1d1f);
}

.history-search :deep(.el-input__inner::placeholder) {
  color: var(--text-secondary, #86868b);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  transition: all var(--transition-normal, 0.3s) var(--ease-out, cubic-bezier(0.215, 0.61, 0.355, 1));
  background-color: transparent;
}

.history-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.history-item.is-active {
  background-color: rgba(139, 92, 246, 0.2);
  border-left: 3px solid var(--primary, #8b5cf6);
}

.history-item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item-name {
  font-size: 14px;
  font-weight: var(--font-weight-body, 400);
  color: var(--text-sidebar, #e5e5e7);
  flex: 1;
}

.history-item-time {
  font-size: 12px;
  color: var(--text-sidebar, #e5e5e7);
}

/* 面板滑入动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from {
  transform: translateX(-100%);
}

.panel-slide-leave-to {
  transform: translateX(-100%);
}

.panel-slide-enter-to {
  transform: translateX(0);
}

.panel-slide-leave-from {
  transform: translateX(0);
}

/* 移动端导航切换按钮 */
.mobile-nav-toggle {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s;
}

.mobile-nav-toggle:hover {
  transform: scale(1.1);
}

/* 响应式设计 */
/* 超大屏 > 1920px */
@media screen and (min-width: 1921px) {
  .sidebar {
    width: 320px;
  }

  .content-wrapper {
    max-width: 1400px;
    padding: 48px 32px;
  }
}

/* 大屏 1441px - 1920px */
@media screen and (min-width: 1441px) {
  .sidebar {
    width: 280px;
  }
  
  .content-wrapper {
    max-width: 1200px;
    padding: 40px 28px;
  }
}

/* 桌面端 1024px - 1440px */
@media screen and (min-width: 1024px) and (max-width: 1440px) {
  .sidebar {
    width: 260px;
  }
  
  .content-wrapper {
    max-width: 1100px;
    padding: 32px 24px;
  }
}

/* 平板端 768px - 1023px */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .sidebar {
    width: 220px;
  }
  
  .sidebar-nav {
    gap: 2px;
  }
  
  .nav-item {
    padding: 10px 12px;
  }
  
  .nav-text {
    font-size: 13px;
  }
  
  .content-wrapper {
    max-width: 100%;
    padding: 24px 20px;
  }
}

/* 移动端 < 768px */
@media screen and (max-width: 767px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    width: 280px;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  }

  .sidebar.sidebar-visible {
    transform: translateX(0);
  }

  .mobile-nav-toggle {
    display: flex;
  }

  .content-wrapper {
    max-width: 100%;
    padding: 16px;
  }
  
  .top-header {
    padding: 0 16px;
  }
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background-color: #D1D5DB;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover {
  background-color: #9CA3AF;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
