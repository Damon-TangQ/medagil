"use client";

import { useState, useRef } from "react";
import { OptimizedImage, PlaceholderImage } from "./image";

interface ImageUploadProps {
  onUpload?: (file: File) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function ImageUpload({
  onUpload,
  onError,
  accept = "image/*",
  maxSize = 10,
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      onError?.("请选择图片文件");
      return;
    }

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      onError?.(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传文件
    setUploading(true);
    try {
      onUpload?.(file);
    } catch (error) {
      onError?.("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
      >
        {preview ? (
          <OptimizedImage
            src={preview}
            alt="上传的图片"
            width={200}
            height={150}
            className="w-full h-auto rounded"
          />
        ) : (
          <PlaceholderImage
            width={200}
            height={150}
            text={uploading ? "上传中..." : "点击上传图片"}
            className="rounded"
          />
        )}
      </div>

      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-white">上传中...</div>
        </div>
      )}
    </div>
  );
}