const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medagil_platform',
  multipleStatements: true
};

async function runMigrations() {
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功');

    // 检查迁移表是否存在
    const [tables] = await connection.query("SHOW TABLES LIKE 'migrations'");
    if (tables.length === 0) {
      console.log('迁移表不存在，将创建数据库和表');
      // 如果迁移表不存在，先运行初始迁移
      const initialMigrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
      const initialSql = fs.readFileSync(initialMigrationPath, 'utf8');
      await connection.query(initialSql);
      console.log('初始迁移执行完成');
      return;
    }

    // 获取已执行的迁移
    const [executedMigrations] = await connection.query('SELECT name FROM migrations ORDER BY id');
    const executedNames = executedMigrations.map(m => m.name);

    // 获取所有迁移文件
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // 执行未执行的迁移
    for (const file of migrationFiles) {
      const migrationName = path.basename(file, '.sql');

      if (executedNames.includes(migrationName)) {
        console.log(`迁移 ${migrationName} 已执行，跳过`);
        continue;
      }

      console.log(`执行迁移 ${migrationName}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await connection.query(sql);

      // 记录迁移
      await connection.query('INSERT INTO migrations (name) VALUES (?)', [migrationName]);
      console.log(`迁移 ${migrationName} 执行完成`);
    }

    console.log('所有迁移执行完成');
  } catch (error) {
    console.error('迁移执行失败:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 如果直接运行此文件，则执行迁移
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = runMigrations;
