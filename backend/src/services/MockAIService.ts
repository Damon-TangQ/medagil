/**
 * MockAIService - 模拟Dify平台API
 * 
 * 功能：
 * 1. 模拟流式响应，逐字输出预设文本
 * 2. 模拟任务执行步骤展示
 * 3. 模拟思考过程显示
 * 4. 支持不同的任务类型（根据文档中的9个智能体）
 */

import { EventEmitter } from 'events';

// 任务类型枚举
export enum TaskType {
  MARKET_ANALYSIS = 'market_analysis',      // 市场分析
  COMPETITOR_RESEARCH = 'competitor_research', // 竞品研究
  USER_RESEARCH = 'user_research',          // 用户研究
  PRODUCT_PLANNING = 'product_planning',    // 产品规划
  MARKETING_PLAN = 'marketing_plan',        // 营销方案
  CONTENT_GENERATION = 'content_generation', // 内容生成
  DATA_ANALYSIS = 'data_analysis',          // 数据分析
  STRATEGY_ADVISOR = 'strategy_advisor',    // 策略顾问
  PROJECT_MANAGEMENT = 'project_management' // 项目管理
}

// 任务步骤接口
export interface TaskStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
}

// 思考过程接口
export interface ThoughtProcess {
  id: string;
  content: string;
  timestamp: number;
}

// 流式响应事件接口
export interface StreamResponseEvent {
  type: 'text' | 'step' | 'thought' | 'complete' | 'error';
  data: any;
}

// 智能体预设响应
const AGENT_RESPONSES: Record<TaskType, {
  name: string;
  description: string;
  steps: TaskStep[];
  thoughts: ThoughtProcess[];
  response: string;
}> = {
  [TaskType.MARKET_ANALYSIS]: {
    name: '市场分析专家',
    description: '基于大数据分析市场趋势和机会',
    steps: [
      { step: 1, title: '数据收集', description: '收集相关市场数据和行业报告', status: 'pending', progress: 0 },
      { step: 2, title: '趋势分析', description: '分析市场发展趋势和变化', status: 'pending', progress: 0 },
      { step: 3, title: '竞争分析', description: '评估市场竞争格局和主要参与者', status: 'pending', progress: 0 },
      { step: 4, title: '机会识别', description: '识别市场机会和潜在风险', status: 'pending', progress: 0 },
      { step: 5, title: '报告生成', description: '生成综合市场分析报告', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析市场数据，识别关键趋势...', timestamp: Date.now() },
      { id: '2', content: '检测到市场增长点，需要进一步验证...', timestamp: Date.now() + 1000 },
      { id: '3', content: '竞争格局分析完成，发现3个主要竞争对手...', timestamp: Date.now() + 2000 }
    ],
    response: '根据最新的市场数据分析，我们发现该行业正处于快速增长阶段，年增长率约为15%。主要驱动因素包括技术创新、消费者需求变化和政策支持。建议重点关注以下几个方向：1) 产品差异化定位；2) 渠道多元化布局；3) 用户服务体验优化。'
  },
  [TaskType.COMPETITOR_RESEARCH]: {
    name: '竞品研究专家',
    description: '深入分析竞争对手的产品和策略',
    steps: [
      { step: 1, title: '竞品识别', description: '识别主要竞争对手', status: 'pending', progress: 0 },
      { step: 2, title: '产品分析', description: '分析竞争对手产品功能和特性', status: 'pending', progress: 0 },
      { step: 3, title: '策略分析', description: '研究竞争对手的市场策略', status: 'pending', progress: 0 },
      { step: 4, title: '优劣势对比', description: '对比分析优劣势', status: 'pending', progress: 0 },
      { step: 5, title: '建议生成', description: '生成竞争策略建议', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在收集竞品信息，已识别5个主要竞争对手...', timestamp: Date.now() },
      { id: '2', content: '竞品功能对比分析中，发现关键差异点...', timestamp: Date.now() + 1000 },
      { id: '3', content: '竞品策略分析完成，识别出3个可借鉴的营销策略...', timestamp: Date.now() + 2000 }
    ],
    response: '经过全面的竞品分析，我们发现主要竞争对手在以下方面表现突出：1) 产品功能完整性；2) 用户界面设计；3) 客户服务响应速度。相比之下，我们的优势在于：1) 技术创新性；2) 定制化能力；3) 性价比。建议我们加强在用户体验和功能完整性方面的投入，同时保持技术创新优势。'
  },
  [TaskType.USER_RESEARCH]: {
    name: '用户研究专家',
    description: '分析用户需求和行为模式',
    steps: [
      { step: 1, title: '用户画像', description: '构建目标用户画像', status: 'pending', progress: 0 },
      { step: 2, title: '行为分析', description: '分析用户行为数据', status: 'pending', progress: 0 },
      { step: 3, title: '需求识别', description: '识别用户核心需求', status: 'pending', progress: 0 },
      { step: 4, title: '痛点分析', description: '分析用户痛点和障碍', status: 'pending', progress: 0 },
      { step: 5, title: '洞察生成', description: '生成用户洞察和建议', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析用户数据，构建用户画像...', timestamp: Date.now() },
      { id: '2', content: '用户行为模式识别中，发现3个主要使用场景...', timestamp: Date.now() + 1000 },
      { id: '3', content: '用户需求分析完成，识别出5个核心需求...', timestamp: Date.now() + 2000 }
    ],
    response: '基于用户研究数据，我们识别出目标用户群体的主要特征：年龄25-40岁，教育程度本科以上，主要集中在一线城市。用户最关注的是产品的易用性和效率。主要痛点包括：1) 学习成本高；2) 功能过于复杂；3) 缺乏个性化服务。建议优化用户引导流程，简化核心功能操作，并增加个性化推荐功能。'
  },
  [TaskType.PRODUCT_PLANNING]: {
    name: '产品规划专家',
    description: '制定产品发展规划和路线图',
    steps: [
      { step: 1, title: '需求收集', description: '收集产品需求和反馈', status: 'pending', progress: 0 },
      { step: 2, title: '功能规划', description: '规划产品功能和特性', status: 'pending', progress: 0 },
      { step: 3, title: '优先级排序', description: '确定功能优先级和开发顺序', status: 'pending', progress: 0 },
      { step: 4, title: '路线图制定', description: '制定产品发展路线图', status: 'pending', progress: 0 },
      { step: 5, title: '资源评估', description: '评估所需资源和时间', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析产品需求，识别关键功能点...', timestamp: Date.now() },
      { id: '2', content: '功能优先级评估中，确定3个核心功能...', timestamp: Date.now() + 1000 },
      { id: '3', content: '产品路线图规划完成，制定未来6个月的发展计划...', timestamp: Date.now() + 2000 }
    ],
    response: '基于市场需求和用户反馈，我们制定了以下产品规划：短期(1-3个月)：1) 优化核心功能体验；2) 增加数据可视化能力；3) 完善用户帮助文档。中期(3-6个月)：1) 开发协作功能；2) 增加AI智能推荐；3) 扩展数据分析能力。长期(6个月以上)：1) 构建开放平台；2) 支持多语言；3) 开发移动端应用。'
  },
  [TaskType.MARKETING_PLAN]: {
    name: '营销方案专家',
    description: '制定全面的营销推广方案',
    steps: [
      { step: 1, title: '市场定位', description: '确定产品市场定位', status: 'pending', progress: 0 },
      { step: 2, title: '目标受众', description: '定义目标受众群体', status: 'pending', progress: 0 },
      { step: 3, title: '渠道策略', description: '制定营销渠道策略', status: 'pending', progress: 0 },
      { step: 4, title: '内容策略', description: '制定内容营销策略', status: 'pending', progress: 0 },
      { step: 5, title: '预算规划', description: '规划营销预算和资源分配', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析市场环境，确定最佳定位策略...', timestamp: Date.now() },
      { id: '2', content: '目标受众分析完成，识别出3个核心用户群体...', timestamp: Date.now() + 1000 },
      { id: '3', content: '营销渠道评估中，确定5个高效推广渠道...', timestamp: Date.now() + 2000 }
    ],
    response: '基于市场分析，我们制定了以下营销方案：1) 市场定位：面向中小企业的智能化解决方案提供商；2) 目标受众：25-40岁的中小企业主和管理者；3) 渠道策略：社交媒体营销(40%)、内容营销(30%)、搜索引擎优化(20%)、线下活动(10%)；4) 内容策略：行业洞察、案例分析、使用教程；5) 预算分配：Q1-Q4按30:40:20:10的比例分配。'
  },
  [TaskType.CONTENT_GENERATION]: {
    name: '内容生成专家',
    description: '生成各类营销和产品内容',
    steps: [
      { step: 1, title: '需求分析', description: '分析内容需求和目标', status: 'pending', progress: 0 },
      { step: 2, title: '素材收集', description: '收集相关素材和参考', status: 'pending', progress: 0 },
      { step: 3, title: '内容创作', description: '创作核心内容', status: 'pending', progress: 0 },
      { step: 4, title: '内容优化', description: '优化内容质量和效果', status: 'pending', progress: 0 },
      { step: 5, title: '格式调整', description: '调整内容格式和排版', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析内容需求，确定创作方向...', timestamp: Date.now() },
      { id: '2', content: '素材收集完成，整理出5个关键信息点...', timestamp: Date.now() + 1000 },
      { id: '3', content: '内容创作中，已完成初稿框架...', timestamp: Date.now() + 2000 }
    ],
    response: '根据您的需求，我已生成以下内容：标题：[创新科技，引领未来] 正文：在数字化转型的浪潮中，企业需要拥抱创新，才能在竞争中脱颖而出。我们的产品通过先进的人工智能技术，帮助企业实现智能化升级，提高效率，降低成本。无论是数据分析、流程优化，还是决策支持，我们都能为您提供专业的解决方案。立即联系我们，开启您的智能化转型之旅！'
  },
  [TaskType.DATA_ANALYSIS]: {
    name: '数据分析专家',
    description: '分析业务数据并提供洞察',
    steps: [
      { step: 1, title: '数据收集', description: '收集相关业务数据', status: 'pending', progress: 0 },
      { step: 2, title: '数据清洗', description: '清洗和预处理数据', status: 'pending', progress: 0 },
      { step: 3, title: '数据分析', description: '进行数据分析和建模', status: 'pending', progress: 0 },
      { step: 4, title: '可视化', description: '创建数据可视化图表', status: 'pending', progress: 0 },
      { step: 5, title: '洞察生成', description: '生成数据洞察和建议', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在收集业务数据，已获取3个月的历史数据...', timestamp: Date.now() },
      { id: '2', content: '数据清洗完成，处理了5%的异常值...', timestamp: Date.now() + 1000 },
      { id: '3', content: '数据分析中，识别出3个关键趋势...', timestamp: Date.now() + 2000 }
    ],
    response: '基于对业务数据的深入分析，我们发现以下关键洞察：1) 用户活跃度呈上升趋势，月活跃用户增长率为12%；2) 核心功能使用率提高，尤其是数据分析功能，使用率提高了25%；3) 用户留存率提升，30天留存率从45%提升至52%；4) 转化漏斗优化后，转化率提高了8%。建议继续加强数据分析功能的推广，并优化用户引导流程，进一步提高转化率。'
  },
  [TaskType.STRATEGY_ADVISOR]: {
    name: '策略顾问',
    description: '提供战略决策建议和规划',
    steps: [
      { step: 1, title: '现状分析', description: '分析当前业务状况', status: 'pending', progress: 0 },
      { step: 2, title: '目标设定', description: '设定战略目标', status: 'pending', progress: 0 },
      { step: 3, title: '策略制定', description: '制定战略方案', status: 'pending', progress: 0 },
      { step: 4, title: '风险评估', description: '评估潜在风险', status: 'pending', progress: 0 },
      { step: 5, title: '执行计划', description: '制定执行计划', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析业务现状，识别关键成功因素...', timestamp: Date.now() },
      { id: '2', content: '战略目标设定中，确定3个核心目标...', timestamp: Date.now() + 1000 },
      { id: '3', content: '策略方案制定中，评估了4种不同策略...', timestamp: Date.now() + 2000 }
    ],
    response: '基于对业务现状的全面分析，我们提出以下战略建议：1) 市场扩张策略：在巩固现有市场的基础上，积极拓展新市场，目标是在未来12个月内进入3个新区域市场；2) 产品创新策略：加大研发投入，每季度推出至少1项新功能或产品；3) 人才战略：建立人才梯队，重点引进技术和营销人才；4) 合作伙伴战略：与行业领先企业建立战略合作，扩大生态圈。风险提示：需注意市场竞争加剧和人才流失风险。'
  },
  [TaskType.PROJECT_MANAGEMENT]: {
    name: '项目管理专家',
    description: '提供项目管理方法和工具',
    steps: [
      { step: 1, title: '项目规划', description: '制定项目计划和里程碑', status: 'pending', progress: 0 },
      { step: 2, title: '资源分配', description: '分配项目资源和人员', status: 'pending', progress: 0 },
      { step: 3, title: '进度跟踪', description: '跟踪项目进度和状态', status: 'pending', progress: 0 },
      { step: 4, title: '风险管理', description: '识别和管理项目风险', status: 'pending', progress: 0 },
      { step: 5, title: '质量控制', description: '监控项目质量和交付标准', status: 'pending', progress: 0 }
    ],
    thoughts: [
      { id: '1', content: '正在分析项目需求，制定项目计划...', timestamp: Date.now() },
      { id: '2', content: '资源分配完成，确定了5个关键角色...', timestamp: Date.now() + 1000 },
      { id: '3', content: '风险评估中，识别出3个主要风险点...', timestamp: Date.now() + 2000 }
    ],
    response: '基于项目管理最佳实践，我们为您的项目提供以下建议：1) 项目规划：采用敏捷开发方法，将项目分为4个为期2周的迭代；2) 资源分配：项目团队由5人组成，包括1名项目经理、2名开发人员、1名设计师和1名测试人员；3) 进度跟踪：使用看板工具跟踪任务进度，每周进行一次项目评审；4) 风险管理：识别出技术风险、资源风险和时间风险，并制定相应的应对措施；5) 质量控制：建立代码审查和测试流程，确保交付质量。'
  }
};

// MockAIService类
export class MockAIService extends EventEmitter {
  private currentTaskType: TaskType | null = null;
  private isProcessing = false;
  private streamInterval: NodeJS.Timeout | null = null;

  /**
   * 执行AI任务
   * @param taskType 任务类型
   * @param input 输入数据
   */
  async executeTask(taskType: TaskType, _input?: any): Promise<void> {
    if (this.isProcessing) {
      throw new Error('已有任务正在执行中');
    }

    this.currentTaskType = taskType;
    this.isProcessing = true;

    try {
      const agent = AGENT_RESPONSES[taskType];
      if (!agent) {
        throw new Error(`不支持的任务类型: ${taskType}`);
      }

      // 模拟任务执行步骤
      await this.simulateSteps(agent.steps);

      // 模拟思考过程
      await this.simulateThoughts(agent.thoughts);

      // 模拟流式响应
      await this.simulateStreamResponse(agent.response);

      // 发送完成事件
      this.emit('complete', {
        type: 'complete',
        data: {
          taskType,
          response: agent.response,
          steps: agent.steps,
          thoughts: agent.thoughts
        }
      });
    } catch (error) {
      this.emit('error', {
        type: 'error',
        data: {
          error: error instanceof Error ? error.message : '未知错误'
        }
      });
    } finally {
      this.isProcessing = false;
      this.currentTaskType = null;
    }
  }

  /**
   * 模拟任务执行步骤
   */
  private async simulateSteps(steps: TaskStep[]): Promise<void> {
    for (let i = 0; i < steps.length; i++) {
      const step: TaskStep = { ...steps[i], status: 'in_progress' };
      this.emit('step', { type: 'step', data: step });

      // 模拟步骤执行时间
      await this.delay(1000 + Math.random() * 1000);

      // 更新进度
      const progress = 50 + Math.random() * 50;
      step.progress = Math.min(100, progress);
      step.status = 'completed';
      this.emit('step', { type: 'step', data: step });
    }
  }

  /**
   * 模拟思考过程
   */
  private async simulateThoughts(thoughts: ThoughtProcess[]): Promise<void> {
    for (const thought of thoughts) {
      await this.delay(500 + Math.random() * 1000);
      this.emit('thought', { type: 'thought', data: thought });
    }
  }

  /**
   * 模拟流式响应
   */
  private async simulateStreamResponse(response: string): Promise<void> {
    const words = response.split('');
    let currentText = '';

    return new Promise((resolve) => {
      this.streamInterval = setInterval(() => {
        if (words.length === 0) {
          if (this.streamInterval) {
            clearInterval(this.streamInterval);
            this.streamInterval = null;
          }
          resolve();
          return;
        }

        // 每次输出1-3个字符
        const count = Math.min(Math.ceil(Math.random() * 3), words.length);
        const chunk = words.splice(0, count).join('');
        currentText += chunk;

        this.emit('text', {
          type: 'text',
          data: {
            text: currentText,
            delta: chunk
          }
        });
      }, 50); // 每50ms输出一次
    });
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 取消当前任务
   */
  cancel(): void {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
    this.isProcessing = false;
    this.currentTaskType = null;
  }

  /**
   * 获取当前任务状态
   */
  getStatus(): { isProcessing: boolean; currentTaskType: TaskType | null } {
    return {
      isProcessing: this.isProcessing,
      currentTaskType: this.currentTaskType
    };
  }

  /**
   * 获取所有支持的智能体
   */
  getSupportedAgents(): Array<{ type: TaskType; name: string; description: string }> {
    return Object.entries(AGENT_RESPONSES).map(([type, agent]) => ({
      type: type as TaskType,
      name: agent.name,
      description: agent.description
    }));
  }
}

// 导出单例实例
export const mockAIService = new MockAIService();
