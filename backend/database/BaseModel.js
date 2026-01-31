const pool = require('./connection');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * 查询所有记录
   * @param {Object} options 查询选项
   * @returns {Promise<Array>} 查询结果
   */
  async findAll(options = {}) {
    const { where = {}, orderBy = 'id', order = 'ASC', limit, offset } = options;

    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => {
        params.push(where[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY ${orderBy} ${order}`;

    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }

    const [rows] = await this.pool.execute(query, params);
    return rows;
  }

  /**
   * 根据ID查询记录
   * @param {String} id 记录ID
   * @returns {Promise<Object>} 查询结果
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [rows] = await this.pool.execute(query, [id]);
    return rows[0];
  }

  /**
   * 根据条件查询单条记录
   * @param {Object} where 查询条件
   * @returns {Promise<Object>} 查询结果
   */
  async findOne(where = {}) {
    const result = await this.findAll({ where, limit: 1 });
    return result[0];
  }

  /**
   * 创建新记录
   * @param {Object} data 记录数据
   * @returns {Promise<Object>} 创建的记录
   */
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await this.pool.execute(query, values);

    return this.findById(result.insertId);
  }

  /**
   * 更新记录
   * @param {String} id 记录ID
   * @param {Object} data 更新数据
   * @returns {Promise<Object>} 更新的记录
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    await this.pool.execute(query, [...values, id]);

    return this.findById(id);
  }

  /**
   * 删除记录
   * @param {String} id 记录ID
   * @returns {Promise<Boolean>} 删除结果
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [result] = await this.pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 统计记录数
   * @param {Object} where 查询条件
   * @returns {Promise<Number>} 记录数
   */
  async count(where = {}) {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => {
        params.push(where[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [rows] = await this.pool.execute(query, params);
    return rows[0].count;
  }

  /**
   * 分页查询
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 分页结果
   */
  async paginate(options = {}) {
    const { page = 1, pageSize = 10, where = {}, orderBy = 'id', order = 'ASC' } = options;
    const offset = (page - 1) * pageSize;

    const [data, totalResult] = await Promise.all([
      this.findAll({ where, orderBy, order, limit: pageSize, offset }),
      this.count(where)
    ]);

    return {
      data,
      total: totalResult,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalResult / pageSize)
    };
  }
}

module.exports = BaseModel;
