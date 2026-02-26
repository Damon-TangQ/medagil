// Package main 提供分页工具函数
package main

import (
	"strconv"
)

// PaginationResult 表示分页结果
type PaginationResult struct {
	Page     int
	PageSize  int
	Start     int
	End       int
	Total     int
	HasNext   bool
	HasPrev   bool
}

// ParsePagination 解析分页参数并计算边界
func ParsePagination(pageStr, pageSizeStr string, defaultPageSize int, totalItems int) *PaginationResult {
	// 解析页码
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	// 解析每页大小
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = defaultPageSize
	}

	// 计算起始位置
	start := (page - 1) * pageSize
	if start < 0 {
		start = 0
	}

	// 计算结束位置，确保不超过总数
	end := start + pageSize
	if end > totalItems {
		end = totalItems
	}

	// 如果起始位置超过总数，调整起始位置
	if start > totalItems {
		start = totalItems
	}

	return &PaginationResult{
		Page:     page,
		PageSize:  pageSize,
		Start:     start,
		End:       end,
		Total:     totalItems,
		HasNext:   end < totalItems,
		HasPrev:   page > 1,
	}
}
