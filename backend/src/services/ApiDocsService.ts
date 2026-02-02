
/**
 * API文档服务
 * 生成和管理API文档
 */

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: ApiParameter[];
  responses: ApiResponse[];
  auth?: boolean;
  tags?: string[];
}

interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
}

interface ApiResponse {
  code: number;
  description: string;
  schema?: any;
}

class ApiDocsService {
  private endpoints: ApiEndpoint[] = [];

  /**
   * 注册API端点
   */
  register(endpoint: ApiEndpoint): void {
    this.endpoints.push(endpoint);
  }

  /**
   * 生成OpenAPI规范文档
   */
  generateOpenApiSpec(): object {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Medagil AI平台API',
        version: '1.0.0',
        description: 'Medagil AI平台后端API文档'
      },
      servers: [
        {
          url: process.env.API_BASE_URL || 'http://localhost:5000',
          description: '开发服务器'
        }
      ],
      tags: [
        {
          name: '认证',
          description: '用户认证相关接口'
        },
        {
          name: '项目',
          description: '项目管理相关接口'
        },
        {
          name: '任务',
          description: '任务管理相关接口'
        },
        {
          name: '订阅',
          description: '订阅服务相关接口'
        }
      ],
      paths: this.generatePaths(),
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          ApiResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean'
              },
              message: {
                type: 'string'
              },
              data: {},
              code: {
                type: 'number'
              }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              username: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              phone: {
                type: 'string'
              },
              nickname: {
                type: 'string'
              },
              avatar: {
                type: 'string'
              },
              subscriptionLevel: {
                type: 'number'
              },
              points: {
                type: 'number'
              }
            }
          },
          Project: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              userId: {
                type: 'string'
              },
              categoryId: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              description: {
                type: 'string'
              },
              coverImage: {
                type: 'string'
              },
              tags: {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              status: {
                type: 'number'
              }
            }
          }
        }
      }
    };
  }

  /**
   * 生成路径定义
   */
  private generatePaths(): object {
    const paths: Record<string, any> = {};

    for (const endpoint of this.endpoints) {
      const pathKey = endpoint.path;
      if (!paths[pathKey]) {
        paths[pathKey] = {};
      }

      const methodKey = endpoint.method.toLowerCase();
      paths[pathKey][methodKey] = {
        tags: endpoint.tags || [],
        summary: endpoint.description,
        description: endpoint.description,
        security: endpoint.auth ? [{ bearerAuth: [] }] : [],
        parameters: endpoint.parameters?.map(param => ({
          name: param.name,
          in: this.getParameterLocation(param.name),
          required: param.required,
          schema: {
            type: param.type
          },
          description: param.description,
          example: param.example
        })) || [],
        responses: this.generateResponseDefinitions(endpoint.responses)
      };
    }

    return paths;
  }

  /**
   * 确定参数位置
   */
  private getParameterLocation(paramName: string): 'path' | 'query' | 'header' {
    if (paramName.startsWith('{') && paramName.endsWith('}')) {
      return 'path';
    }
    return 'query';
  }

  /**
   * 生成响应定义
   */
  private generateResponseDefinitions(responses: ApiResponse[]): object {
    const definitions: Record<string, any> = {};

    for (const response of responses) {
      definitions[response.code.toString()] = {
        description: response.description,
        content: {
          'application/json': {
            schema: response.schema || {
              $ref: '#/components/schemas/ApiResponse'
            }
          }
        }
      };
    }

    return definitions;
  }

  /**
   * 生成Markdown文档
   */
  generateMarkdown(): string {
    let markdown = `# Medagil AI平台 API文档

## 概述

本文档描述了Medagil AI平台后端API的使用方法。

### 基础URL

\`\`\`
${process.env.API_BASE_URL || 'http://localhost:5000'}
\`\`\`

### 认证

大多数API需要JWT令牌认证。在请求头中添加：

\`\`\`
Authorization: Bearer <your-token>
\`\`\`

---

`;

    // 按标签分组
    const groupedEndpoints = this.groupByTags();

    for (const [tag, endpoints] of Object.entries(groupedEndpoints)) {
      markdown += `## ${tag}\n\n`;

      for (const endpoint of endpoints) {
        markdown += `### ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`;
        markdown += `${endpoint.description}\n\n`;

        if (endpoint.auth) {
          markdown += `**需要认证**: 是\n\n`;
        }

        if (endpoint.parameters && endpoint.parameters.length > 0) {
          markdown += `#### 请求参数\n\n`;
          markdown += `| 参数名 | 类型 | 必填 | 说明 |\n`;
          markdown += `|--------|------|------|------|\n`;
          for (const param of endpoint.parameters) {
            markdown += `| ${param.name} | ${param.type} | ${param.required ? '是' : '否'} | ${param.description} |\n`;
          }
          markdown += '\n';
        }

        markdown += `#### 响应\n\n`;
        markdown += `| 状态码 | 说明 |\n`;
        markdown += `|--------|------|\n`;
        for (const response of endpoint.responses) {
          markdown += `| ${response.code} | ${response.description} |\n`;
        }
        markdown += '\n---\n\n';
      }
    }

    return markdown;
  }

  /**
   * 按标签分组端点
   */
  private groupByTags(): Record<string, ApiEndpoint[]> {
    const grouped: Record<string, ApiEndpoint[]> = {};

    for (const endpoint of this.endpoints) {
      const tags = endpoint.tags || ['其他'];
      for (const tag of tags) {
        if (!grouped[tag]) {
          grouped[tag] = [];
        }
        grouped[tag].push(endpoint);
      }
    }

    return grouped;
  }

  /**
   * 获取所有端点
   */
  getEndpoints(): ApiEndpoint[] {
    return [...this.endpoints];
  }

  /**
   * 清空所有端点
   */
  clear(): void {
    this.endpoints = [];
  }
}

// 导出类
export { ApiDocsService };

// 导出单例
export const apiDocsService = new ApiDocsService();
export default apiDocsService;
