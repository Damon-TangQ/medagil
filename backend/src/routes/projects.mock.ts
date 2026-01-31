/**
 * 项目路由
 * 实现项目相关的CRUD接口
 */

import { Router, Request, Response } from 'express';
import MockProjectService from '../services/MockProjectService';

const router = Router();
const projectService = new MockProjectService();

// 统一响应格式接口
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

/**
 * 获取项目列表
 * GET /projects
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 12, keyword, categoryId, status, userId } = req.query;

    const result = await projectService.getProjects({
      page: Number(page),
      pageSize: Number(pageSize),
      keyword: keyword as string,
      categoryId: categoryId as string,
      status: status ? Number(status) : undefined,
      userId: userId as string
    });

    const response: ApiResponse = {
      success: true,
      message: '获取项目列表成功',
      data: {
        projects: result.projects,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize)
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error('获取项目列表错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '获取项目列表失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 获取项目详情
 * GET /projects/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await projectService.getProjectById(id);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '获取项目详情成功',
        data: result.project
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '项目不存在',
        code: 404
      };
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error('获取项目详情错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '获取项目详情失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 创建项目
 * POST /projects
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, categoryId, name, description, coverImage, tags } = req.body;

    // 参数验证
    if (!userId || !name) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: userId 或 name',
        code: 400
      };
      return res.status(400).json(response);
    }

    const createData = {
      userId,
      categoryId,
      name,
      description,
      coverImage,
      tags
    };

    const result = await projectService.createProject(createData);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '创建项目成功',
        data: result.project
      };
      return res.status(201).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '创建项目失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('创建项目错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '创建项目失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 更新项目
 * PUT /projects/:id
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId, name, description, coverImage, tags, status } = req.body;

    const updateData = {
      categoryId,
      name,
      description,
      coverImage,
      tags,
      status
    };

    const result = await projectService.updateProject(id, updateData);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '更新项目成功',
        data: result.project
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '更新项目失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('更新项目错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '更新项目失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 删除项目
 * DELETE /projects/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await projectService.deleteProject(id);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '删除项目成功'
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '删除项目失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('删除项目错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '删除项目失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 点赞项目
 * POST /projects/:id/like
 */
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await projectService.likeProject(id);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '点赞成功',
        data: {
          likeCount: result.likeCount
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '点赞失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('点赞项目错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '点赞失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 增加项目浏览量
 * POST /projects/:id/view
 */
router.post('/:id/view', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await projectService.incrementViewCount(id);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '浏览量更新成功',
        data: {
          viewCount: result.viewCount
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '更新浏览量失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('更新浏览量错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '更新浏览量失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

export default router;
