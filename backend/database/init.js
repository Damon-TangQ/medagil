const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function initDatabase() {
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功');

    // 读取SQL文件
    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // 执行SQL语句
    await connection.query(sql);
    console.log('数据库初始化成功');

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('数据库初始化失败:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// 执行初始化
initDatabase();
