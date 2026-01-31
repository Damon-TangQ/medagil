
/**
 * PerformanceMonitor 单元测试
 * 测试性能指标收集和统计功能
 */

import PerformanceMonitor from '../src/services/PerformanceMonitor';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    // 每个测试前清理所有指标
    PerformanceMonitor.clear();
  });

  describe('记录性能指标', () => {
    test('应该成功记录性能指标', () => {
      PerformanceMonitor.record('test.metric', 100);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
      expect(stats?.min).toBe(100);
      expect(stats?.max).toBe(100);
      expect(stats?.avg).toBe(100);
    });

    test('应该支持带标签的指标', () => {
      const tags = { tag1: 'value1', tag2: 'value2' };
      PerformanceMonitor.record('test.metric', 150, tags);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
    });

    test('应该记录多个指标', () => {
      PerformanceMonitor.record('test.metric', 100);
      PerformanceMonitor.record('test.metric', 200);
      PerformanceMonitor.record('test.metric', 300);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats?.count).toBe(3);
      expect(stats?.min).toBe(100);
      expect(stats?.max).toBe(300);
      expect(stats?.avg).toBe(200);
    });
  });

  describe('计算统计信息', () => {
    test('应该正确计算最小值', () => {
      PerformanceMonitor.record('test.metric', 100);
      PerformanceMonitor.record('test.metric', 200);
      PerformanceMonitor.record('test.metric', 50);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats?.min).toBe(50);
    });

    test('应该正确计算最大值', () => {
      PerformanceMonitor.record('test.metric', 100);
      PerformanceMonitor.record('test.metric', 200);
      PerformanceMonitor.record('test.metric', 300);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats?.max).toBe(300);
    });

    test('应该正确计算平均值', () => {
      PerformanceMonitor.record('test.metric', 100);
      PerformanceMonitor.record('test.metric', 200);
      PerformanceMonitor.record('test.metric', 300);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats?.avg).toBe(200);
    });

    test('应该正确计算P95百分位数', () => {
      // 生成100个数据点
      for (let i = 0; i < 100; i++) {
        PerformanceMonitor.record('test.metric', i);
      }

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats?.p95).toBe(95);
    });

    test('应该正确计算P99百分位数', () => {
      // 生成100个数据点
      for (let i = 0; i < 100; i++) {
        PerformanceMonitor.record('test.metric', i);
      }

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats?.p99).toBe(99);
    });
  });

  describe('HTTP请求性能', () => {
    test('应该记录HTTP请求性能', () => {
      PerformanceMonitor.recordHttpRequest('/api/test', 'GET', 200, 123);

      const stats = PerformanceMonitor.getStats('http.request.get./api/test');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
      expect(stats?.min).toBe(123);
    });

    test('应该按状态码分组HTTP请求', () => {
      PerformanceMonitor.recordHttpRequest('/api/test', 'GET', 200, 100);
      PerformanceMonitor.recordHttpRequest('/api/test', 'GET', 500, 200);

      const stats200 = PerformanceMonitor.getStats('http.request.get./api/test');
      const stats500 = PerformanceMonitor.getStats('http.request.get./api/test');

      expect(stats200?.count).toBe(1);
      expect(stats500?.count).toBe(1);
    });
  });

  describe('数据库查询性能', () => {
    test('应该记录数据库查询性能', () => {
      PerformanceMonitor.recordDbQuery('SELECT', 'users', 50);

      const stats = PerformanceMonitor.getStats('db.query.SELECT.users');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
      expect(stats?.min).toBe(50);
    });

    test('应该按操作和表分组数据库查询', () => {
      PerformanceMonitor.recordDbQuery('SELECT', 'users', 100);
      PerformanceMonitor.recordDbQuery('INSERT', 'projects', 200);

      const statsSelect = PerformanceMonitor.getStats('db.query.SELECT.users');
      const statsInsert = PerformanceMonitor.getStats('db.query.INSERT.projects');

      expect(statsSelect?.count).toBe(1);
      expect(statsInsert?.count).toBe(1);
    });
  });

  describe('外部API调用性能', () => {
    test('应该记录成功的API调用', () => {
      PerformanceMonitor.recordExternalApiCall('openai', '/completions', 500, true);

      const stats = PerformanceMonitor.getStats('external_api.openai./completions');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
    });

    test('应该记录失败的API调用', () => {
      PerformanceMonitor.recordExternalApiCall('openai', '/completions', 500, false);

      const stats = PerformanceMonitor.getStats('external_api.openai./completions');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
    });
  });

  describe('获取指标名称', () => {
    test('应该返回所有指标名称', () => {
      PerformanceMonitor.record('metric1', 100);
      PerformanceMonitor.record('metric2', 200);
      PerformanceMonitor.record('metric3', 300);

      const names = PerformanceMonitor.getMetricNames();
      expect(names).toHaveLength(3);
      expect(names).toContain('metric1');
      expect(names).toContain('metric2');
      expect(names).toContain('metric3');
    });
  });

  describe('获取性能报告', () => {
    test('应该返回所有指标的统计', () => {
      PerformanceMonitor.record('metric1', 100);
      PerformanceMonitor.record('metric2', 200);

      const report = PerformanceMonitor.getReport();

      expect(report).toBeDefined();
      expect(Object.keys(report)).toHaveLength(2);
      expect(report['metric1']).toBeDefined();
      expect(report['metric2']).toBeDefined();
    });
  });

  describe('清理指标', () => {
    test('应该成功清除所有指标', () => {
      PerformanceMonitor.record('test.metric', 100);
      PerformanceMonitor.record('test.metric', 200);

      PerformanceMonitor.clear();

      const names = PerformanceMonitor.getMetricNames();
      expect(names).toHaveLength(0);

      const stats = PerformanceMonitor.getStats('test.metric');
      expect(stats).toBeNull();
    });
  });
});
