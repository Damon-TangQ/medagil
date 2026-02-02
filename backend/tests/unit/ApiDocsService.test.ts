
/**
 * ApiDocsService 单元测试
 * 测试API文档生成和管理功能
 */

import ApiDocsService from '../../src/services/ApiDocsService';

describe('ApiDocsService', () => {
  beforeEach(() => {
    // 清空所有端点
    ApiDocsService.clear();
  });

  describe('注册API端点', () => {
    test('应该成功注册端点', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        responses: [
          { code: 200, description: '成功' },
          { code: 400, description: '错误' }
        ]
      };

      ApiDocsService.register(endpoint);
      const endpoints = ApiDocsService.getEndpoints();

      expect(endpoints).toHaveLength(1);
      expect(endpoints[0]).toEqual(endpoint);
    });

    test('应该支持注册多个端点', () => {
      const endpoint1 = {
        path: '/api/test1',
        method: 'GET',
        description: '测试端点1',
        responses: [{ code: 200, description: '成功' }]
      };

      const endpoint2 = {
        path: '/api/test2',
        method: 'POST',
        description: '测试端点2',
        responses: [{ code: 201, description: '创建成功' }]
      };

      ApiDocsService.register(endpoint1);
      ApiDocsService.register(endpoint2);

      const endpoints = ApiDocsService.getEndpoints();
      expect(endpoints).toHaveLength(2);
    });

    test('应该支持带标签的端点', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        tags: ['测试', '示例'],
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const endpoints = ApiDocsService.getEndpoints();

      expect(endpoints[0].tags).toEqual(['测试', '示例']);
    });

    test('应该支持需要认证的端点', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        auth: true,
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const endpoints = ApiDocsService.getEndpoints();

      expect(endpoints[0].auth).toBe(true);
    });

    test('应该支持带参数的端点', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'ID'
          }
        ],
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const endpoints = ApiDocsService.getEndpoints();

      expect(endpoints[0].parameters).toHaveLength(1);
      expect(endpoints[0].parameters![0].name).toBe('id');
    });
  });

  describe('生成OpenAPI规范', () => {
    test('应该生成有效的OpenAPI规范', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const spec = ApiDocsService.generateOpenApiSpec();

      expect(spec).toHaveProperty('openapi', '3.0.0');
      expect(spec).toHaveProperty('info');
      expect(spec).toHaveProperty('paths');
      expect(spec).toHaveProperty('components');
    });

    test('应该包含端点信息', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const spec = ApiDocsService.generateOpenApiSpec() as any;

      expect(spec.paths['/api/test']).toBeDefined();
      expect(spec.paths['/api/test'].get).toBeDefined();
      expect(spec.paths['/api/test'].get.summary).toBe('测试端点');
    });

    test('应该包含认证方案', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        auth: true,
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const spec = ApiDocsService.generateOpenApiSpec() as any;

      expect(spec.components.securitySchemes).toBeDefined();
      expect(spec.components.securitySchemes.bearerAuth).toBeDefined();
    });
  });

  describe('生成Markdown文档', () => {
    test('应该生成有效的Markdown文档', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const markdown = ApiDocsService.generateMarkdown();

      expect(markdown).toContain('# Medagil AI平台 API文档');
      expect(markdown).toContain('## 概述');
      expect(markdown).toContain('### GET /api/test');
      expect(markdown).toContain('测试端点');
    });

    test('应该按标签分组端点', () => {
      const endpoint1 = {
        path: '/api/test1',
        method: 'GET',
        description: '测试端点1',
        tags: ['认证'],
        responses: [{ code: 200, description: '成功' }]
      };

      const endpoint2 = {
        path: '/api/test2',
        method: 'POST',
        description: '测试端点2',
        tags: ['项目'],
        responses: [{ code: 201, description: '创建成功' }]
      };

      ApiDocsService.register(endpoint1);
      ApiDocsService.register(endpoint2);
      const markdown = ApiDocsService.generateMarkdown();

      expect(markdown).toContain('## 认证');
      expect(markdown).toContain('## 项目');
    });

    test('应该包含参数表格', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'ID'
          }
        ],
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      const markdown = ApiDocsService.generateMarkdown();

      expect(markdown).toContain('#### 请求参数');
      expect(markdown).toContain('| 参数名 | 类型 | 必填 | 说明 |');
      expect(markdown).toContain('| id | string | 是 | ID |');
    });

    test('应该包含响应表格', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        responses: [
          { code: 200, description: '成功' },
          { code: 400, description: '错误' }
        ]
      };

      ApiDocsService.register(endpoint);
      const markdown = ApiDocsService.generateMarkdown();

      expect(markdown).toContain('#### 响应');
      expect(markdown).toContain('| 状态码 | 说明 |');
      expect(markdown).toContain('| 200 | 成功 |');
      expect(markdown).toContain('| 400 | 错误 |');
    });
  });

  describe('获取端点', () => {
    test('应该返回所有端点', () => {
      const endpoint1 = {
        path: '/api/test1',
        method: 'GET',
        description: '测试端点1',
        responses: [{ code: 200, description: '成功' }]
      };

      const endpoint2 = {
        path: '/api/test2',
        method: 'POST',
        description: '测试端点2',
        responses: [{ code: 201, description: '创建成功' }]
      };

      ApiDocsService.register(endpoint1);
      ApiDocsService.register(endpoint2);
      const endpoints = ApiDocsService.getEndpoints();

      expect(endpoints).toHaveLength(2);
      expect(endpoints[0].path).toBe('/api/test1');
      expect(endpoints[1].path).toBe('/api/test2');
    });

    test('应该返回空数组当没有端点', () => {
      const endpoints = ApiDocsService.getEndpoints();
      expect(endpoints).toEqual([]);
    });
  });

  describe('清空端点', () => {
    test('应该成功清空所有端点', () => {
      const endpoint = {
        path: '/api/test',
        method: 'GET',
        description: '测试端点',
        responses: [{ code: 200, description: '成功' }]
      };

      ApiDocsService.register(endpoint);
      expect(ApiDocsService.getEndpoints()).toHaveLength(1);

      ApiDocsService.clear();
      expect(ApiDocsService.getEndpoints()).toHaveLength(0);
    });
  });
});
