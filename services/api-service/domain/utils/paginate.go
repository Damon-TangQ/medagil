// Package utils 提供通用工具函数
//
// 分页工具说明：
// 本包提供分页相关的辅助函数和常量定义
//
// 架构原则：
// - 分页逻辑应该位于domain层或数据库层
// - adapters层不应包含跨层调用的分页逻辑
// - use_cases层通过仓储接口调用分页功能
//
// 分页实现方式：
// 1. 数据库分页（推荐）：
//   - 使用GORM的Offset().Limit()实现
//   - 在数据库层面完成分页
//   - 优点：内存占用低，性能稳定
//   - 适用场景：大数据量（10万+条）
//
// 2. 内存分页（不推荐）：
//   - 先查询所有数据到内存
//   - 在内存中进行切片分页
//   - 缺点：内存占用高，大数据量时性能差
//   - 适用场景：小数据量，特殊需求
//
// 性能对比：
// 数据库分页 vs 内存分页：
// - 内存占用：低 vs 高
// - 响应时间：稳定 vs 随数据量增长
// - 并发性能：好 vs 差
// - 扩展性：强 vs 弱
package utils

import "fmt"

// ========================================
// 分页常量定义
// ========================================

const (
	// DefaultPageSize 默认每页条数
	// 说明：当客户端未指定pageSize时使用的默认值
	// 推荐值：20，平衡用户体验和性能
	DefaultPageSize = 20

	// MaxPageSize 最大每页条数
	// 说明：限制单次查询返回的最大数据量
	// 推荐值：100，防止客户端请求过多数据
	MaxPageSize = 100

	// MinPageSize 最小每页条数
	// 说明：限制单次查询返回的最小数据量
	// 推荐值：1，允许客户端请求数据
	MinPageSize = 1
)

// ========================================
// 分页参数结构
// ========================================

// PaginationParams 分页请求参数
//
// 用途：
// - 封装分页请求参数
// - 提供参数验证
// - 统一分页参数格式
//
// 使用场景：
// - API请求参数解析
// - 分页参数验证
// - 传递给仓储层
//
// 使用示例：
// params := utils.NewPaginationParams(1, 20)
// if err := params.Validate(); err != nil {
//     return nil, 0, err
// }
type PaginationParams struct {
	// Page 页码
	// 说明：从1开始的页码
	// 验证：必须 >= 1
	Page int

	// PageSize 每页条数
	// 说明：每页返回的数据条数
	// 验证：必须在MinPageSize和MaxPageSize之间
	PageSize int
}

// NewPaginationParams 创建分页参数实例
//
// 参数：
//   page: 页码，从1开始
//   pageSize: 每页条数
//
// 返回：
//   *PaginationParams: 分页参数实例
//
// 说明：
// - 自动将page设置为最小值1
// - 自动将pageSize设置为默认值
func NewPaginationParams(page, pageSize int) *PaginationParams {
	if page < 1 {
		page = 1
	}
	if pageSize < MinPageSize {
		pageSize = DefaultPageSize
	}
	if pageSize > MaxPageSize {
		pageSize = MaxPageSize
	}

	return &PaginationParams{
		Page:     page,
		PageSize: pageSize,
	}
}

// Validate 验证分页参数
//
// 返回：
//   error: 参数验证失败时返回错误
//
// 说明：
// - 检查Page是否 >= 1
// - 检查PageSize是否在有效范围内
func (p *PaginationParams) Validate() error {
	if p.Page < 1 {
		return fmt.Errorf("page must be >= 1")
	}
	if p.PageSize < MinPageSize || p.PageSize > MaxPageSize {
		return fmt.Errorf("pageSize must be between %d and %d", MinPageSize, MaxPageSize)
	}
	return nil
}

// GetOffset 计算偏移量
//
// 返回：
//   int: 数据库查询的偏移量
//
// 说明：
// - 用于GORM的Offset()方法
// - 公式：(page - 1) * pageSize
func (p *PaginationParams) GetOffset() int {
	return (p.Page - 1) * p.PageSize
}

// ========================================
// 分页结果结构
// ========================================

// PaginationResult 分页结果
//
// 用途：
// - 封装分页查询结果
// - 提供分页元数据
// - 统一分页响应格式
//
// 使用场景：
// - API响应数据封装
// - 前端分页组件数据源
// - 分页信息展示
type PaginationResult struct {
	// Total 总记录数
	// 说明：符合查询条件的总记录数
	Total int64

	// Page 当前页码
	// 说明：当前返回的页码
	Page int

	// PageSize 每页条数
	// 说明：每页返回的数据条数
	PageSize int

	// TotalPages 总页数
	// 说明：根据总记录数和每页条数计算的总页数
	TotalPages int

	// HasMore 是否有更多页
	// 说明：当前页是否不是最后一页
	HasMore bool
}

// NewPaginationResult 创建分页结果实例
//
// 参数：
//   total: 总记录数
//   page: 当前页码
//   pageSize: 每页条数
//
// 返回：
//   *PaginationResult: 分页结果实例
//
// 说明：
// - 自动计算总页数
// - 自动判断是否有更多页
func NewPaginationResult(total int64, page, pageSize int) *PaginationResult {
	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	hasMore := page < totalPages

	return &PaginationResult{
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
		HasMore:    hasMore,
	}
}

// ========================================
// 分页辅助函数
// ========================================

// CalculateOffset 计算偏移量
//
// 参数：
//   page: 页码
//   pageSize: 每页条数
//
// 返回：
//   int: 数据库查询的偏移量
//
// 说明：
// - 用于GORM的Offset()方法
// - 公式：(page - 1) * pageSize
// - 示例：page=2, pageSize=20 => offset=20
func CalculateOffset(page, pageSize int) int {
	if page < 1 {
		page = 1
	}
	return (page - 1) * pageSize
}

// CalculateTotalPages 计算总页数
//
// 参数：
//   total: 总记录数
//   pageSize: 每页条数
//
// 返回：
//   int: 总页数
//
// 说明：
// - 公式：ceil(total / pageSize)
// - 示例：total=100, pageSize=20 => totalPages=5
func CalculateTotalPages(total int64, pageSize int) int {
	if pageSize <= 0 {
		return 0
	}
	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}
	return totalPages
}

// ========================================
// 注意事项
// ========================================
//
// 1. 分页逻辑位置：
//    - 应该位于domain层（本文件）或数据库层（repositories）
//    - adapters层不应包含跨层调用的分页逻辑
//    - use_cases层通过仓储接口调用分页功能
//
// 2. 分页实现方式：
//    - 推荐使用数据库分页（GORM的Offset().Limit()）
//    - 避免使用内存分页（先查全部再切片）
//    - 大数据量场景（10万+条）必须使用数据库分页
//
// 3. 性能优化：
//    - 为排序字段创建索引
//    - 限制最大每页条数
//    - 避免查询过多字段
//    - 使用COUNT(1)代替COUNT(*)
//
// 4. 错误处理：
//    - 验证分页参数
//    - 处理边界条件
//    - 返回友好的错误信息
