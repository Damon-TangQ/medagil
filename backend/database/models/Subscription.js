const BaseModel = require('../BaseModel');

class Subscription extends BaseModel {
  constructor() {
    super('subscriptions');
  }

  /**
   * 根据订阅等级获取订阅套餐
   * @param {Number} level 订阅等级
   * @returns {Promise<Object>} 订阅套餐
   */
  async findByLevel(level) {
    return this.findOne({ level, status: 1 });
  }

  /**
   * 获取所有有效的订阅套餐
   * @returns {Promise<Array>} 订阅套餐列表
   */
  async findAllActive() {
    return this.findAll({ where: { status: 1 }, orderBy: 'level', order: 'ASC' });
  }

  /**
   * 创建订阅记录
   * @param {Object} subscriptionData 订阅数据
   * @returns {Promise<Object>} 创建的订阅记录
   */
  async createSubscription(subscriptionData) {
    return this.create(subscriptionData);
  }

  /**
   * 更新订阅套餐
   * @param {String} subscriptionId 订阅ID
   * @param {Object} subscriptionData 订阅数据
   * @returns {Promise<Object>} 更新后的订阅套餐
   */
  async updateSubscription(subscriptionId, subscriptionData) {
    return this.update(subscriptionId, subscriptionData);
  }

  /**
   * 获取订阅套餐的功能特性
   * @param {String} subscriptionId 订阅ID
   * @returns {Promise<Object>} 功能特性
   */
  async getFeatures(subscriptionId) {
    const subscription = await this.findById(subscriptionId);
    if (!subscription || !subscription.features) {
      return {};
    }

    try {
      return typeof subscription.features === 'string' 
        ? JSON.parse(subscription.features) 
        : subscription.features;
    } catch (e) {
      return {};
    }
  }

  /**
   * 检查订阅套餐是否包含某项功能
   * @param {String} subscriptionId 订阅ID
   * @param {String} feature 功能名称
   * @returns {Promise<Boolean>} 是否包含该功能
   */
  async hasFeature(subscriptionId, feature) {
    const features = await this.getFeatures(subscriptionId);
    return features[feature] === true;
  }

  /**
   * 获取订阅套餐的限制
   * @param {String} subscriptionId 订阅ID
   * @returns {Promise<Object>} 限制信息
   */
  async getLimits(subscriptionId) {
    const subscription = await this.findById(subscriptionId);
    if (!subscription) {
      return {
        max_projects: 0,
        max_tasks_per_month: 0,
        max_ai_calls_per_month: 0
      };
    }

    return {
      max_projects: subscription.max_projects || 0,
      max_tasks_per_month: subscription.max_tasks_per_month || 0,
      max_ai_calls_per_month: subscription.max_ai_calls_per_month || 0
    };
  }
}

module.exports = new Subscription();
