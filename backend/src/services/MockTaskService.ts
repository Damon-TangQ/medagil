/**
 * 模拟任务数据服务
 * 用于开发和测试阶段的任务数据操作
 */

// 对话消息接口
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// 任务接口
export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  description?: string;
  taskType: 'chat' | 'analysis' | 'report';
  conversationHistory: ConversationMessage[];
  result?: string;
  status: number; // 0-进行中, 1-已完成, 2-失败
  createdAt: Date;
  updatedAt: Date;
}

// 创建任务接口
export interface CreateTaskData {
  userId: string;
  projectId?: string;
  title: string;
  description?: string;
  taskType?: 'chat' | 'analysis' | 'report';
}

// 更新任务接口
export interface UpdateTaskData {
  title?: string;
  description?: string;
  result?: string;
  status?: number;
}

class MockTaskService {
  // 内存中存储的任务数据
  private tasks: Map<string, Task> = new Map();
  private taskIdCounter: number = 1;

  constructor() {
    // 初始化一些测试任务数据
    this.initMockTasks();
  }

  /**
   * 初始化测试任务数据
   */
  private initMockTasks(): void {
    const testTasks: Task[] = [
      {
        id: 'task_001',
        userId: 'user_002',
        projectId: 'project_001',
        title: 'AI对话测试',
        description: '测试AI对话功能',
        taskType: 'chat',
        conversationHistory: [
          {
            role: 'user',
            content: '你好',
            timestamp: new Date('2023-08-01T10:00:00')
          },
          {
            role: 'assistant',
            content: '你好！有什么可以帮助你的吗？',
            timestamp: new Date('2023-08-01T10:00:01')
          },
          {
            role: 'user',
            content: '请介绍一下Medagil AI平台',
            timestamp: new Date('2023-08-01T10:00:02')
          },
          {
            role: 'assistant',
            content: 'Medagil AI平台是一个综合性的AI解决方案平台，提供智能对话、数据分析、报告生成等多种AI功能。',
            timestamp: new Date('2023-08-01T10:00:03')
          }
        ],
        status: 1, // 已完成
        createdAt: new Date('2023-08-01'),
        updatedAt: new Date('2023-08-01')
      },
      {
        id: 'task_002',
        userId: 'user_002',
        projectId: 'project_002',
        title: '销售数据分析',
        description: '对2023年上半年的销售数据进行分析',
        taskType: 'analysis',
        conversationHistory: [
          {
            role: 'user',
            content: '请分析2023年上半年的销售数据',
            timestamp: new Date('2023-08-05T14:30:00')
          },
          {
            role: 'assistant',
            content: '正在分析数据，请稍候...',
            timestamp: new Date('2023-08-05T14:30:01')
          }
        ],
        result: '根据分析结果，2023年上半年销售额同比增长了15%，其中Q1增长12%，Q2增长18%。主要增长点来自新产品线，贡献了60%的增长。',
        status: 1, // 已完成
        createdAt: new Date('2023-08-05'),
        updatedAt: new Date('2023-08-05')
      },
      {
        id: 'task_003',
        userId: 'user_003',
        projectId: 'project_003',
        title: '智能客服对话',
        description: '测试智能客服系统的对话能力',
        taskType: 'chat',
        conversationHistory: [
          {
            role: 'user',
            content: '我的订单什么时候能发货？',
            timestamp: new Date('2023-08-10T09:15:00')
          },
          {
            role: 'assistant',
            content: '您好，请提供您的订单号，我帮您查询一下。',
            timestamp: new Date('2023-08-10T09:15:01')
          },
          {
            role: 'user',
            content: '订单号是20230810001',
            timestamp: new Date('2023-08-10T09:15:30')
          },
          {
            role: 'assistant',
            content: '您的订单已经打包完成，预计今天下午发货，发货后会通过短信通知您。',
            timestamp: new Date('2023-08-10T09:15:31')
          }
        ],
        status: 1, // 已完成
        createdAt: new Date('2023-08-10'),
        updatedAt: new Date('2023-08-10')
      },
      {
        id: 'task_004',
        userId: 'user_003',
        projectId: 'project_004',
        title: '情感分析测试',
        description: '对一批客户评论进行情感分析',
        taskType: 'analysis',
        conversationHistory: [
          {
            role: 'user',
            content: '请分析这批客户评论的情感倾向',
            timestamp: new Date('2023-08-15T16:20:00')
          },
          {
            role: 'assistant',
            content: '好的，正在分析...',
            timestamp: new Date('2023-08-15T16:20:01')
          }
        ],
        status: 0, // 进行中
        createdAt: new Date('2023-08-15'),
        updatedAt: new Date('2023-08-15')
      },
      {
        id: 'task_005',
        userId: 'user_004',
        projectId: 'project_005',
        title: '图像识别测试',
        description: '测试图像识别系统的准确性',
        taskType: 'analysis',
        conversationHistory: [
          {
            role: 'user',
            content: '请识别这张图片中的物体',
            timestamp: new Date('2023-08-20T11:45:00')
          },
          {
            role: 'assistant',
            content: '抱歉，图像识别功能正在维护中，暂时无法使用。',
            timestamp: new Date('2023-08-20T11:45:01')
          }
        ],
        status: 2, // 失败
        result: '图像识别功能维护中',
        createdAt: new Date('2023-08-20'),
        updatedAt: new Date('2023-08-20')
      }
    ];

    // 将测试任务添加到内存存储
    testTasks.forEach(task => {
      this.tasks.set(task.id, task);
      // 更新ID计数器
      const idNum = parseInt(task.id.split('_')[1]);
      if (idNum >= this.taskIdCounter) {
        this.taskIdCounter = idNum + 1;
      }
    });
  }

  /**
   * 创建任务
   */
  async createTask(data: CreateTaskData): Promise<{ success: boolean; message: string; task?: Task }> {
    const newTask: Task = {
      id: `task_${this.taskIdCounter++}`,
      userId: data.userId,
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      taskType: data.taskType || 'chat',
      conversationHistory: [],
      status: 0, // 默认为进行中状态
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 保存任务
    this.tasks.set(newTask.id, newTask);

    return {
      success: true,
      message: '创建成功',
      task: newTask
    };
  }

  /**
   * 根据ID获取任务
   */
  async getTaskById(taskId: string): Promise<Task | null> {
    const task = this.tasks.get(taskId);
    return task || null;
  }

  /**
   * 根据用户ID获取任务列表
   */
  async getTasksByUserId(userId: string, options?: {
    projectId?: string;
    taskType?: 'chat' | 'analysis' | 'report';
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { projectId, taskType, status, page = 1, pageSize = 10 } = options || {};

    let tasks = Array.from(this.tasks.values())
      .filter(task => task.userId === userId);

    // 根据项目ID筛选
    if (projectId) {
      tasks = tasks.filter(task => task.projectId === projectId);
    }

    // 根据任务类型筛选
    if (taskType) {
      tasks = tasks.filter(task => task.taskType === taskType);
    }

    // 根据状态筛选
    if (status !== undefined) {
      tasks = tasks.filter(task => task.status === status);
    }

    // 按创建时间倒序排序
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = tasks.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 根据项目ID获取任务列表
   */
  async getTasksByProjectId(projectId: string, options?: {
    taskType?: 'chat' | 'analysis' | 'report';
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { taskType, status, page = 1, pageSize = 10 } = options || {};

    let tasks = Array.from(this.tasks.values())
      .filter(task => task.projectId === projectId);

    // 根据任务类型筛选
    if (taskType) {
      tasks = tasks.filter(task => task.taskType === taskType);
    }

    // 根据状态筛选
    if (status !== undefined) {
      tasks = tasks.filter(task => task.status === status);
    }

    // 按创建时间倒序排序
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = tasks.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 更新任务
   */
  async updateTask(taskId: string, data: UpdateTaskData): Promise<{ success: boolean; message: string; task?: Task }> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        message: '任务不存在'
      };
    }

    // 更新任务信息
    const updatedTask = {
      ...task,
      ...data,
      id: taskId, // 确保ID不被修改
      updatedAt: new Date()
    };

    this.tasks.set(taskId, updatedTask);

    return {
      success: true,
      message: '更新成功',
      task: updatedTask
    };
  }

  /**
   * 添加对话记录
   */
  async addConversation(taskId: string, message: ConversationMessage): Promise<{ success: boolean; message: string; task?: Task }> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        message: '任务不存在'
      };
    }

    // 添加对话记录
    const updatedTask = {
      ...task,
      conversationHistory: [...task.conversationHistory, message],
      updatedAt: new Date()
    };

    this.tasks.set(taskId, updatedTask);

    return {
      success: true,
      message: '对话记录添加成功',
      task: updatedTask
    };
  }

  /**
   * 获取对话历史
   */
  async getConversationHistory(taskId: string): Promise<ConversationMessage[] | null> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return null;
    }

    return task.conversationHistory;
  }

  /**
   * 标记任务为完成
   */
  async markAsCompleted(taskId: string, result?: string): Promise<{ success: boolean; message: string; task?: Task }> {
    return this.updateTask(taskId, {
      status: 1,
      result
    });
  }

  /**
   * 标记任务为失败
   */
  async markAsFailed(taskId: string, result?: string): Promise<{ success: boolean; message: string; task?: Task }> {
    return this.updateTask(taskId, {
      status: 2,
      result
    });
  }

  /**
   * 删除任务
   */
  async deleteTask(taskId: string): Promise<{ success: boolean; message: string }> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        message: '任务不存在'
      };
    }

    this.tasks.delete(taskId);

    return {
      success: true,
      message: '删除成功'
    };
  }

  /**
   * 获取所有任务
   */
  async getAllTasks(options?: {
    taskType?: 'chat' | 'analysis' | 'report';
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { taskType, status, page = 1, pageSize = 10 } = options || {};

    let tasks = Array.from(this.tasks.values());

    // 根据任务类型筛选
    if (taskType) {
      tasks = tasks.filter(task => task.taskType === taskType);
    }

    // 根据状态筛选
    if (status !== undefined) {
      tasks = tasks.filter(task => task.status === status);
    }

    // 按创建时间倒序排序
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = tasks.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total,
      page,
      pageSize,
      totalPages
    };
  }
}

// 导出单例
export default new MockTaskService();
