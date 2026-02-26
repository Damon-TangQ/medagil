package usecases

import (
	"reflect"
	"testing"

	"github.com/medagil/api-service/domain/entities"
)

type mockProjectRepository struct {
	projects []entities.Project
}

func (m *mockProjectRepository) GetProjects(page, pageSize int) ([]entities.Project, int, error) {
	total := len(m.projects)
	if page < 1 || pageSize < 1 {
		return m.projects, total, nil
	}
	start := (page - 1) * pageSize
	end := start + pageSize
	if start >= total {
		return []entities.Project{}, total, nil
	}
	if end > total {
		end = total
	}
	return m.projects[start:end], total, nil
}

func (m *mockProjectRepository) Create(project *entities.Project) error {
	return nil
}

func (m *mockProjectRepository) Delete(id int64) error {
	return nil
}

func (m *mockProjectRepository) FindPaginated(page, pageSize int) ([]entities.Project, int, error) {
	return m.GetProjects(page, pageSize)
}

func (m *mockProjectRepository) Update(project *entities.Project) error {
	return nil
}

// TestProjectUseCaseGetProjectsNormal 测试正常获取项目
func TestProjectUseCaseGetProjectsNormal(t *testing.T) {
	data := []entities.Project{
		{ID: 1, Name: "Project 1"},
		{ID: 2, Name: "Project 2"},
		{ID: 3, Name: "Project 3"},
	}
	repo := &mockProjectRepository{projects: data}
	uc := NewProjectUseCase(repo)

	result, total, err := uc.GetProjects(1, 2)
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

// TestProjectUseCaseGetProjectsBoundary 测试边界获取项目
func TestProjectUseCaseGetProjectsBoundary(t *testing.T) {
	data := []entities.Project{
		{ID: 1, Name: "Project 1"},
	}
	repo := &mockProjectRepository{projects: data}
	uc := NewProjectUseCase(repo)

	result, total, err := uc.GetProjects(2, 1)
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	if len(result) != 0 {
		t.Errorf("Expected empty result, got %v", result)
	}
	if total != 1 {
		t.Errorf("Expected total 1, got %d", total)
	}
}

// TestProjectUseCaseGetProjectsInvalidParams 测试异常参数获取项目
func TestProjectUseCaseGetProjectsInvalidParams(t *testing.T) {
	data := []entities.Project{
		{ID: 1, Name: "Project 1"},
		{ID: 2, Name: "Project 2"},
	}
	repo := &mockProjectRepository{projects: data}
	uc := NewProjectUseCase(repo)

	result, total, err := uc.GetProjects(0, 0)
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	if len(result) != 2 {
		t.Errorf("Expected 2 results, got %d", len(result))
	}
	if total != 2 {
		t.Errorf("Expected total 2, got %d", total)
	}
}
