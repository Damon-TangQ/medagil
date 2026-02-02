<template>
  <div class="home-page">
    <!-- 顶部标题区域 -->
    <div class="header-section">
      <h1 class="main-title">Medagil AI 工作空间 2.0</h1>
      <p class="sub-title">询问任何科研问题，创造任何学术成果</p>
    </div>

    <!-- 主搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="输入您的科研问题或项目需求..."
          size="large"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <el-button
              type="primary"
              :icon="Search"
              @click="handleSearch"
              class="search-button"
            />
          </template>
        </el-input>
      </div>
      <p class="search-hint">Medagil 支持个性化医学科研工具</p>
    </div>

    <!-- 智能体功能网格 -->
    <div class="agents-section">
      <div class="section-title">智能体分类</div>
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
                <el-icon :size="32">
                  <component :is="agent.icon" />
                </el-icon>
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
                <el-icon :size="32">
                  <component :is="agent.icon" />
                </el-icon>
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
                <el-icon :size="32">
                  <component :is="agent.icon" />
                </el-icon>
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
                <el-icon :size="32">
                  <component :is="agent.icon" />
                </el-icon>
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
      <el-button type="primary" class="view-all-button" @click="handleViewAll">
        查看所有智能体
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Document, Edit, Notebook, TrendCharts, School, Briefcase } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

// 论著写作类智能体
const writingAgents = ref([
  {
    name: '临床论著助手',
    description: '协助临床论著的撰写与修改',
    icon: markRaw(Edit),
    color: '#667eea'
  },
  {
    name: '基础论著助手',
    description: '帮助完成基础医学论著写作',
    icon: markRaw(Document),
    color: '#764ba2'
  },
  {
    name: '综述助手',
    description: '快速生成高质量文献综述',
    icon: markRaw(TrendCharts),
    color: '#f093fb'
  }
])

// 基金申请类智能体
const grantAgents = ref([
  {
    name: '国自然面上基金助手',
    description: '辅助撰写国家自然科学基金面上项目',
    icon: markRaw(Briefcase),
    color: '#667eea'
  },
  {
    name: '国自然重点基金助手',
    description: '协助撰写国家自然科学基金重点项目',
    icon: markRaw(School),
    color: '#764ba2'
  }
])

// 毕业课题类智能体
const thesisAgents = ref([
  {
    name: '博士基础研究课题助手',
    description: '辅助博士基础研究课题设计',
    icon: markRaw(Notebook),
    color: '#667eea'
  },
  {
    name: '博士临床研究课题助手',
    description: '协助博士临床研究课题设计',
    icon: markRaw(Document),
    color: '#764ba2'
  }
])

// 科研工具类智能体
const toolAgents = ref([
  {
    name: '文献分析助手',
    description: '深度分析文献内容与数据',
    icon: markRaw(TrendCharts),
    color: '#667eea'
  },
  {
    name: '智能选刊助手',
    description: '智能推荐最适合的期刊',
    icon: markRaw(Document),
    color: '#764ba2'
  }
])

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  ElMessage.success(`搜索: ${searchQuery.value}`)
}

const handleAgentClick = (agent: any) => {
  ElMessage.success(`选择: ${agent.name}`)
}

const handleViewAll = () => {
  router.push('/agents')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 24px;
}

.header-section {
  text-align: center;
  margin-bottom: 60px;
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.sub-title {
  font-size: 20px;
  color: #6b7280;
  font-weight: 500;
}

.search-section {
  max-width: 800px;
  margin: 0 auto 60px;
  position: relative;
}

.search-container {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  font-size: 16px;
}

.search-input :deep(.el-input__wrapper) {
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}

.search-button {
  padding: 12px 24px;
}

.search-hint {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #9ca3af;
}

.agents-section {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 32px;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.agent-category {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.agent-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
}

.agent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.agent-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
}

.agent-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  text-align: center;
}

.agent-desc {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
}

.view-all-section {
  text-align: center;
  margin-top: 40px;
}

.view-all-button {
  padding: 14px 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

@media (max-width: 1200px) {
  .agents-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
  }

  .sub-title {
    font-size: 16px;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }

  .search-container {
    width: 100%;
  }
}
</style>
