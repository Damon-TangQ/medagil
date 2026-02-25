// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// KnowledgeBase 表示数据库中 knowledge_bases 表的知识库实体。
// 记录用户创建的知识库信息，包括名称、描述、可见性等。
type KnowledgeBase struct {
	ID          int64                                  `json:"id" db:"id"`                          // 主键，自增
	UserID      int64                                  `json:"user_id" db:"user_id"`                // 用户ID，外键关联 users 表
	Name        string                                 `json:"name" db:"name"`                      // 知识库名称
	Description string                                 `json:"description" db:"description"`       // 知识库描述
	Visibility  valueobjects.KnowledgeBaseVisibility  `json:"visibility" db:"visibility"`          // 可见性（私有、公开等）
	CreatedAt   time.Time                              `json:"created_at" db:"created_at"`          // 创建时间戳
	UpdatedAt   time.Time                              `json:"updated_at" db:"updated_at"`          // 最后更新时间戳
}

// KnowledgeDocument 表示数据库中 knowledge_documents 表的知识文档实体。
// 记录知识库中的文档信息，包括分块数量、向量ID等。
type KnowledgeDocument struct {
	ID                int64     `json:"id" db:"id"`                               // 主键，自增
	KnowledgeBaseID   int64     `json:"knowledge_base_id" db:"knowledge_base_id"` // 知识库ID，外键关联 knowledge_bases 表
	FileID            int64     `json:"file_id" db:"file_id"`                     // 文件ID，外键关联 files 表
	Version           int       `json:"version" db:"version"`                     // 文档版本号
	ChunkCount        int       `json:"chunk_count" db:"chunk_count"`            // 分块数量
	ExternalVectorID  *string   `json:"external_vector_id" db:"external_vector_id"` // 外部向量数据库ID（可空）
	CreatedAt         time.Time `json:"created_at" db:"created_at"`               // 创建时间戳
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`               // 最后更新时间戳
}

// KBTag 表示数据库中 kb_tags 表的知识库标签实体。
// 定义知识库文档的标签，用于分类和搜索。
type KBTag struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增
	Name      string    `json:"name" db:"name"`           // 标签名称
	Color     string    `json:"color" db:"color"`         // 标签颜色
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// KBDocumentTag 表示数据库中 kb_document_tags 表的文档标签关联实体。
// 记录知识文档与标签之间的多对多关联关系。
type KBDocumentTag struct {
	ID                 int64     `json:"id" db:"id"`                               // 主键，自增
	KnowledgeBaseID    int64     `json:"knowledge_base_id" db:"knowledge_base_id"` // 知识库ID，外键关联 knowledge_bases 表
	DocumentID         int64     `json:"document_id" db:"document_id"`             // 文档ID，外键关联 knowledge_documents 表
	TagID              int64     `json:"tag_id" db:"tag_id"`                       // 标签ID，外键关联 kb_tags 表
	CreatedAt          time.Time `json:"created_at" db:"created_at"`               // 创建时间戳
}