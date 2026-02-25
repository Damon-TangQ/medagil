// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// KnowledgeBaseRepository 定义知识库数据访问接口。
// 管理知识库的基本信息，包括创建、查询、更新、删除等操作。
type KnowledgeBaseRepository interface {
	Create(ctx context.Context, kb *entities.KnowledgeBase) error                                                                 // 创建知识库
	GetByID(ctx context.Context, id int64) (*entities.KnowledgeBase, error)                                                      // 根据ID获取知识库
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.KnowledgeBase, error)                         // 根据用户ID分页获取知识库列表
	Update(ctx context.Context, kb *entities.KnowledgeBase) error                                                                 // 更新知识库信息
	Delete(ctx context.Context, id int64) error                                                                                    // 删除知识库
}

// KnowledgeDocumentRepository 定义知识文档数据访问接口。
// 管理知识库中的文档信息，包括文档版本、分块等。
type KnowledgeDocumentRepository interface {
	Create(ctx context.Context, doc *entities.KnowledgeDocument) error                                                                 // 创建知识文档
	GetByID(ctx context.Context, id int64) (*entities.KnowledgeDocument, error)                                                        // 根据ID获取知识文档
	GetByKnowledgeBaseID(ctx context.Context, kbID int64, offset, limit int) ([]*entities.KnowledgeDocument, error)                   // 根据知识库ID分页获取文档列表
	Update(ctx context.Context, doc *entities.KnowledgeDocument) error                                                                  // 更新知识文档信息
	Delete(ctx context.Context, id int64) error                                                                                          // 删除知识文档
}

// KBTagRepository 定义知识库标签数据访问接口。
// 管理知识库文档的标签，用于分类和搜索。
type KBTagRepository interface {
	Create(ctx context.Context, tag *entities.KBTag) error                    // 创建标签
	GetByID(ctx context.Context, id int64) (*entities.KBTag, error)          // 根据ID获取标签
	Update(ctx context.Context, tag *entities.KBTag) error                    // 更新标签信息
	Delete(ctx context.Context, id int64) error                               // 删除标签
	List(ctx context.Context, offset, limit int) ([]*entities.KBTag, error)  // 分页获取标签列表
}

// KBDocumentTagRepository 定义文档标签关联数据访问接口。
// 管理知识文档与标签之间的多对多关联关系。
type KBDocumentTagRepository interface {
	Create(ctx context.Context, docTag *entities.KBDocumentTag) error                              // 创建文档标签关联
	GetByDocumentID(ctx context.Context, docID int64) ([]*entities.KBDocumentTag, error)           // 根据文档ID获取标签列表
	Delete(ctx context.Context, kbID, docID, tagID int64) error                                    // 删除文档标签关联
}