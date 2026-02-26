# 图片功能解决方案

## 问题描述
Medagil Web 应用在处理图片时遇到以下问题：
- 缺少 `public` 文件夹导致静态图片无法加载
- Next.js 配置中缺少图片优化设置
- 没有统一的图片组件用于显示和上传

## 解决方案

### 1. 创建 Public 文件夹结构
```
apps/web/public/
├── images/
│   └── placeholder.svg  # SVG 占位符图片
```

### 2. 更新 Next.js 配置
在 `next.config.js` 中添加图片优化配置：
- 支持外部图片域名
- 配置图片远程模式
- 移除已弃用的 `experimental.appDir` 设置

### 3. 创建图片组件
- `OptimizedImage`: 基于 Next.js Image 组件的优化版本，支持模糊占位符
- `PlaceholderImage`: 纯 CSS 占位符组件，用于加载状态
- `ImageUpload`: 完整的图片上传组件，支持文件验证和预览

### 4. 创建测试页面
访问 `/image-test` 页面验证所有图片功能：
- 静态图片加载
- 图片上传和预览
- 远程图片加载

## 使用方法

### 显示图片
```tsx
import { OptimizedImage } from '@/components/ui/image';

// 静态图片
<OptimizedImage
  src="/images/placeholder.svg"
  alt="描述"
  width={300}
  height={200}
/>

// 远程图片
<OptimizedImage
  src="https://example.com/image.jpg"
  alt="描述"
  width={300}
  height={200}
/>
```

### 上传图片
```tsx
import { ImageUpload } from '@/components/ui/image-upload';

<ImageUpload
  onUpload={(files) => handleFiles(files)}
  maxFiles={5}
  maxSize={5 * 1024 * 1024} // 5MB
  acceptedTypes={['image/jpeg', 'image/png']}
/>
```

## 验证结果
- ✅ 开发服务器启动无错误
- ✅ 图片组件编译通过
- ✅ 静态文件正确提供
- ✅ Next.js 图片优化配置生效

## 下一步
- 将图片上传组件与后端 API 集成
- 添加图片处理和优化功能
- 实现图片库管理功能