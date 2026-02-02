
/**
 * API文档路由
 */

import { Router, Request, Response } from 'express';
import ApiDocsService from '../services/ApiDocsService';

const router = Router();

/**
 * 获取OpenAPI规范文档
 */
router.get('/openapi.json', (_req: Request, res: Response) => {
  const spec = ApiDocsService.generateOpenApiSpec();
  res.json(spec);
});

/**
 * 获取Markdown文档
 */
router.get('/markdown', (_req: Request, res: Response) => {
  const markdown = ApiDocsService.generateMarkdown();
  res.type('text/markdown').send(markdown);
});

/**
 * 获取所有端点
 */
router.get('/endpoints', (_req: Request, res: Response) => {
  const endpoints = ApiDocsService.getEndpoints();
  res.json({
    success: true,
    data: endpoints
  });
});

export default router;
