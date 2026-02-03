<template>
  <div class="mobile-home">
    <!-- 顶部导航栏 -->
    <div class="header">
      <h1 class="title">MedAGI</h1>
      <div class="header-actions">
        <el-button circle text @click="handleNewChat">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="chat-container" ref="chatContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <el-icon :size="64" color="#909399"><ChatDotRound /></el-icon>
        <p class="empty-text">开始新的对话</p>
        <div class="quick-actions">
          <div class="action-item" @click="handleQuickAction('分析医学文献')">
            <el-icon><Document /></el-icon>
            <span>分析医学文献</span>
          </div>
          <div class="action-item" @click="handleQuickAction('查询药物信息')">
            <el-icon><Medicine /></el-icon>
            <span>查询药物信息</span>
          </div>
          <div class="action-item" @click="handleQuickAction('疾病诊断辅助')">
            <el-icon><Stethoscope /></el-icon>
            <span>疾病诊断辅助</span>
          </div>
          <div class="action-item" @click="handleQuickAction('临床试验设计')">
            <el-icon><DataAnalysis /></el-icon>
            <span>临床试验设计</span>
          </div>
        </div>
      </div>

      <div v-else class="messages-list">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-item', message.role]"
        >
          <div class="message-avatar">
            <el-avatar v-if="message.role === 'user'" :size="40">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div v-else class="ai-avatar">
              <el-icon><ChatDotRound /></el-icon>
            </div>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-wrapper">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="1"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="输入您的问题..."
          @keydown.enter.prevent="handleSend"
        />
        <el-button
          type="primary"
          circle
          :disabled="!inputMessage.trim()"
          @click="handleSend"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  ChatDotRound,
  Document,
  DataAnalysis,
  User,
  Promotion
} from '@element-plus/icons-vue'

// 消息列表
const messages = ref<Array<{
  role: 'user' | 'assistant'
  content: string
  time: string
}>>([])

// 输入消息
const inputMessage = ref('')

// 聊天容器引用
const chatContainer = ref<HTMLElement>()

// 新对话
const handleNewChat = () => {
  messages.value = []
  ElMessage.success('已创建新对话')
}

// 快捷操作
const handleQuickAction = (action: string) => {
  inputMessage.value = action
  handleSend()
}

// 发送消息
const handleSend = () => {
  if (!inputMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString()
  })

  // 清空输入框
  const userMessage = inputMessage.value
  inputMessage.value = ''

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `我已收到您的问题："${userMessage}"，正在为您分析...`,
      time: new Date().toLocaleTimeString()
    })
    nextTick(() => {
      scrollToBottom()
    })
  }, 1000)
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped lang="scss">
.mobile-home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;

  // 顶部导航栏
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  // 对话区域
  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    // 空状态
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 20px;

      .empty-text {
        font-size: 16px;
        color: #909399;
        margin: 20px 0 30px;
      }

      .quick-actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        width: 100%;
        max-width: 400px;

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 16px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s;

          &:active {
            transform: scale(0.95);
          }

          .el-icon {
            font-size: 32px;
            color: #409eff;
          }

          span {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }

    // 消息列表
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .message-item {
        display: flex;
        gap: 12px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            align-items: flex-end;

            .message-text {
              background-color: #409eff;
              color: #fff;
            }
          }
        }

        .message-avatar {
          flex-shrink: 0;

          .ai-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;

            .el-icon {
              color: #fff;
              font-size: 20px;
            }
          }
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 70%;

          .message-text {
            padding: 12px 16px;
            background-color: #fff;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.6;
            word-break: break-word;
          }

          .message-time {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  // 输入区域
  .input-area {
    padding: 12px 16px;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

    .input-wrapper {
      display: flex;
      gap: 12px;
      align-items: flex-end;

      :deep(.el-textarea) {
        flex: 1;

        .el-textarea__inner {
          border-radius: 20px;
          padding: 10px 16px;
          resize: none;
        }
      }
    }
  }
}
</style>
