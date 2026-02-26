// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// KnowledgeBase 表示数据库中 knowledge_bases 表的知识库实体。
// 
// 用途：记录用户创建的知识库信息，包括名称、描述、可见性等，是知识库管理的核心实体。
// 
// 数据库表：knowledge_bases
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识知识库
//   - UserID: 用户ID，外键关联users表，表示知识库的创建者
//   - Name: 知识库名称，用户自定义
//   - Description: 知识库描述，详细说明知识库的内容和用途
//   - Visibility: 可见性，private表示私有，public表示公开
//   - CreatedAt: 知识库创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 知识库管理
//   - 知识库检索
//   - 知识库共享
//   - AI知识问答
type KnowledgeBase struct {
	ID          int64                                  `json:"id" db:"id"`                          // 主键，自增，唯一标识知识库
	UserID      int64                                  `json:"user_id" db:"user_id"`                // 用户ID，外键关联users表，表示知识库的创建者
	Name        string                                 `json:"name" db:"name"`                      // 知识库名称，用户自定义
	Description string                                 `json:"description" db:"description"`       // 知识库描述，详细说明知识库的内容和用途
	Visibility  valueobjects.KnowledgeBaseVisibility  `json:"visibility" db:"visibility"`          // 可见性，private表示私有，public表示公开
	CreatedAt   time.Time                              `json:"created_at" db:"created_at"`          // 知识库创建时间，UTC时间戳
	UpdatedAt   time.Time                              `json:"updated_at" db:"updated_at"`          // 最后更新时间，UTC时间戳
}

// KnowledgeDocument 表示数据库中 knowledge_documents 表的知识文档实体。
// 
// 用途：记录知识库中的文档信息，包括分块数量、向量ID等，支持向量检索和知识管理。
// 
// 数据库表：knowledge_documents
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识知识文档
//   - KnowledgeBaseID: 知识库ID，外键关联knowledge_bases表
//   - FileID: 文件ID，外键关联files表
//   - Version: 文档版本号，用于文档版本管理
//   - ChunkCount: 分块数量，表示文档被分割成的文本块数量
//   - ExternalVectorID: 外部向量数据库ID，可为空，用于关联向量数据库（如Milvus、Zilliz等）
//   - CreatedAt: 文档创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 文档上传
//   - 文档分块
//   - 向量检索
//   - 文档版本管理
type KnowledgeDocument struct {
	ID                int64     `json:"id" db:"id"`                               // 主键，自增，唯一标识知识文档
	KnowledgeBaseID   int64     `json:"knowledge_base_id" db:"knowledge_base_id"` // 知识库ID，外键关联knowledge_bases表
	FileID            int64     `json:"file_id" db:"file_id"`                     // 文件ID，外键关联files表
	Version           int       `json:"version" db:"version"`                     // 文档版本号，用于文档版本管理
	ChunkCount        int       `json:"chunk_count" db:"chunk_count"`            // 分块数量，表示文档被分割成的文本块数量
	ExternalVectorID  *string   `json:"external_vector_id" db:"external_vector_id"` // 外部向量数据库ID，可为空，用于关联向量数据库（如Milvus、Zilliz等）
	CreatedAt         time.Time `json:"created_at" db:"created_at"`               // 文档创建时间，UTC时间戳
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`               // 最后更新时间，UTC时间戳
}

// KBTag 表示数据库中 kb_tags 表的知识库标签实体。
// 
// 用途：定义知识库文档的标签，用于分类和搜索，支持知识库文档的组织和检索。
// 
// 数据库表：kb_tags
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识标签
//   - Name: 标签名称，如"临床指南"、"研究论文"等
//   - Color: 标签颜色，用于前端展示，十六进制颜色值
//   - CreatedAt: 标签创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 标签管理
//   - 文档分类
//   - 文档检索
//   - 标签统计
type KBTag struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增，唯一标识标签
	Name      string    `json:"name" db:"name"`           // 标签名称，如"临床指南"、"研究论文"等
	Color     string    `json:"color" db:"color"`         // 标签颜色，用于前端展示，十六进制颜色值
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 标签创建时间，UTC时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// KBDocumentTag 表示数据库中 kb_document_tags 表的文档标签关联实体。
// 
// 用途：记录知识文档与标签之间的多对多关联关系，实现灵活的文档标签管理。
// 
// 数据库表：kb_document_tags
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识文档标签关系
//   - KnowledgeBaseID: 知识库ID，外键关联knowledge_bases表
//   - DocumentID: 文档ID，外键关联knowledge_documents表
//   - TagID: 标签ID，外键关联kb_tags表
//   - CreatedAt: 关系创建时间，UTC时间戳
// 
// 使用场景：
//   - 为文档分配标签
//   - 查询文档的所有标签
//   - 标签统计
//   - 文档检索
type KBDocumentTag struct {
	ID                 int64     `json:"id" db:"id"`                               // 主键，自增，唯一标识文档标签关系
	KnowledgeBaseID    int64     `json:"knowledge_base_id" db:"knowledge_base_id"` // 知识库ID，外键关联knowledge_bases表
	DocumentID         int64     `json:"document_id" db:"document_id"`             // 文档ID，外键关联knowledge_documents表
	TagID              int64     `json:"tag_id" db:"tag_id"`                       // 标签ID，外键关联kb_tags表
	CreatedAt          time.Time `json:"created_at" db:"created_at"`               // 关系创建时间，UTC时间戳
}