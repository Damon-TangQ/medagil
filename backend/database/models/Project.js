const BaseModel = require('../BaseModel');

class Project extends BaseModel {
  constructor() {
    super('projects');
  }

  /**
   * 根据用户ID获取项目列表
   * @param {String} userId 用户ID
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 项目列表
   */
  async findByUserId(userId, options = {}) {
    return this.paginate({ ...options, where: { user_id: userId } });
  }

  /**
   * 根据分类ID获取项目列表
   * @param {String} categoryId 分类ID
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 项目列表
   */
  async findByCategoryId(categoryId, options = {}) {
    return this.paginate({ ...options, where: { category_id: categoryId } });
  }

  /**
   * 创建新项目
   * @param {Object} projectData 项目数据
   * @returns {Promise<Object>} 创建的项目
   */
  async createProject(projectData) {
    return this.create(projectData);
  }

  /**
   * 更新项目
   * @param {String} projectId 项目ID
   * @param {Object} projectData 项目数据
   * @returns {Promise<Object>} 更新后的项目
   */
  async updateProject(projectId, projectData) {
    return this.update(projectId, projectData);
  }

  /**
   * 删除项目
   * @param {String} projectId 项目ID
   * @returns {Promise<Boolean>} 删除结果
   */
  async deleteProject(projectId) {
    return this.delete(projectId);
  }

  /**
   * 增加项目浏览次数
   * @param {String} projectId 项目ID
   * @returns {Promise<Object>} 更新后的项目
   */
  async incrementViewCount(projectId) {
    const query = `UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = ?`;
    await this.pool.execute(query, [projectId]);
    return this.findById(projectId);
  }

  /**
   * 增加项目点赞次数
   * @param {String} projectId 项目ID
   * @returns {Promise<Object>} 更新后的项目
   */
  async incrementLikeCount(projectId) {
    const query = `UPDATE ${this.tableName} SET like_count = like_count + 1 WHERE id = ?`;
    await this.pool.execute(query, [projectId]);
    return this.findById(projectId);
  }

  /**
   * 搜索项目
   * @param {String} keyword 搜索关键词
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 搜索结果
   */
  async search(keyword, options = {}) {
    const { page = 1, pageSize = 10, orderBy = 'created_at', order = 'DESC' } = options;
    const offset = (page - 1) * pageSize;

    const searchQuery = `%${keyword}%`;
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE name LIKE ? OR description LIKE ? OR tags LIKE ?
      ORDER BY ${orderBy} ${order}
      LIMIT ? OFFSET ?
    `;

    const [data] = await this.pool.execute(query, [searchQuery, searchQuery, searchQuery, pageSize, offset]);

    const countQuery = `
      SELECT COUNT(*) as count FROM ${this.tableName} 
      WHERE name LIKE ? OR description LIKE ? OR tags LIKE ?
    `;
    const [totalResult] = await this.pool.execute(countQuery, [searchQuery, searchQuery, searchQuery]);

    return {
      data,
      total: totalResult[0].count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalResult[0].count / pageSize)
    };
  }
}

module.exports = new Project();
