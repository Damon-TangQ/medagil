const BaseModel = require('../BaseModel');

class ProjectCategory extends BaseModel {
  constructor() {
    super('project_categories');
  }

  /**
   * 获取所有分类
   * @param {Object} options 查询选项
   * @returns {Promise<Array>} 分类列表
   */
  async findAll(options = {}) {
    return this.findAll({ ...options, orderBy: 'sort_order', order: 'ASC' });
  }

  /**
   * 获取顶级分类
   * @returns {Promise<Array>} 顶级分类列表
   */
  async findTopLevel() {
    return this.findAll({ where: { level: 1, status: 1 } });
  }

  /**
   * 根据父分类ID获取子分类
   * @param {String} parentId 父分类ID
   * @returns {Promise<Array>} 子分类列表
   */
  async findByParentId(parentId) {
    return this.findAll({ where: { parent_id: parentId, status: 1 } });
  }

  /**
   * 获取分类树结构
   * @returns {Promise<Array>} 分类树
   */
  async getTree() {
    const allCategories = await this.findAll({ where: { status: 1 } });
    const categoryMap = {};
    const rootCategories = [];

    // 创建分类映射
    allCategories.forEach(category => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    // 构建树结构
    allCategories.forEach(category => {
      if (category.parent_id && categoryMap[category.parent_id]) {
        categoryMap[category.parent_id].children.push(categoryMap[category.id]);
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });

    return rootCategories;
  }

  /**
   * 创建分类
   * @param {Object} categoryData 分类数据
   * @returns {Promise<Object>} 创建的分类
   */
  async createCategory(categoryData) {
    return this.create(categoryData);
  }

  /**
   * 更新分类
   * @param {String} categoryId 分类ID
   * @param {Object} categoryData 分类数据
   * @returns {Promise<Object>} 更新后的分类
   */
  async updateCategory(categoryId, categoryData) {
    return this.update(categoryId, categoryData);
  }

  /**
   * 删除分类
   * @param {String} categoryId 分类ID
   * @returns {Promise<Boolean>} 删除结果
   */
  async deleteCategory(categoryId) {
    // 检查是否有子分类
    const children = await this.findByParentId(categoryId);
    if (children.length > 0) {
      throw new Error('该分类下有子分类，无法删除');
    }

    return this.delete(categoryId);
  }
}

module.exports = new ProjectCategory();
