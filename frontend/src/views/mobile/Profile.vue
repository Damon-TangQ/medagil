<template>
  <div class="mobile-profile">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-info">
        <el-avatar :size="80" :src="user.avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <div class="user-details">
          <h2 class="user-name">{{ user.nickname || user.username }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <el-tag type="success" size="small">{{ user.subscriptionLevel === 'pro' ? 'Pro会员' : '普通用户' }}</el-tag>
        </div>
      </div>
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
          <span class="stat-value">{{ stats.points }}</span>
          <span class="stat-label">积分</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="handleMyProjects">
          <div class="menu-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <span class="menu-label">我的项目</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="handleMyTasks">
          <div class="menu-icon">
            <el-icon><List /></el-icon>
          </div>
          <span class="menu-label">我的任务</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="handleMyFavorites">
          <div class="menu-icon">
            <el-icon><Star /></el-icon>
          </div>
          <span class="menu-label">我的收藏</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-item" @click="handleSubscription">
          <div class="menu-icon">
            <el-icon><Wallet /></el-icon>
          </div>
          <span class="menu-label">订阅管理</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="handlePoints">
          <div class="menu-icon">
            <el-icon><Coin /></el-icon>
          </div>
          <span class="menu-label">积分商城</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="handleSettings">
          <div class="menu-icon">
            <el-icon><Setting /></el-icon>
          </div>
          <span class="menu-label">设置</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-item" @click="handleHelp">
          <div class="menu-icon">
            <el-icon><QuestionFilled /></el-icon>
          </div>
          <span class="menu-label">帮助与反馈</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="handleAbout">
          <div class="menu-icon">
            <el-icon><InfoFilled /></el-icon>
          </div>
          <span class="menu-label">关于我们</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <el-button class="logout-btn" @click="handleLogout">
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Folder,
  List,
  Star,
  Wallet,
  Coin,
  Setting,
  QuestionFilled,
  InfoFilled,
  ArrowRight
} from '@element-plus/icons-vue'

// 用户信息
const user = ref({
  username: 'user001',
  nickname: '医学研究者',
  email: 'user@example.com',
  avatar: '',
  subscriptionLevel: 'pro'
})

// 用户统计
const stats = ref({
  projectCount: 12,
  taskCount: 45,
  points: 2580
})

// 我的项目
const handleMyProjects = () => {
  ElMessage.info('跳转到我的项目')
}

// 我的任务
const handleMyTasks = () => {
  ElMessage.info('跳转到我的任务')
}

// 我的收藏
const handleMyFavorites = () => {
  ElMessage.info('跳转到我的收藏')
}

// 订阅管理
const handleSubscription = () => {
  ElMessage.info('跳转到订阅管理')
}

// 积分商城
const handlePoints = () => {
  ElMessage.info('跳转到积分商城')
}

// 设置
const handleSettings = () => {
  ElMessage.info('跳转到设置')
}

// 帮助与反馈
const handleHelp = () => {
  ElMessage.info('跳转到帮助与反馈')
}

// 关于我们
const handleAbout = () => {
  ElMessage.info('跳转到关于我们')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已退出登录')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.mobile-profile {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 20px;

  // 用户信息卡片
  .user-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px 20px 24px;
    color: #fff;

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      .user-details {
        flex: 1;

        .user-name {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .user-email {
          font-size: 14px;
          opacity: 0.9;
          margin: 0 0 12px;
        }
      }
    }

    .user-stats {
      display: flex;
      justify-content: space-around;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
        }

        .stat-label {
          font-size: 13px;
          opacity: 0.9;
        }
      }
    }
  }

  // 功能菜单
  .menu-section {
    padding: 16px;

    .menu-group {
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;

      .menu-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.3s;

        &:last-child {
          border-bottom: none;
        }

        &:active {
          background-color: #f5f7fa;
        }

        .menu-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;

          .el-icon {
            font-size: 18px;
            color: #606266;
          }
        }

        .menu-label {
          flex: 1;
          font-size: 15px;
          color: #303133;
        }

        .menu-arrow {
          color: #c0c4cc;
        }
      }
    }
  }

  // 退出登录按钮
  .logout-section {
    padding: 16px;

    .logout-btn {
      width: 100%;
      height: 44px;
      font-size: 15px;
      border-radius: 12px;
    }
  }
}
</style>
