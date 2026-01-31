# 依赖安装与配置指南

## 问题说明

### 错误信息
```
找不到模块"vue"或其相应的类型声明。
找不到模块"element-plus"或其相应的类型声明。
找不到模块"@element-plus/icons-vue"或其相应的类型声明。
```

### 问题原因
1. node_modules目录不存在或依赖未安装
2. TypeScript无法找到类型声明文件
3. IDE索引未更新

## 解决方案

### 1. 安装依赖

#### 使用npm
```bash
cd frontend
npm install
```

#### 使用yarn
```bash
cd frontend
yarn install
```

#### 使用pnpm
```bash
cd frontend
pnpm install
```

### 2. 清理缓存

#### 清理npm缓存
```bash
npm cache clean --force
```

#### 清理node_modules
```bash
# Windows
rmdir /s /q node_modules

# Linux/Mac
rm -rf node_modules
```

#### 重新安装依赖
```bash
npm install
```

### 3. TypeScript配置

确保tsconfig.json配置正确：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Vite配置

确保vite.config.ts配置正确：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 5. IDE配置

#### VSCode

安装推荐扩展：
- Vue - Official
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

#### WebStorm

确保启用了TypeScript和Vue插件：
- Settings → Languages & Frameworks → TypeScript
- Settings → Languages & Frameworks → JavaScript → Vue

### 6. 环境变量

创建.env文件：

```env
# API配置
VITE_API_BASE_URL=http://localhost:5000

# 应用配置
VITE_APP_TITLE=Medagil AI平台
```

## 验证步骤

### 1. 检查依赖安装
```bash
cd frontend
ls node_modules
```

应该看到以下目录：
- vue
- element-plus
- @element-plus/icons-vue
- vue-router
- pinia
- axios

### 2. 检查TypeScript配置
```bash
cd frontend
npx tsc --noEmit
```

应该没有错误输出。

### 3. 启动开发服务器
```bash
cd frontend
npm run dev
```

应该看到：
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. 访问应用
在浏览器中打开：http://localhost:5173

## 常见问题

### Q1: npm install失败
**A:** 尝试以下方法：
1. 清理npm缓存：`npm cache clean --force`
2. 删除node_modules和package-lock.json
3. 重新安装：`npm install`
4. 使用国内镜像：`npm config set registry https://registry.npmmirror.com`

### Q2: TypeScript找不到类型声明
**A:** 确保以下配置：
1. tsconfig.json的include包含src目录
2. node_modules已正确安装
3. IDE已安装TypeScript插件
4. 重启IDE

### Q3: Vite启动失败
**A:** 检查以下内容：
1. 端口是否被占用
2. vite.config.ts配置是否正确
3. 依赖是否完整安装
4. Node.js版本是否满足要求（>=16）

### Q4: Element Plus组件报错
**A:** 确保正确引入：
```typescript
// ✅ 正确
import { ElButton } from 'element-plus'

// ❌ 错误
import { Button } from 'element-plus'
```

## 完整的package.json

确保package.json包含所有必要的依赖：

```json
{
  "name": "medagil-frontend",
  "version": "1.0.0",
  "description": "Medagil AI平台前端应用",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "vue": "^3.3.4",
    "vue-router": "^4.2.4",
    "pinia": "^2.1.6",
    "axios": "^1.5.0",
    "element-plus": "^2.3.14",
    "@element-plus/icons-vue": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.3.4",
    "@vue/tsconfig": "^0.4.0",
    "typescript": "~5.2.2",
    "vite": "^4.4.9",
    "vue-tsc": "^1.8.11",
    "eslint": "^8.49.0",
    "@typescript-eslint/eslint-plugin": "^6.5.0",
    "@typescript-eslint/parser": "^6.5.0",
    "eslint-plugin-vue": "^9.17.0",
    "prettier": "^3.0.3"
  }
}
```

## 依赖版本说明

### 核心依赖
- vue: ^3.3.4 - Vue 3框架
- vue-router: ^4.2.4 - Vue路由
- pinia: ^2.1.6 - 状态管理
- axios: ^1.5.0 - HTTP客户端
- element-plus: ^2.3.14 - UI组件库
- @element-plus/icons-vue: ^2.1.0 - 图标库

### 开发依赖
- @vitejs/plugin-vue: ^4.3.4 - Vite Vue插件
- typescript: ~5.2.2 - TypeScript编译器
- vite: ^4.4.9 - 构建工具
- vue-tsc: ^1.8.11 - Vue TypeScript编译器
- eslint: ^8.49.0 - 代码检查
- prettier: ^3.0.3 - 代码格式化

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd medagil-platform/frontend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问应用
打开浏览器访问：http://localhost:5173

## 故障排除

### 检查清单
- [ ] Node.js版本 >= 16
- [ ] npm版本 >= 8
- [ ] 依赖已完整安装
- [ ] tsconfig.json配置正确
- [ ] vite.config.ts配置正确
- [ ] 环境变量已配置
- [ ] IDE插件已安装
- [ ] 端口未被占用

### 常见错误

#### 错误1: Cannot find module 'vue'
**解决方案:**
1. 删除node_modules和package-lock.json
2. 重新运行npm install
3. 重启IDE

#### 错误2: Cannot find module 'element-plus'
**解决方案:**
1. 检查package.json中是否有element-plus依赖
2. 运行npm install
3. 检查import语句是否正确

#### 错误3: TypeScript compilation error
**解决方案:**
1. 运行npm run type-check
2. 检查错误信息
3. 修复类型错误
4. 重新运行npm run dev

## 相关文档

- [代码规范文档](./code-standards.md)
- [代码质量文档](./code-quality.md)
- [类型安全指南](./type-safety-guide.md)
- [API使用文档](./api-usage.md)
