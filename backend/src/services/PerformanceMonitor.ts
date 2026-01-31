
/**
 * 性能监控服务
 * 用于收集和分析系统性能指标
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface PerformanceStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  p95: number;
  p99: number;
}

class PerformanceMonitor {
  // 存储性能指标
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  // 指标保留时间窗口（1小时）
  private readonly RETENTION_TIME = 60 * 60 * 1000;

  // 最大保留指标数量
  private readonly MAX_METRICS = 10000;

  /**
   * 记录性能指标
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // 清理过期指标
    this.cleanup(name);
  }

  /**
   * 获取性能统计
   */
  getStats(name: string): PerformanceStats | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / count;
    const min = values[0];
    const max = values[count - 1];

    // 计算百分位数
    const p95Index = Math.floor(count * 0.95);
    const p99Index = Math.floor(count * 0.99);
    const p95 = values[p95Index];
    const p99 = values[p99Index];

    return {
      count,
      min,
      max,
      avg,
      p95,
      p99
    };
  }

  /**
   * 获取所有指标名称
   */
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * 清理过期指标
   */
  private cleanup(name: string): void {
    const metrics = this.metrics.get(name);
    if (!metrics) return;

    const now = Date.now();
    const validMetrics = metrics.filter(m => now - m.timestamp < this.RETENTION_TIME);

    // 如果超过最大数量，删除最旧的
    if (validMetrics.length > this.MAX_METRICS) {
      validMetrics.splice(0, validMetrics.length - this.MAX_METRICS);
    }

    this.metrics.set(name, validMetrics);
  }

  /**
   * 清除所有指标
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * 获取性能报告
   */
  getReport(): Record<string, PerformanceStats> {
    const report: Record<string, PerformanceStats> = {};

    for (const name of this.getMetricNames()) {
      const stats = this.getStats(name);
      if (stats) {
        report[name] = stats;
      }
    }

    return report;
  }

  /**
   * 记录HTTP请求性能
   */
  recordHttpRequest(
    path: string,
    method: string,
    statusCode: number,
    duration: number
  ): void {
    this.record(`http.request.${method.toLowerCase()}.${path}`, duration, {
      status: statusCode.toString()
    });
  }

  /**
   * 记录数据库查询性能
   */
  recordDbQuery(
    operation: string,
    table: string,
    duration: number
  ): void {
    this.record(`db.query.${operation}.${table}`, duration, {
      operation,
      table
    });
  }

  /**
   * 记录外部API调用性能
   */
  recordExternalApiCall(
    service: string,
    endpoint: string,
    duration: number,
    success: boolean
  ): void {
    this.record(`external_api.${service}.${endpoint}`, duration, {
      success: success.toString()
    });
  }
}

// 导出单例
export default new PerformanceMonitor();
