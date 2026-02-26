'use client';

import { useState } from 'react';
import { OptimizedImage, PlaceholderImage } from '@/components/ui/image';
import { ImageUpload } from '@/components/ui/image-upload';

/**
 * 图片功能测试页面
 *
 * 用于验证：
 * - 静态图片加载
 * - 图片上传组件
 * - 图片优化和占位符
 */
export default function ImageTestPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (files: File[]) => {
    // 模拟上传处理 - 在实际应用中，这里会调用 API
    const urls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...urls]);
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">图片功能测试</h1>
          <p className="text-gray-600">验证图片加载、优化和上传功能</p>
        </header>

        {/* 静态图片测试 */}
        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">静态图片测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">优化的 Next.js 图片</h3>
              <OptimizedImage
                src="/images/placeholder.svg"
                alt="占位符图片"
                width={300}
                height={200}
                className="rounded-lg border"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">占位符图片组件</h3>
              <PlaceholderImage
                width={300}
                height={200}
                className="rounded-lg border"
                text="加载中..."
              />
            </div>
          </div>
        </section>

        {/* 图片上传测试 */}
        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">图片上传测试</h2>
          <ImageUpload
            onUpload={handleImageUpload}
            maxFiles={5}
            maxSize={5 * 1024 * 1024} // 5MB
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          />

          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">已上传的图片</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative">
                    <OptimizedImage
                      src={url}
                      alt={`上传的图片 ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-lg border object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 远程图片测试 */}
        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">远程图片测试</h2>
          <p className="text-sm text-gray-600">
            测试从外部域名加载图片（需要配置 next.config.js 中的 image.domains 或 remotePatterns）
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">示例远程图片</h3>
              <OptimizedImage
                src="https://picsum.photos/400/300?random=1"
                alt="示例图片"
                width={400}
                height={300}
                className="rounded-lg border"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">另一个示例图片</h3>
              <OptimizedImage
                src="https://picsum.photos/400/300?random=2"
                alt="另一个示例图片"
                width={400}
                height={300}
                className="rounded-lg border"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}