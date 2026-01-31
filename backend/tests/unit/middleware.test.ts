
/**
 * 中间件单元测试
 * 测试认证、错误处理、日志等中间件
 */

import { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuthenticate, requireSubscriptionLevel, requireAdmin } from '../src/middleware/auth';
import { errorHandler, notFoundHandler, ValidationError, AuthError, BusinessError } from '../src/middleware/errorHandler';
import { validate, rules } from '../src/middleware/validation';

// Mock MockUserService
jest.mock('../src/services/MockUserService', () => ({
  verifyToken: jest.fn().mockReturnValue({ userId: 'test', username: 'test', subscriptionLevel: 1 }),
  login: jest.fn().mockReturnValue({ token: 'test-token', user: { id: 'test', username: 'test' } })
}));

// Mock Request和Response
const mockRequest = () => {
  const req = {
    headers: {},
    ip: '127.0.0.1'
  } as Partial<Request>;
  return req as Request;
};

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  } as Partial<Response>;
  return res as Response;
};

const mockNext = jest.fn();

describe('认证中间件', () => {
  describe('authenticate', () => {
    test('应该拒绝没有token的请求', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('认证令牌')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('应该拒绝无效的token', async () => {
      const req = mockRequest();
      req.headers.authorization = 'Bearer invalid_token';
      const res = mockResponse();
      const next = mockNext;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('认证令牌')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('应该通过有效的token', async () => {
      const req = mockRequest();
      req.headers.authorization = 'Bearer valid_token';
      const res = mockResponse();
      const next = mockNext;

      // Mock token验证
      jest.doMock('../src/services/MockUserService', () => ({
        verifyToken: jest.fn().mockReturnValue({
          userId: 'user123',
          username: 'testuser',
          subscriptionLevel: 1
        })
      }));

      await authenticate(req, res, next);

      expect(req.user).toEqual({
        id: 'user123',
        username: 'testuser',
        subscriptionLevel: 1
      });
      expect(next).toHaveBeenCalled();
    });
  });

  describe('optionalAuthenticate', () => {
    test('应该在没有token时继续处理', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      await optionalAuthenticate(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    test('应该使用有效的token', async () => {
      const req = mockRequest();
      req.headers.authorization = 'Bearer valid_token';
      const res = mockResponse();
      const next = mockNext;

      // Mock token验证
      jest.doMock('../src/services/MockUserService', () => ({
        verifyToken: jest.fn().mockReturnValue({
          userId: 'user123',
          username: 'testuser',
          subscriptionLevel: 1
        })
      }));

      await optionalAuthenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireSubscriptionLevel', () => {
    test('应该拒绝未登录的用户', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      const middleware = requireSubscriptionLevel(2);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('应该拒绝订阅级别不足的用户', () => {
      const req = mockRequest();
      req.user = { id: 'user123', username: 'testuser', subscriptionLevel: 1 };
      const res = mockResponse();
      const next = mockNext;

      const middleware = requireSubscriptionLevel(2);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('应该通过订阅级别足够的用户', () => {
      const req = mockRequest();
      req.user = { id: 'user123', username: 'testuser', subscriptionLevel: 3 };
      const res = mockResponse();
      const next = mockNext;

      const middleware = requireSubscriptionLevel(2);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    test('应该拒绝未登录的用户', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('应该拒绝非管理员用户', () => {
      const req = mockRequest();
      req.user = { id: 'user123', username: 'testuser', subscriptionLevel: 1 };
      const res = mockResponse();
      const next = mockNext;

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('应该通过管理员用户', () => {
      const req = mockRequest();
      req.user = { id: 'user123', username: 'testuser', subscriptionLevel: 3 };
      const res = mockResponse();
      const next = mockNext;

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe('错误处理中间件', () => {
  describe('errorHandler', () => {
    test('应该处理应用错误', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      const error = new AuthError('测试错误');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '测试错误'
        })
      );
    });

    test('应该处理验证错误', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      const error = new ValidationError('验证失败');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '验证失败'
        })
      );
    });

    test('应该处理业务错误', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      const error = new BusinessError('业务错误', 400);
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '业务错误'
        })
      );
    });

    test('应该处理系统错误', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      const error = new Error('系统错误');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '服务器内部错误'
        })
      );
    });
  });

  describe('notFoundHandler', () => {
    test('应该返回404响应', () => {
      const req = mockRequest();
      const res = mockResponse();

      notFoundHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: '未找到请求的资源'
        })
      );
    });
  });
});

describe('参数验证中间件', () => {
  describe('validate', () => {
    test('应该验证必填参数', () => {
      const req = mockRequest();
      req.body = {};
      const res = mockResponse();
      const next = mockNext;

      const middleware = validate({
        body: {
          name: rules.requiredString(1, 100)
        }
      });

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('应该验证参数长度', () => {
      const req = mockRequest();
      req.body = { name: 'ab' };
      const res = mockResponse();
      const next = mockNext;

      const middleware = validate({
        body: {
          name: rules.requiredString(5, 100)
        }
      });

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('应该通过有效的参数', () => {
      const req = mockRequest();
      req.body = { name: '有效名称' };
      const res = mockResponse();
      const next = mockNext;

      const middleware = validate({
        body: {
          name: rules.requiredString(1, 100)
        }
      });

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('应该验证多个参数', () => {
      const req = mockRequest();
      req.body = { name: 'test', age: 25 };
      const res = mockResponse();
      const next = mockNext;

      const middleware = validate({
        body: {
          name: rules.requiredString(1, 100),
          age: rules.requiredNumber(18, 100)
        }
      });

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('应该验证查询参数', () => {
      const req = mockRequest();
      req.query = { page: '1', pageSize: '10' };
      const res = mockResponse();
      const next = mockNext;

      const middleware = validate({
        query: {
          page: rules.optionalNumber(1, 100),
          pageSize: rules.optionalNumber(1, 100)
        }
      });

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
