const BaseModel = require('../BaseModel');

class SubscriptionRecord extends BaseModel {
  constructor() {
    super('subscription_records');
  }

  /**
   * 根据用户ID获取订阅记录
   * @param {String} userId 用户ID
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 订阅记录列表
   */
  async findByUserId(userId, options = {}) {
    return this.paginate({ ...options, where: { user_id: userId } });
  }

  /**
   * 获取用户当前有效的订阅
   * @param {String} userId 用户ID
   * @returns {Promise<Object>} 有效的订阅记录
   */
  async findActiveByUserId(userId) {
    const now = new Date();
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE user_id = ? 
      AND payment_status = 1 
      AND end_time > ?
      ORDER BY end_time DESC 
      LIMIT 1
    `;

    const [rows] = await this.pool.execute(query, [userId, now]);
    return rows[0];
  }

  /**
   * 创建订阅记录
   * @param {Object} recordData 订阅记录数据
   * @returns {Promise<Object>} 创建的订阅记录
   */
  async createRecord(recordData) {
    return this.create(recordData);
  }

  /**
   * 更新订阅记录支付状态
   * @param {String} recordId 记录ID
   * @param {Number} status 支付状态
   * @returns {Promise<Object>} 更新后的订阅记录
   */
  async updatePaymentStatus(recordId, status) {
    return this.update(recordId, { payment_status: status });
  }

  /**
   * 检查用户是否有有效的订阅
   * @param {String} userId 用户ID
   * @returns {Promise<Boolean>} 是否有有效订阅
   */
  async hasActiveSubscription(userId) {
    const activeSubscription = await this.findActiveByUserId(userId);
    return !!activeSubscription;
  }

  /**
   * 获取用户订阅历史
   * @param {String} userId 用户ID
   * @param {Number} limit 限制数量
   * @returns {Promise<Array>} 订阅历史
   */
  async getSubscriptionHistory(userId, limit = 10) {
    const query = `
      SELECT sr.*, s.name as subscription_name, s.level as subscription_level
      FROM ${this.tableName} sr
      LEFT JOIN subscriptions s ON sr.subscription_id = s.id
      WHERE sr.user_id = ?
      ORDER BY sr.created_at DESC
      LIMIT ?
    `;

    const [rows] = await this.pool.execute(query, [userId, limit]);
    return rows;
  }
}

module.exports = new SubscriptionRecord();
