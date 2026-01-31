/**
 * 任务路由
 * 实现任务相关的CRUD接口
 */

import { Router, Request, Response } from 'express';
import MockTaskService from '../services/MockTaskService';

const router = Router();
const taskService = MockTaskService;

// 统一响应格式接口
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

/**
 * 获取任务列表
 * GET /tasks
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10, projectId, taskType, status, userId } = req.query;

    let result;
    if (userId) {
      // 根据用户ID获取任务列表
      result = await taskService.getTasksByUserId(userId as string, {
        projectId: projectId as string,
        taskType: taskType as 'chat' | 'analysis' | 'report',
        status: status ? Number(status) : undefined,
        page: Number(page),
        pageSize: Number(pageSize)
      });
    } else if (projectId) {
      // 根据项目ID获取任务列表
      result = await taskService.getTasksByProjectId(projectId as string, {
        taskType: taskType as 'chat' | 'analysis' | 'report',
        status: status ? Number(status) : undefined,
        page: Number(page),
        pageSize: Number(pageSize)
      });
    } else {
      // 获取所有任务
      result = await taskService.getAllTasks({
        taskType: taskType as 'chat' | 'analysis' | 'report',
        status: status ? Number(status) : undefined,
        page: Number(page),
        pageSize: Number(pageSize)
      });
    }

    const response: ApiResponse = {
      success: true,
      message: '获取任务列表成功',
      data: {
        tasks: result.tasks,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error('获取任务列表错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '获取任务列表失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 获取任务详情
 * GET /tasks/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await taskService.getTaskById(id);

    if (task) {
      const response: ApiResponse = {
        success: true,
        message: '获取任务详情成功',
        data: task
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: '任务不存在',
        code: 404
      };
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error('获取任务详情错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '获取任务详情失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 创建任务
 * POST /tasks
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, projectId, title, description, taskType, steps, inputContent } = req.body;

    // 参数验证
    if (!userId || !title) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: userId 或 title',
        code: 400
      };
      return res.status(400).json(response);
    }

    const createData = {
      userId,
      projectId,
      title,
      description,
      taskType,
      steps,
      inputContent
    };

    const result = await taskService.createTask(createData);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '创建任务成功',
        data: result.task
      };
      return res.status(201).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '创建任务失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('创建任务错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '创建任务失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 更新任务
 * PUT /tasks/:id
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, steps, inputContent, aiResponse, result, status } = req.body;

    const updateData = {
      title,
      description,
      steps,
      inputContent,
      aiResponse,
      result,
      status
    };

    const updateResult = await taskService.updateTask(id, updateData);

    if (updateResult.success) {
      const response: ApiResponse = {
        success: true,
        message: '更新任务成功',
        data: updateResult.task
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: updateResult.message || '更新任务失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('更新任务错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '更新任务失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 删除任务
 * DELETE /tasks/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await taskService.deleteTask(id);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '删除任务成功'
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '删除任务失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('删除任务错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '删除任务失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 添加对话记录
 * POST /tasks/:id/conversation
 */
router.post('/:id/conversation', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, content } = req.body;

    // 参数验证
    if (!role || !content) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: role 或 content',
        code: 400
      };
      return res.status(400).json(response);
    }

    const message = {
      role,
      content,
      timestamp: new Date()
    };

    const result = await taskService.addConversation(id, message);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: '添加对话记录成功',
        data: result.task
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message || '添加对话记录失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('添加对话记录错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '添加对话记录失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 获取对话历史
 * GET /tasks/:id/conversation
 */
router.get('/:id/conversation', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await taskService.getConversationHistory(id);

    if (conversation) {
      const response: ApiResponse = {
        success: true,
        message: '获取对话历史成功',
        data: {
          conversation
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: '任务不存在',
        code: 404
      };
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error('获取对话历史错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '获取对话历史失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 标记任务为完成
 * POST /tasks/:id/complete
 */
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { result } = req.body;

    const taskResult = await taskService.markAsCompleted(id, result);

    if (taskResult.success) {
      const response: ApiResponse = {
        success: true,
        message: '标记任务完成成功',
        data: taskResult.task
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: taskResult.message || '标记任务完成失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('标记任务完成错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '标记任务完成失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 标记任务为失败
 * POST /tasks/:id/failed
 */
router.post('/:id/failed', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { result } = req.body;

    const taskResult = await taskService.markAsFailed(id, result);

    if (taskResult.success) {
      const response: ApiResponse = {
        success: true,
        message: '标记任务失败成功',
        data: taskResult.task
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: taskResult.message || '标记任务失败失败',
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('标记任务失败错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '标记任务失败失败',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * Dify AI调用接口
 * POST /tasks/:id/dify
 */
router.post('/:id/dify', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { input, taskType = 'data_analysis' } = req.body;

    // 设置SSE响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 导入MockAIService
    const { mockAIService, TaskType } = await import('../services/MockAIService');

    // 监听事件并发送SSE
    const sendEvent = (event: any) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    // 监听步骤事件
    mockAIService.on('step', sendEvent);

    // 监听思考过程事件
    mockAIService.on('thought', sendEvent);

    // 监听文本流事件
    mockAIService.on('text', sendEvent);

    // 监听完成事件
    mockAIService.on('complete', (event) => {
      sendEvent(event);
      res.end();
    });

    // 监听错误事件
    mockAIService.on('error', (event) => {
      sendEvent(event);
      res.end();
    });

    // 执行任务
    await mockAIService.executeTask(taskType as any, { taskId: id, input });

    // 清理事件监听器
    res.on('close', () => {
      mockAIService.removeListener('step', sendEvent);
      mockAIService.removeListener('thought', sendEvent);
      mockAIService.removeListener('text', sendEvent);
      mockAIService.removeListener('complete', sendEvent);
      mockAIService.removeListener('error', sendEvent);
      mockAIService.cancel();
    });

  } catch (error) {
    console.error('Dify AI调用错误:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      data: {
        error: error instanceof Error ? error.message : '未知错误'
      }
    })}\n\n`);
    res.end();
  }
});

export default router;
