/**
 * 文件上传安全中间件
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 允许的文件类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// 最大文件大小 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 检查文件类型
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error('不支持的文件类型'));
    return;
  }

  // 检查文件扩展名
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  if (!allowedExts.includes(ext)) {
    cb(new Error('不支持的文件扩展名'));
    return;
  }

  cb(null, true);
};

// 创建 multer 实例
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
});

// 单文件上传中间件
export const uploadSingle = (fieldName: string = 'file') => {
  return upload.single(fieldName);
};

// 多文件上传中间件
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 5) => {
  return upload.array(fieldName, maxCount);
};

// 文件大小验证中间件
export const validateFileSize = (maxSize: number = MAX_FILE_SIZE) => {
  return (req: any, res: any, next: any) => {
    if (req.file && req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `文件大小超过限制 (最大 ${maxSize / 1024 / 1024}MB)`
      });
    }
    next();
  };
};
