
/**
 * 数据库服务
 * 提供数据库连接和操作接口
 */

import mysql from 'mysql2/promise';
import { LoggerService } from './LoggerService';

// 数据库配置接口
interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
}

class DatabaseService {
  private pool: mysql.Pool | null = null;
  private isConnected: boolean = false;

  /**
   * 获取数据库配置
   */
  private getConfig(): DatabaseConfig {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'medagil',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  }

  /**
   * 初始化数据库连接池
   */
  async initialize(): Promise<void> {
    try {
      const config = this.getConfig();

      this.pool = mysql.createPool(config);

      // 测试连接
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      this.isConnected = true;
      LoggerService.info('数据库连接成功', {
        host: config.host,
        port: config.port,
        database: config.database
      });

      // 初始化数据库表
      await this.initializeTables();
    } catch (error) {
      this.isConnected = false;
      LoggerService.error('数据库连接失败', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * 初始化数据库表
   */
  private async initializeTables(): Promise<void> {
    if (!this.pool) return;

    const connection = await this.pool.getConnection();

    try {
      // 创建用户表
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20) UNIQUE,
          email VARCHAR(100) UNIQUE,
          nickname VARCHAR(50),
          avatar VARCHAR(255),
          wechat_open_id VARCHAR(100) UNIQUE,
          wechat_union_id VARCHAR(100),
          subscription_level INT DEFAULT 0,
          subscription_expire_time DATETIME,
          points INT DEFAULT 0,
          status INT DEFAULT 1,
          last_login_time DATETIME,
          last_login_ip VARCHAR(45),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_username (username),
          INDEX idx_phone (phone),
          INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      // 创建项目表
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          category_id VARCHAR(36) NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          cover_image VARCHAR(255),
          tags VARCHAR(500),
          config JSON,
          status INT DEFAULT 1,
          like_count INT DEFAULT 0,
          view_count INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_category_id (category_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      // 创建任务表
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(36) PRIMARY KEY,
          project_id VARCHAR(36) NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          status INT DEFAULT 0,
          result TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          INDEX idx_project_id (project_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      // 创建订阅记录表
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          subscription_id VARCHAR(36) NOT NULL,
          status INT DEFAULT 0,
          start_time DATETIME NOT NULL,
          end_time DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      LoggerService.info('数据库表初始化成功');
    } catch (error) {
      LoggerService.error('数据库表初始化失败', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 获取数据库连接
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    if (!this.pool) {
      throw new Error('数据库连接池未初始化');
    }
    return await this.pool.getConnection();
  }

  /**
   * 执行查询
   */
  async query<T = any>(
    sql: string,
    params?: any[]
  ): Promise<T[]> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows as T[];
    } finally {
      connection.release();
    }
  }

  /**
   * 执行事务
   */
  async executeTransaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      LoggerService.info('数据库连接已关闭');
    }
  }

  /**
   * 检查连接状态
   */
  isReady(): boolean {
    return this.isConnected && this.pool !== null;
  }

  /**
   * 获取连接池状态
   */
  getPoolStatus(): {
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
  } | null {
    if (!this.pool) return null;

    return {
      totalConnections: (this.pool as any)._allConnections?.length || 0,
      activeConnections: (this.pool as any)._acquiringConnections?.length || 0,
      idleConnections: (this.pool as any)._freeConnections?.length || 0
    };
  }
}

// 导出单例
export default new DatabaseService();
