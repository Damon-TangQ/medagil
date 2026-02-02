
/**
 * 文件上传中间件
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import LoggerService from '../services/LoggerService';

// 上传目录
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 存储配置
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const userDir = path.join(UPLOAD_DIR, 'anonymous');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 允许的文件类型
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

// Multer实例
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // 最多10个文件
  }
});

/**
 * 单文件上传中间件
 */
export const uploadSingle = (fieldName: string = 'file') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        LoggerService.error('文件上传失败', {
          error: err.message,
          fieldName,
          userId: req.user?.id
        });

        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
              success: false,
              message: '文件大小超过限制（最大10MB）'
            });
            return;
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            res.status(400).json({
              success: false,
              message: '文件数量超过限制（最多10个）'
            });
            return;
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            res.status(400).json({
              success: false,
              message: `不存在的字段名: ${err.field}`
            });
            return;
          }
        }

        res.status(400).json({
          success: false,
          message: err.message || '文件上传失败'
        });
        return;
      }

      next();
    });
  };
};

/**
 * 多文件上传中间件
 */
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 10) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        LoggerService.error('文件上传失败', {
          error: err.message,
          fieldName,
          maxCount,
          userId: req.user?.id
        });

        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
              success: false,
              message: '文件大小超过限制（最大10MB）'
            });
            return;
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            res.status(400).json({
              success: false,
              message: `文件数量超过限制（最多${maxCount}个）`
            });
            return;
          }
        }

        res.status(400).json({
          success: false,
          message: err.message || '文件上传失败'
        });
        return;
      }

      next();
    });
  };
};
