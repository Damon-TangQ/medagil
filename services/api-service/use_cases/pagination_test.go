package usecases

import (
	"reflect"
	"testing"
)

func paginate(data []interface{}, page, pageSize int) ([]interface{}, int, int, int) {
	total := len(data)
	
	// Handle invalid parameters
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	
	start := (page - 1) * pageSize
	end := start + pageSize
	
	if start >= total {
		return []interface{}{}, total, page, pageSize
	}
	if end > total {
		end = total
	}
	
	return data[start:end], total, page, pageSize
}

// TestPaginateNormal 测试正常分页情况
func TestPaginateNormal(t *testing.T) {
	data := []interface{}{"a", "b", "c", "d", "e"}
	result, total, page, pageSize := paginate(data, 1, 2)

	expected := []interface{}{"a", "b"}
	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected %v, got %v", expected, result)
	}
	if total != 5 {
		t.Errorf("Expected total 5, got %d", total)
	}
	if page != 1 {
		t.Errorf("Expected page 1, got %d", page)
	}
	if pageSize != 2 {
		t.Errorf("Expected pageSize 2, got %d", pageSize)
	}
}

// TestPaginateBoundary 测试边界分页情况
func TestPaginateBoundary(t *testing.T) {
	data := []interface{}{"a", "b", "c"}
	result, total, page, pageSize := paginate(data, 2, 2)

	expected := []interface{}{"c"}
	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected %v, got %v", expected, result)
	}
	if total != 3 {
		t.Errorf("Expected total 3, got %d", total)
	}
	if page != 2 {
		t.Errorf("Expected page 2, got %d", page)
	}
	if pageSize != 2 {
		t.Errorf("Expected pageSize 2, got %d", pageSize)
	}
}

// TestPaginateInvalidParams 测试异常参数情况
func TestPaginateInvalidParams(t *testing.T) {
	data := []interface{}{"a", "b", "c"}
	result, total, page, pageSize := paginate(data, 0, 0)

	if len(result) != 3 {
		t.Errorf("Expected length 3, got %d", len(result))
	}
	if total != 3 {
		t.Errorf("Expected total 3, got %d", total)
	}
	if page != 1 {
		t.Errorf("Expected page 1, got %d", page)
	}
	if pageSize != 10 {
		t.Errorf("Expected pageSize 10, got %d", pageSize)
	}
}