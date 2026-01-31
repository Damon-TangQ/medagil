const BaseModel = require('../BaseModel');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  /**
   * 根据用户名查找用户
   * @param {String} username 用户名
   * @returns {Promise<Object>} 用户信息
   */
  async findByUsername(username) {
    return this.findOne({ username });
  }

  /**
   * 根据手机号查找用户
   * @param {String} phone 手机号
   * @returns {Promise<Object>} 用户信息
   */
  async findByPhone(phone) {
    return this.findOne({ phone });
  }

  /**
   * 根据微信OpenID查找用户
   * @param {String} openId 微信OpenID
   * @returns {Promise<Object>} 用户信息
   */
  async findByWechatOpenId(openId) {
    return this.findOne({ wechat_openid: openId });
  }

  /**
   * 创建新用户
   * @param {Object} userData 用户数据
   * @returns {Promise<Object>} 创建的用户
   */
  async createUser(userData) {
    return this.create(userData);
  }

  /**
   * 更新用户订阅信息
   * @param {String} userId 用户ID
   * @param {Number} level 订阅等级
   * @param {Date} expireTime 订阅到期时间
   * @returns {Promise<Object>} 更新后的用户
   */
  async updateSubscription(userId, level, expireTime) {
    return this.update(userId, {
      subscription_level: level,
      subscription_expire_time: expireTime
    });
  }

  /**
   * 更新最后登录信息
   * @param {String} userId 用户ID
   * @param {String} ip 登录IP
   * @returns {Promise<Object>} 更新后的用户
   */
  async updateLastLogin(userId, ip) {
    return this.update(userId, {
      last_login_time: new Date(),
      last_login_ip: ip
    });
  }

  /**
   * 检查用户订阅是否有效
   * @param {String} userId 用户ID
   * @returns {Promise<Boolean>} 订阅是否有效
   */
  async isSubscriptionValid(userId) {
    const user = await this.findById(userId);
    if (!user) return false;

    // 免费用户
    if (user.subscription_level === 0) return true;

    // 检查订阅是否过期
    if (user.subscription_expire_time) {
      return new Date(user.subscription_expire_time) > new Date();
    }

    return false;
  }
}

module.exports = new User();
