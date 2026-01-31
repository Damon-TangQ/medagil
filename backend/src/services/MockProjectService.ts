/**
 * 模拟项目数据服务
 * 用于开发和测试阶段的项目数据操作
 */

import { PROJECT_STATUS } from '@/shared/constants';

// 项目接口定义
export interface Project {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  description?: string;
  coverImage?: string;
  tags?: string;
  config?: Record<string, any>;
  status: number;
  viewCount: number;
  likeCount: number;
  createdAt: string; // ISO 8601 格式字符串
  updatedAt: string; // ISO 8601 格式字符串
}

// 创建项目接口
export interface CreateProjectData {
  userId: string;
  categoryId?: string;
  name: string;
  description?: string;
  coverImage?: string;
  tags?: string;
  config?: Record<string, any>;
}

// 更新项目接口
export interface UpdateProjectData {
  categoryId?: string;
  name?: string;
  description?: string;
  coverImage?: string;
  tags?: string;
  config?: Record<string, any>;
  status?: number;
}

class MockProjectService {
  // 内存中存储的项目数据
  private projects: Map<string, Project> = new Map();
  private projectIdCounter: number = 1;

  constructor() {
    // 初始化一些测试项目数据
    this.initMockProjects();
  }

  /**
   * 初始化测试项目数据
   */
  private initMockProjects(): void {
    const testProjects: Project[] = [
      {
        id: 'project_001',
        userId: 'user_002',
        categoryId: '1',
        name: 'AI智能对话助手',
        description: '基于大语言模型的智能对话助手，能够回答各种问题，提供专业建议',
        coverImage: '/images/project_cover_1.jpg',
        tags: 'AI,对话,智能助手',
        status: PROJECT_STATUS.PUBLISHED,
        viewCount: 1250,
        likeCount: 86,
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2023-06-15')
      },
      {
        id: 'project_002',
        userId: 'user_002',
        categoryId: '2',
        name: '销售数据分析',
        description: '对销售数据进行多维度分析，生成可视化报表',
        coverImage: '/images/project_cover_2.jpg',
        tags: '数据分析,销售,可视化',
        status: PROJECT_STATUS.PUBLISHED,
        viewCount: 980,
        likeCount: 65,
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2023-06-20')
      },
      {
        id: 'project_003',
        userId: 'user_003',
        categoryId: '1',
        name: '智能客服系统',
        description: '基于AI的智能客服系统，能够自动回答客户问题',
        coverImage: '/images/project_cover_3.jpg',
        tags: 'AI,客服,自动化',
        status: PROJECT_STATUS.PUBLISHED,
        viewCount: 756,
        likeCount: 42,
        createdAt: new Date('2023-07-01'),
        updatedAt: new Date('2023-07-10')
      },
      {
        id: 'project_004',
        userId: 'user_003',
        categoryId: '3',
        name: '文本情感分析',
        description: '分析文本的情感倾向，支持中英文',
        coverImage: '/images/project_cover_4.jpg',
        tags: 'NLP,情感分析,文本处理',
        status: PROJECT_STATUS.PUBLISHED,
        viewCount: 632,
        likeCount: 38,
        createdAt: new Date('2023-07-15'),
        updatedAt: new Date('2023-07-25')
      },
      {
        id: 'project_005',
        userId: 'user_004',
        categoryId: '4',
        name: '图像识别系统',
        description: '基于深度学习的图像识别系统，支持多种物体识别',
        coverImage: '/images/project_cover_5.jpg',
        tags: 'CV,图像识别,深度学习',
        status: PROJECT_STATUS.DRAFT, // 草稿状态
        viewCount: 0,
        likeCount: 0,
        createdAt: new Date('2023-08-01'),
        updatedAt: new Date('2023-08-01')
      }
    ];

    // 将测试项目添加到内存存储
    testProjects.forEach(project => {
      this.projects.set(project.id, project);
      // 更新ID计数器
      const idNum = parseInt(project.id.split('_')[1]);
      if (idNum >= this.projectIdCounter) {
        this.projectIdCounter = idNum + 1;
      }
    });
  }

  /**
   * 创建项目
   */
  async createProject(data: CreateProjectData): Promise<{ success: boolean; message: string; project?: Project }> {
    const newProject: Project = {
      id: `project_${this.projectIdCounter++}`,
      userId: data.userId,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      coverImage: data.coverImage,
      tags: data.tags,
      config: data.config,
      status: PROJECT_STATUS.DRAFT, // 默认为草稿状态
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 保存项目
    this.projects.set(newProject.id, newProject);

    return {
      success: true,
      message: '创建成功',
      project: newProject
    };
  }

  /**
   * 根据ID获取项目
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    const project = this.projects.get(projectId);
    return project || null;
  }

  /**
   * 根据用户ID获取项目列表
   */
  async getProjectsByUserId(userId: string, options?: {
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ projects: Project[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { status, page = 1, pageSize = 10 } = options || {};

    let projects = Array.from(this.projects.values())
      .filter(project => project.userId === userId);

    // 根据状态筛选
    if (status !== undefined) {
      projects = projects.filter(project => project.status === status);
    }

    // 按创建时间倒序排序
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = projects.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    return {
      projects: paginatedProjects,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 根据分类ID获取项目列表
   */
  async getProjectsByCategoryId(categoryId: string, options?: {
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ projects: Project[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { status, page = 1, pageSize = 10 } = options || {};

    let projects = Array.from(this.projects.values())
      .filter(project => project.categoryId === categoryId);

    // 根据状态筛选
    if (status !== undefined) {
      projects = projects.filter(project => project.status === status);
    }

    // 按创建时间倒序排序
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = projects.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    return {
      projects: paginatedProjects,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 更新项目
   */
  async updateProject(projectId: string, data: UpdateProjectData): Promise<{ success: boolean; message: string; project?: Project }> {
    const project = this.projects.get(projectId);
    if (!project) {
      return {
        success: false,
        message: '项目不存在'
      };
    }

    // 更新项目信息
    const updatedProject = {
      ...project,
      ...data,
      id: projectId, // 确保ID不被修改
      updatedAt: new Date()
    };

    this.projects.set(projectId, updatedProject);

    return {
      success: true,
      message: '更新成功',
      project: updatedProject
    };
  }

  /**
   * 删除项目
   */
  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    const project = this.projects.get(projectId);
    if (!project) {
      return {
        success: false,
        message: '项目不存在'
      };
    }

    this.projects.delete(projectId);

    return {
      success: true,
      message: '删除成功'
    };
  }

  /**
   * 增加项目浏览次数
   */
  async incrementViewCount(projectId: string): Promise<{ success: boolean; message: string; project?: Project }> {
    const project = this.projects.get(projectId);
    if (!project) {
      return {
        success: false,
        message: '项目不存在'
      };
    }

    const updatedProject = {
      ...project,
      viewCount: project.viewCount + 1
    };

    this.projects.set(projectId, updatedProject);

    return {
      success: true,
      message: '浏览次数增加成功',
      project: updatedProject
    };
  }

  /**
   * 增加项目点赞次数
   */
  async incrementLikeCount(projectId: string): Promise<{ success: boolean; message: string; project?: Project }> {
    const project = this.projects.get(projectId);
    if (!project) {
      return {
        success: false,
        message: '项目不存在'
      };
    }

    const updatedProject = {
      ...project,
      likeCount: project.likeCount + 1
    };

    this.projects.set(projectId, updatedProject);

    return {
      success: true,
      message: '点赞成功',
      project: updatedProject
    };
  }

  /**
   * 搜索项目
   */
  async searchProjects(keyword: string, options?: {
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ projects: Project[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { status, page = 1, pageSize = 10 } = options || {};
    const lowerKeyword = keyword.toLowerCase();

    let projects = Array.from(this.projects.values())
      .filter(project => {
        // 搜索项目名称、描述和标签
        return project.name.toLowerCase().includes(lowerKeyword) ||
               (project.description && project.description.toLowerCase().includes(lowerKeyword)) ||
               (project.tags && project.tags.toLowerCase().includes(lowerKeyword));
      });

    // 根据状态筛选
    if (status !== undefined) {
      projects = projects.filter(project => project.status === status);
    }

    // 按创建时间倒序排序
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = projects.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    return {
      projects: paginatedProjects,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 获取所有项目
   */
  async getAllProjects(options?: {
    status?: number;
    page?: number;
    pageSize?: number;
    keyword?: string;
    categoryId?: string;
    userId?: string;
  }): Promise<{ projects: Project[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { status, page = 1, pageSize = 10, keyword, categoryId, userId } = options || {};

    let projects = Array.from(this.projects.values());

    // 根据用户ID筛选
    if (userId) {
      projects = projects.filter(project => project.userId === userId);
    }

    // 根据分类ID筛选
    if (categoryId) {
      projects = projects.filter(project => project.categoryId === categoryId);
    }

    // 根据关键词搜索
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      projects = projects.filter(project => 
        project.name.toLowerCase().includes(lowerKeyword) ||
        (project.description && project.description.toLowerCase().includes(lowerKeyword)) ||
        (project.tags && project.tags.toLowerCase().includes(lowerKeyword))
      );
    }

    // 根据状态筛选
    if (status !== undefined) {
      projects = projects.filter(project => project.status === status);
    }

    // 按创建时间倒序排序
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = projects.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    return {
      projects: paginatedProjects,
      total,
      page,
      pageSize,
      totalPages
    };
  }
}

// 导出单例
export default new MockProjectService();
