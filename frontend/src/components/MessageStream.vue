<template>
  <div class="message-stream" ref="streamContainer">
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
        <div class="message-text">
          <span v-if="message.typing" class="typing-text">{{ displayTexts[index] }}</span>
          <span v-else>{{ message.content }}</span>
          <span v-if="message.typing" class="cursor">|</span>
        </div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { User, ChatDotRound } from '@element-plus/icons-vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
  typing?: boolean
}

interface Props {
  messages: Message[]
  typingSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  typingSpeed: 50
})

const emit = defineEmits<{
  (e: 'typing-complete', index: number): void
}>()

// 流容器引用
const streamContainer = ref<HTMLElement>()

// 显示的文本数组
const displayTexts = ref<string[]>([])

// 打字动画
const typeText = async (text: string, index: number) => {
  let currentText = ''
  displayTexts.value[index] = ''

  for (let i = 0; i < text.length; i++) {
    currentText += text[i]
    displayTexts.value[index] = currentText

    // 自动滚动到底部
    await nextTick()
    scrollToBottom()

    // 等待指定时间
    await new Promise(resolve => setTimeout(resolve, props.typingSpeed))
  }

  // 打字完成
  emit('typing-complete', index)
}

// 滚动到底部
const scrollToBottom = () => {
  if (streamContainer.value) {
    streamContainer.value.scrollTop = streamContainer.value.scrollHeight
  }
}

// 监听消息变化
watch(() => props.messages, (newMessages) => {
  newMessages.forEach((message, index) => {
    if (message.typing && !displayTexts.value[index]) {
      typeText(message.content, index)
    } else if (!message.typing) {
      displayTexts.value[index] = message.content
    }
  })
}, { immediate: true, deep: true })

// 暴露方法
defineExpose({
  scrollToBottom
})
</script>

<style scoped lang="scss">
.message-stream {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;

  .message-item {
    display: flex;
    gap: 12px;

    &.user {
      flex-direction: row-reverse;

      .message-content {
        align-items: flex-end;

        .message-text {
          background-color: var(--el-color-primary);
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .typing-text {
          display: inline-block;
        }

        .cursor {
          display: inline-block;
          animation: blink 1s infinite;
          margin-left: 2px;
        }
      }

      .message-time {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
