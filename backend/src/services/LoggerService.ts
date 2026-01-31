
/**
 * 日志持久化服务
 * 负责将日志写入文件或发送到日志服务
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// 日志级别
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// 日志条目接口
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: {
    path?: string;
    method?: string;
    statusCode?: number;
    duration?: number;
    userId?: string;
    ip?: string;
    userAgent?: string;
    error?: {
      message: string;
      stack?: string;
    };
    [key: string]: any;
  };
}

class LoggerService {
  // 日志目录
  private readonly LOG_DIR = path.join(process.cwd(), 'logs');

  // 日志文件路径
  private readonly LOG_FILES = {
    [LogLevel.DEBUG]: path.join(this.LOG_DIR, 'debug.log'),
    [LogLevel.INFO]: path.join(this.LOG_DIR, 'info.log'),
    [LogLevel.WARN]: path.join(this.LOG_DIR, 'warn.log'),
    [LogLevel.ERROR]: path.join(this.LOG_DIR, 'error.log')
  };

  // 是否启用文件日志
  private readonly ENABLE_FILE_LOG = process.env.ENABLE_FILE_LOG !== 'false';

  // 日志缓冲区
  private buffers: Map<LogLevel, string[]> = new Map();

  // 缓冲区刷新间隔（毫秒）
  private readonly FLUSH_INTERVAL = 5000;

  // 单个日志文件最大大小（10MB）
  private readonly MAX_LOG_SIZE = 10 * 1024 * 1024;

  constructor() {
    // 初始化缓冲区
    for (const level of Object.values(LogLevel)) {
      this.buffers.set(level, []);
    }

    // 确保日志目录存在
    if (this.ENABLE_FILE_LOG) {
      this.ensureLogDir();
    }

    // 定期刷新缓冲区
    setInterval(() => this.flushAllBuffers(), this.FLUSH_INTERVAL);
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDir(): void {
    if (!fs.existsSync(this.LOG_DIR)) {
      fs.mkdirSync(this.LOG_DIR, { recursive: true });
    }
  }

  /**
   * 格式化日志条目
   */
  private formatEntry(entry: LogEntry): string {
    const context = entry.context ? JSON.stringify(entry.context) : '';
    return `[${entry.timestamp}] [${entry.level}] ${entry.message} ${context}
`;
  }

  /**
   * 写入日志到文件
   */
  private writeToFile(level: LogLevel, entry: LogEntry): void {
    if (!this.ENABLE_FILE_LOG) return;

    const logFile = this.LOG_FILES[level];
    const formattedEntry = this.formatEntry(entry);

    // 检查文件大小，如果超过限制则轮转
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      if (stats.size >= this.MAX_LOG_SIZE) {
        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
        const rotatedFile = logFile.replace('.log', `.${timestamp}.log`);
        fs.renameSync(logFile, rotatedFile);
      }
    }

    // 追加到文件
    fs.appendFileSync(logFile, formattedEntry);
  }

  /**
   * 添加日志到缓冲区
   */
  private addToBuffer(level: LogLevel, entry: LogEntry): void {
    const buffer = this.buffers.get(level);
    if (buffer) {
      buffer.push(this.formatEntry(entry));

      // 如果缓冲区超过100条，立即刷新
      if (buffer.length >= 100) {
        this.flushBuffer(level);
      }
    }
  }

  /**
   * 刷新指定级别的缓冲区
   */
  private flushBuffer(level: LogLevel): void {
    const buffer = this.buffers.get(level);
    if (!buffer || buffer.length === 0) return;

    const logFile = this.LOG_FILES[level];
    const content = buffer.join('');

    // 写入文件
    if (this.ENABLE_FILE_LOG) {
      fs.appendFileSync(logFile, content);
    }

    // 清空缓冲区
    buffer.length = 0;
  }

  /**
   * 刷新所有缓冲区
   */
  private flushAllBuffers(): void {
    for (const level of Object.values(LogLevel)) {
      this.flushBuffer(level);
    }
  }

  /**
   * 记录日志
   */
  log(level: LogLevel, message: string, context?: LogEntry['context']): void {
    const entry: LogEntry = {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
      level,
      message,
      context
    };

    // 添加到缓冲区
    this.addToBuffer(level, entry);

    // 同时输出到控制台
    const consoleMethod = level === LogLevel.ERROR ? console.error :
                       level === LogLevel.WARN ? console.warn :
                       console.log;
    consoleMethod(`[${level}] ${message}`, context || '');
  }

  /**
   * 记录调试日志
   */
  debug(message: string, context?: LogEntry['context']): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * 记录信息日志
   */
  info(message: string, context?: LogEntry['context']): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, context?: LogEntry['context']): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * 记录错误日志
   */
  error(message: string, context?: LogEntry['context']): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * 记录HTTP请求日志
   */
  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string,
    ip?: string
  ): void {
    const level = statusCode >= 500 ? LogLevel.ERROR :
                 statusCode >= 400 ? LogLevel.WARN :
                 LogLevel.INFO;

    this.log(level, 'HTTP Request', {
      method,
      path,
      statusCode,
      duration,
      userId,
      ip
    });
  }

  /**
   * 记录错误
   */
  logError(error: Error, context?: LogEntry['context']): void {
    this.log(LogLevel.ERROR, error.message, {
      ...context,
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }

  /**
   * 清理旧日志文件
   * 保留最近7天的日志
   */
  cleanOldLogs(): void {
    if (!this.ENABLE_FILE_LOG) return;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    try {
      const files = fs.readdirSync(this.LOG_DIR);
      for (const file of files) {
        const filePath = path.join(this.LOG_DIR, file);
        const stats = fs.statSync(filePath);

        // 删除超过7天的日志文件
        if (stats.mtimeMs < sevenDaysAgo) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('清理旧日志失败:', error);
    }
  }
}

// 导出单例
export default new LoggerService();
