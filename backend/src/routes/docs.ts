
/**
 * API文档路由
 * 提供API文档访问接口
 */

import { Router, Request, Response } from 'express';
import ApiDocsService from '../services/ApiDocsService';

const router = Router();

/**
 * 获取OpenAPI规范文档
 * GET /docs/openapi.json
 */
router.get('/openapi.json', (req: Request, res: Response) => {
  const spec = ApiDocsService.generateOpenApiSpec();
  res.json(spec);
});

/**
 * 获取Markdown格式文档
 * GET /docs/markdown
 */
router.get('/markdown', (req: Request, res: Response) => {
  const markdown = ApiDocsService.generateMarkdown();
  res.set('Content-Type', 'text/markdown');
  res.send(markdown);
});

/**
 * API文档页面
 * GET /docs
 */
router.get('/', (req: Request, res: Response) => {
  const spec = ApiDocsService.generateOpenApiSpec();

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medagil AI平台 API文档</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    .topbar {
      background-color: #1f2937;
      padding: 20px;
      color: white;
    }
    .topbar h1 {
      margin: 0;
      font-size: 24px;
    }
    .topbar p {
      margin: 5px 0 0 0;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>Medagil AI平台 API文档</h1>
    <p>基于OpenAPI规范的交互式API文档</p>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const spec = ${JSON.stringify(spec)};
      SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ],
        layout: 'BaseLayout',
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
