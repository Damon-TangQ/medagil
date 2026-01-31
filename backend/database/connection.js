const mysql = require('mysql2/promise');
const config = require('./config');
const env = process.env.NODE_ENV || 'development';

// 创建连接池
const pool = mysql.createPool(config[env]);

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('数据库连接池创建成功');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接池创建失败:', err);
  });

module.exports = pool;
