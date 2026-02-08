import { defineConfig } from 'orval';

export default defineConfig({
  /** 用户端 API：供 apps/web、apps/miniapp 使用 */
  user: {
    input: {
      target: './spec/openapi.yaml',
      filters: {
        tags: ['user'],
      },
    },
    output: {
      target: './src/user/endpoints.ts',
      schemas: './src/user/model',
      mode: 'single',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: '',
      override: {
        mutator: {
          path: './src/mutator/use-custom-instance.ts',
          name: 'useCustomInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
  /** 管理端 API：供 apps/admin 使用 */
  admin: {
    input: {
      target: './spec/openapi.yaml',
      filters: {
        tags: ['admin'],
      },
    },
    output: {
      target: './src/admin/endpoints.ts',
      schemas: './src/admin/model',
      mode: 'single',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: '',
      override: {
        mutator: {
          path: './src/mutator/use-custom-instance.ts',
          name: 'useCustomInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
