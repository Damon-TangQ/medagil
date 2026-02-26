package repositories

import (
	"reflect"
	"testing"

	"github.com/medagil/api-service/domain/entities"
	"gorm.io/gorm"
)

// TestProjectRepositoryFindPaginatedNormal 测试正常分页查询
func TestProjectRepositoryFindPaginatedNormal(t *testing.T) {
	db := &gorm.DB{}
	repo := NewProjectRepository(db)

	result, total, err := repo.FindPaginated(1, 2)
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	expected := []entities.Project{
		{ID: 1, Name: "Project 1"},
		{ID: 2, Name: "Project 2"},
	}
	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected %v, got %v", expected, result)
	}
	if total != 3 {
		t.Errorf("Expected total 3, got %d", total)
	}
}

// TestProjectRepositoryFindPaginatedBoundary 测试边界分页查询
func TestProjectRepositoryFindPaginatedBoundary(t *testing.T) {
	db := &gorm.DB{}
	repo := NewProjectRepository(db)

	result, total, err := repo.FindPaginated(2, 2)
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	if len(result) != 0 {
		t.Errorf("Expected empty result, got %v", result)
	}
	if total != 2 {
		t.Errorf("Expected total 2, got %d", total)
	}
}

// TestProjectRepositoryFindPaginatedInvalidParams 测试异常参数分页查询
func TestProjectRepositoryFindPaginatedInvalidParams(t *testing.T) {
	db := &gorm.DB{}
	repo := NewProjectRepository(db)

	result, total, err := repo.FindPaginated(0, 0)
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	if len(result) != 1 {
		t.Errorf("Expected 1 result, got %d", len(result))
	}
	if total != 1 {
		t.Errorf("Expected total 1, got %d", total)
	}
}
