/**
 * 路由索引文件
 * 统一管理所有路由
 */

import { Router } from 'express';
import authRouter from './auth.mock';
import projectsRouter from './projects.mock';
import docsRouter from './docs';

const router = Router();

// 注册认证相关路由
router.use('/auth', authRouter);

// 注册项目相关路由
router.use('/projects', projectsRouter);

// 注册API文档路由
router.use('/docs', docsRouter);

export default router;
