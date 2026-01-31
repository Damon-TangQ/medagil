const BaseModel = require('../BaseModel');

class Task extends BaseModel {
  constructor() {
    super('tasks');
  }

  /**
   * 根据用户ID获取任务列表
   * @param {String} userId 用户ID
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 任务列表
   */
  async findByUserId(userId, options = {}) {
    return this.paginate({ ...options, where: { user_id: userId } });
  }

  /**
   * 根据项目ID获取任务列表
   * @param {String} projectId 项目ID
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 任务列表
   */
  async findByProjectId(projectId, options = {}) {
    return this.paginate({ ...options, where: { project_id: projectId } });
  }

  /**
   * 创建新任务
   * @param {Object} taskData 任务数据
   * @returns {Promise<Object>} 创建的任务
   */
  async createTask(taskData) {
    return this.create(taskData);
  }

  /**
   * 更新任务
   * @param {String} taskId 任务ID
   * @param {Object} taskData 任务数据
   * @returns {Promise<Object>} 更新后的任务
   */
  async updateTask(taskId, taskData) {
    return this.update(taskId, taskData);
  }

  /**
   * 更新任务状态
   * @param {String} taskId 任务ID
   * @param {Number} status 任务状态
   * @returns {Promise<Object>} 更新后的任务
   */
  async updateStatus(taskId, status) {
    return this.update(taskId, { status });
  }

  /**
   * 添加对话记录
   * @param {String} taskId 任务ID
   * @param {Object} message 消息内容
   * @returns {Promise<Object>} 更新后的任务
   */
  async addConversation(taskId, message) {
    const task = await this.findById(taskId);
    let conversation = [];

    if (task.conversation_history) {
      try {
        conversation = typeof task.conversation_history === 'string' 
          ? JSON.parse(task.conversation_history) 
          : task.conversation_history;
      } catch (e) {
        conversation = [];
      }
    }

    conversation.push(message);

    return this.update(taskId, { 
      conversation_history: JSON.stringify(conversation) 
    });
  }

  /**
   * 获取对话历史
   * @param {String} taskId 任务ID
   * @returns {Promise<Array>} 对话历史
   */
  async getConversation(taskId) {
    const task = await this.findById(taskId);
    if (!task || !task.conversation_history) {
      return [];
    }

    try {
      return typeof task.conversation_history === 'string' 
        ? JSON.parse(task.conversation_history) 
        : task.conversation_history;
    } catch (e) {
      return [];
    }
  }

  /**
   * 更新任务结果
   * @param {String} taskId 任务ID
   * @param {String} result 任务结果
   * @returns {Promise<Object>} 更新后的任务
   */
  async updateResult(taskId, result) {
    return this.update(taskId, { result });
  }

  /**
   * 标记任务为完成
   * @param {String} taskId 任务ID
   * @param {String} result 任务结果
   * @returns {Promise<Object>} 更新后的任务
   */
  async markAsCompleted(taskId, result) {
    return this.update(taskId, { 
      status: 1,
      result 
    });
  }

  /**
   * 标记任务为失败
   * @param {String} taskId 任务ID
   * @param {String} result 失败原因
   * @returns {Promise<Object>} 更新后的任务
   */
  async markAsFailed(taskId, result) {
    return this.update(taskId, { 
      status: 2,
      result 
    });
  }
}

module.exports = new Task();
