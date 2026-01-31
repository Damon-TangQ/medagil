
/**
 * 参数验证中间件
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

/**
 * 验证规则
 */
export const rules = {
  requiredString: (min: number = 1, max: number = 100) => ({
    notEmpty: {
      errorMessage: '不能为空'
    },
    isLength: {
      options: { min, max },
      errorMessage: `长度必须在${min}-${max}之间`
    },
    isString: {
      errorMessage: '必须是字符串'
    }
  }),

  optionalString: (min: number = 1, max: number = 100) => ({
    optional: true,
    isLength: {
      options: { min, max },
      errorMessage: `长度必须在${min}-${max}之间`
    },
    isString: {
      errorMessage: '必须是字符串'
    }
  }),

  requiredNumber: (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) => ({
    notEmpty: {
      errorMessage: '不能为空'
    },
    isNumeric: {
      errorMessage: '必须是数字'
    },
    isInt: {
      options: { min, max },
      errorMessage: `必须在${min}-${max}之间`
    }
  }),

  optionalNumber: (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) => ({
    optional: true,
    isNumeric: {
      errorMessage: '必须是数字'
    },
    isInt: {
      options: { min, max },
      errorMessage: `必须在${min}-${max}之间`
    }
  }),

  requiredEmail: () => ({
    notEmpty: {
      errorMessage: '不能为空'
    },
    isEmail: {
      errorMessage: '邮箱格式不正确'
    }
  }),

  optionalEmail: () => ({
    optional: true,
    isEmail: {
      errorMessage: '邮箱格式不正确'
    }
  }),

  requiredPhone: () => ({
    notEmpty: {
      errorMessage: '不能为空'
    },
    matches: {
      options: /^1[3-9]\d{9}$/,
      errorMessage: '手机号格式不正确'
    }
  }),

  optionalPhone: () => ({
    optional: true,
    matches: {
      options: /^1[3-9]\d{9}$/,
      errorMessage: '手机号格式不正确'
    }
  }),

  requiredUrl: () => ({
    notEmpty: {
      errorMessage: '不能为空'
    },
    isURL: {
      errorMessage: 'URL格式不正确'
    }
  }),

  optionalUrl: () => ({
    optional: true,
    isURL: {
      errorMessage: 'URL格式不正确'
    }
  }),

  requiredBoolean: () => ({
    notEmpty: {
      errorMessage: '不能为空'
    },
    isBoolean: {
      errorMessage: '必须是布尔值'
    }
  }),

  optionalBoolean: () => ({
    optional: true,
    isBoolean: {
      errorMessage: '必须是布尔值'
    }
  })
};

/**
 * 验证中间件
 */
export const validate = (
  schema: {
    body?: Record<string, any>;
    query?: Record<string, any>;
    params?: Record<string, any>;
  }
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors: Record<string, string> = {};
      errors.array().forEach((error: any) => {
        formattedErrors[error.path] = error.msg;
      });

      res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: formattedErrors
      });
      return;
    }

    next();
  };
};
