<template>
  <div class="home-genspark">
    <!-- 顶部标题区域 -->
    <div class="header-section">
      <h1 class="main-title">Medagil AI 工作空间 2.0</h1>
      <p class="sub-title">询问任何科研问题，创造任何学术成果</p>
    </div>

    <!-- 主搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="输入您的科研问题或项目需求..."
            @keyup.enter="handleSearch"
          />
          <button class="search-button" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        <p class="search-hint">Medagil 支持个性化医学科研工具</p>
      </div>
    </div>

    <!-- 智能体功能网格 -->
    <div class="agents-section">
      <div class="agents-grid">
        <!-- 论著写作类 -->
        <div class="agent-category">
          <div class="category-title">论著写作类</div>
          <div class="agent-cards">
            <div
              v-for="agent in writingAgents"
              :key="agent.name"
              class="agent-card"
              @click="handleAgentClick(agent)"
            >
              <div class="agent-icon" :style="{ backgroundColor: agent.color }">
                <span class="icon-text">{{ agent.iconText }}</span>
              </div>
              <div class="agent-name">{{ agent.name }}</div>
              <div class="agent-desc">{{ agent.description }}</div>
            </div>
          </div>
        </div>

        <!-- 基金申请类 -->
        <div class="agent-category">
          <div class="category-title">基金申请类</div>
          <div class="agent-cards">
            <div
              v-for="agent in grantAgents"
              :key="agent.name"
              class="agent-card"
              @click="handleAgentClick(agent)"
            >
              <div class="agent-icon" :style="{ backgroundColor: agent.color }">
                <span class="icon-text">{{ agent.iconText }}</span>
              </div>
              <div class="agent-name">{{ agent.name }}</div>
              <div class="agent-desc">{{ agent.description }}</div>
            </div>
          </div>
        </div>

        <!-- 毕业课题类 -->
        <div class="agent-category">
          <div class="category-title">毕业课题类</div>
          <div class="agent-cards">
            <div
              v-for="agent in thesisAgents"
              :key="agent.name"
              class="agent-card"
              @click="handleAgentClick(agent)"
            >
              <div class="agent-icon" :style="{ backgroundColor: agent.color }">
                <span class="icon-text">{{ agent.iconText }}</span>
              </div>
              <div class="agent-name">{{ agent.name }}</div>
              <div class="agent-desc">{{ agent.description }}</div>
            </div>
          </div>
        </div>

        <!-- 科研工具类 -->
        <div class="agent-category">
          <div class="category-title">科研工具类</div>
          <div class="agent-cards">
            <div
              v-for="agent in toolAgents"
              :key="agent.name"
              class="agent-card"
              @click="handleAgentClick(agent)"
            >
              <div class="agent-icon" :style="{ backgroundColor: agent.color }">
                <span class="icon-text">{{ agent.iconText }}</span>
              </div>
              <div class="agent-name">{{ agent.name }}</div>
              <div class="agent-desc">{{ agent.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 所有智能体按钮 -->
    <div class="view-all-section">
      <button class="view-all-button" @click="handleViewAll">
        查看所有智能体
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')

// 论著写作类智能体
const writingAgents = ref([
  {
    name: '临床论著助手',
    description: '协助临床论著的撰写与修改',
    iconText: '📝',
    color: '#667eea'
  },
  {
    name: '基础论著助手',
    description: '帮助完成基础医学论著写作',
    iconText: '📄',
    color: '#764ba2'
  },
  {
    name: '综述助手',
    description: '快速生成高质量文献综述',
    iconText: '📚',
    color: '#f093fb'
  }
])

// 基金申请类智能体
const grantAgents = ref([
  {
    name: '国自然面上基金助手',
    description: '辅助撰写国家自然科学基金面上项目',
    iconText: '💼',
    color: '#667eea'
  },
  {
    name: '国自然重点基金助手',
    description: '协助撰写国家自然科学基金重点项目',
    iconText: '🎯',
    color: '#764ba2'
  }
])

// 毕业课题类智能体
const thesisAgents = ref([
  {
    name: '博士基础研究课题助手',
    description: '辅助博士基础研究课题设计',
    iconText: '🔬',
    color: '#667eea'
  },
  {
    name: '博士临床研究课题助手',
    description: '协助博士临床研究课题设计',
    iconText: '🏥',
    color: '#764ba2'
  }
])

// 科研工具类智能体
const toolAgents = ref([
  {
    name: '文献分析助手',
    description: '深度分析文献内容与数据',
    iconText: '📊',
    color: '#667eea'
  },
  {
    name: '智能选刊助手',
    description: '智能推荐最适合的期刊',
    iconText: '🎓',
    color: '#764ba2'
  }
])

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  // 跳转到TaskChat页面并传递搜索查询
  router.push({
    path: '/task-chat',
    query: { q: searchQuery.value }
  })
}

const handleAgentClick = (agent: any) => {
  ElMessage.success(`选择: ${agent.name}`)
}

const handleViewAll = () => {
  router.push('/agents')
}
</script>

<style scoped>
.home-genspark {
  min-height: 100vh;
  background: #ffffff;
  padding: 60px 24px 80px;
}

.header-section {
  text-align: center;
  margin-bottom: 48px;
}

.main-title {
  font-size: 56px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -1px;
  line-height: 1.2;
}

.sub-title {
  font-size: 20px;
  color: #666;
  font-weight: 400;
  margin: 0;
}

.search-section {
  max-width: 800px;
  margin: 0 auto 64px;
}

.search-container {
  width: 100%;
}

.search-wrapper {
  position: relative;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 18px 60px 18px 24px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  background: #667eea;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.search-button:hover {
  background: #5568d3;
}

.search-hint {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: #999;
}

.agents-section {
  max-width: 1400px;
  margin: 0 auto;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.agent-category {
  background: #f9fafb;
  border-radius: 16px;
  padding: 24px;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.agent-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.agent-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
}

.agent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.agent-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.icon-text {
  font-size: 24px;
}

.agent-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.agent-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.view-all-section {
  text-align: center;
  margin-top: 32px;
}

.view-all-button {
  padding: 14px 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  cursor: pointer;
  transition: all 0.3s;
}

.view-all-button:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 1200px) {
  .agents-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-genspark {
    padding: 40px 16px 60px;
  }

  .main-title {
    font-size: 36px;
  }

  .sub-title {
    font-size: 16px;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }

  .search-wrapper {
    width: 100%;
  }
}
</style>
