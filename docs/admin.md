# Medagil AI平台管理端开发指南

## 技术栈

- Vue 3
- TypeScript
- Element Plus
- Vite
- Vue Router
- Pinia
- ECharts (数据可视化)

## 项目结构

```
admin/
├── public/             # 静态资源
├── src/
│   ├── api/           # API接口
│   ├── assets/        # 资源文件
│   ├── components/    # 公共组件
│   ├── layout/        # 布局组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── styles/        # 样式文件
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── index.html         # HTML模板
├── package.json       # 项目配置
├── tsconfig.json      # TypeScript配置
└── vite.config.ts     # Vite配置
```

## 开发指南

### 安装依赖

```bash
cd admin
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 代码规范

- 使用TypeScript编写代码
- 组件命名采用PascalCase
- 文件命名采用kebab-case
- 使用组合式API (Composition API)
- 使用Element Plus组件库

## 布局结构

管理端采用经典的左侧导航栏、顶部导航栏和内容区域的布局结构。

## 权限管理

实现基于角色的访问控制(RBAC)，不同角色拥有不同的权限。

## 数据可视化

使用ECharts实现数据可视化，展示各类统计图表。

## API请求

使用axios进行API请求，配置在`src/api`目录下。

## 状态管理

使用Pinia进行状态管理，store定义在`src/stores`目录下。

## 路由

使用Vue Router进行路由管理，路由配置在`src/router/index.ts`文件中。
