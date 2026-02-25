package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// UserProfile 描述了前端在「个人中心」和管理端「用户列表」中需要展示的基础用户信息。
// 字段设计与 OpenAPI 规范中 components.schemas.UserProfile 保持一致，便于前后端共享模型。
type UserProfile struct {
	ID       string  `json:"id"`
	Email    *string `json:"email,omitempty"`
	Nickname *string `json:"nickname,omitempty"`
	Avatar   *string `json:"avatar,omitempty"`
	Plan     string  `json:"plan"`            // free | pro | max
	Credits  *int64  `json:"credits,omitempty"` // 当前积分（可为空）
}

// ProjectSummary 与 ProjectListResponse 对应 Web 用户端「项目管理」列表视图的数据结构。
type ProjectSummary struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

type ProjectListResponse struct {
	Items []ProjectSummary `json:"items"`
	Total int              `json:"total"`
}

// DashboardStats 对应管理端数据看板的核心统计指标。
type DashboardStats struct {
	TotalUsers  int     `json:"totalUsers"`
	TotalOrders int     `json:"totalOrders"`
	MRR         float64 `json:"mrr"` // Monthly Recurring Revenue
}

type AdminUserListResponse struct {
	Items []UserProfile `json:"items"`
	Total int           `json:"total"`
}

// Task 与 TaskListResponse/TaskDetail 对应 OpenAPI 中的任务结构，供管理端任务列表与详情使用。
type Task struct {
	ID        string    `json:"id"`
	ProjectID *string   `json:"projectId,omitempty"`
	AgentKey  string    `json:"agentKey"`
	Status    string    `json:"status"` // pending | running | succeeded | failed
	CreatedAt time.Time `json:"createdAt"`
}

type TaskListResponse struct {
	Items []Task `json:"items"`
	Total int    `json:"total"`
}

type TaskDetail struct {
	ID            string    `json:"id"`
	ProjectID     *string   `json:"projectId,omitempty"`
	AgentKey      string    `json:"agentKey"`
	Status        string    `json:"status"`
	InputText     *string   `json:"inputText,omitempty"`
	FileIDs       []string  `json:"fileIds"`
	ResultPreview *string   `json:"resultPreview,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
}

// AdminOrder 与 AdminOrderListResponse 对应 OpenAPI 中的订单结构，供管理端订单列表与详情使用。
type AdminOrder struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId"`
	PlanID      string    `json:"planId"`
	Status      string    `json:"status"`
	AmountCents int64     `json:"amountCents"`
	CreatedAt   time.Time `json:"createdAt"`
}

type AdminOrderListResponse struct {
	Items []AdminOrder `json:"items"`
	Total int          `json:"total"`
}

// KnowledgeSource 与 KnowledgeSourceListResponse 对应 OpenAPI 中的知识源结构。
type KnowledgeSource struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

type KnowledgeSourceListResponse struct {
	Items []KnowledgeSource `json:"items"`
	Total int               `json:"total"`
}

// 为了快速跑通 MVP-A 阶段的端到端闭环，这里使用内存中的 Demo 数据。
// 后续接入 PostgreSQL / MongoDB 时，只需要在保持结构不变的前提下替换掉数据来源即可。
var (
	demoUserEmail = "demo-doctor@medagil.local"
	demoUserName  = "示例医生"
	demoUserPlan  = "free"
	demoCredits   = int64(1000)

	demoUser = UserProfile{
		ID:       "user_demo",
		Email:    &demoUserEmail,
		Nickname: &demoUserName,
		Avatar:   nil,
		Plan:     demoUserPlan,
		Credits:  &demoCredits,
	}

	demoProjects = []ProjectSummary{
		{
			ID:        "proj_001",
			Name:      "临床论著 · 示例项目",
			CreatedAt: time.Now().AddDate(0, 0, -7),
		},
		{
			ID:        "proj_002",
			Name:      "博士课题 · 示例项目",
			CreatedAt: time.Now().AddDate(0, 0, -3),
		},
	}

	demoTasks = []Task{
		{
			ID:        "task_001",
			ProjectID: &demoProjects[0].ID,
			AgentKey:  "paper-outline",
			Status:    "succeeded",
			CreatedAt: time.Now().Add(-2 * time.Hour),
		},
		{
			ID:        "task_002",
			ProjectID: &demoProjects[1].ID,
			AgentKey:  "paper-polish",
			Status:    "running",
			CreatedAt: time.Now().Add(-30 * time.Minute),
		},
	}

	demoOrders = []AdminOrder{
		{
			ID:          "order_001",
			UserID:      demoUser.ID,
			PlanID:      "plan_pro",
			Status:      "paid",
			AmountCents: 19900,
			CreatedAt:   time.Now().AddDate(0, 0, -1),
		},
	}

	demoKnowledgeSources = []KnowledgeSource{
		{
			ID:        "ks_001",
			Name:      "肿瘤学临床指南示例",
			Type:      "pdf",
			Status:    "ready",
			CreatedAt: time.Now().AddDate(0, 0, -5),
		},
		{
			ID:        "ks_002",
			Name:      "SCI 论文写作模版",
			Type:      "markdown",
			Status:    "ready",
			CreatedAt: time.Now().AddDate(0, 0, -2),
		},
	}
)

// userAuthMiddleware 是 MVP-A 阶段的极简鉴权实现：
// - 仅校验是否携带 Bearer Token（不校验具体 token 内容）
// - 通过 context 记录当前用户 ID，便于后续替换为真实用户体系
// 这样设计的好处是：可以先让前后端端到端跑通，后续接入微信/手机号登录时只需替换中间件实现。
func userAuthMiddleware(c *gin.Context) {
	auth := c.GetHeader("Authorization")
	if auth == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "missing Authorization header, please set demo token in client",
		})
		return
	}

	// 在 MVP-A 阶段，我们不解析 token，仅作为「是否登录」的开关使用。
	// 后续可以改为解析 JWT 或从 Redis 中加载会话信息。
	c.Set("userID", demoUser.ID)
	c.Next()
}

// adminAuthMiddleware 与 userAuthMiddleware 类似，用于保护管理端接口。
// 后续可扩展为 RBAC：根据管理员角色控制可访问的模块与操作范围。
func adminAuthMiddleware(c *gin.Context) {
	auth := c.GetHeader("Authorization")
	if auth == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "missing Authorization header, please set admin demo token in client",
		})
		return
	}

	c.Set("adminID", "admin_demo")
	c.Next()
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())

	// Health check：供 APISIX、Kubernetes 或运维监控探活使用。
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// ---------- 用户端 API：/api/v1/* ----------
	// 调用方：apps/web、apps/miniapp
	v1 := r.Group("/api/v1")
	{
		// 无需登录的简单心跳接口，便于前端/监控快速验证 API 可用性。
		v1.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})

		// 需要登录态的接口统一挂载到带鉴权的子分组，后续替换鉴权实现时改动集中。
		authGroup := v1.Group("")
		authGroup.Use(userAuthMiddleware)

		// GET /api/v1/me
		// 返回当前用户的基础信息，用于 Web/小程序端「个人中心」与顶部状态栏。
		authGroup.GET("/me", func(c *gin.Context) {
			c.JSON(http.StatusOK, demoUser)
		})

		// GET /api/v1/projects
		// 返回当前用户的项目列表，支持 page 与 pageSize 分页参数。
		authGroup.GET("/projects", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, err := strconv.Atoi(pageStr)
			if err != nil || page < 1 {
				page = 1
			}
			pageSize, err := strconv.Atoi(pageSizeStr)
			if err != nil || pageSize < 1 {
				pageSize = 20
			}

			start := (page - 1) * pageSize
			if start > len(demoProjects) {
				start = len(demoProjects)
			}
			end := start + pageSize
			if end > len(demoProjects) {
				end = len(demoProjects)
			}

			resp := ProjectListResponse{
				Items: demoProjects[start:end],
				Total: len(demoProjects),
			}
			c.JSON(http.StatusOK, resp)
		})
	}

	// ---------- 管理端 API：/api/v1/admin/* ----------
	// 调用方：apps/admin
	admin := r.Group("/api/v1/admin")
	{
		// 管理端心跳接口，便于验证管理端路由是否正确配置到网关。
		admin.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "admin pong"})
		})

		adminAuthGroup := admin.Group("")
		adminAuthGroup.Use(adminAuthMiddleware)

		// GET /api/v1/admin/dashboard/stats
		// 返回管理端数据看板的核心指标。
		adminAuthGroup.GET("/dashboard/stats", func(c *gin.Context) {
			stats := DashboardStats{
				TotalUsers:  1,
				TotalOrders: 0,
				MRR:         0,
			}
			c.JSON(http.StatusOK, stats)
		})

		// GET /api/v1/admin/users
		// 返回平台用户列表（MVP-A 阶段仅返回 Demo 用户）。
		adminAuthGroup.GET("/users", func(c *gin.Context) {
			resp := AdminUserListResponse{
				Items: []UserProfile{demoUser},
				Total: 1,
			}
			c.JSON(http.StatusOK, resp)
		})

		// GET /api/v1/admin/tasks
		// 返回全平台任务列表（MVP-A 阶段为 Demo 数据）。
		adminAuthGroup.GET("/tasks", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, err := strconv.Atoi(pageStr)
			if err != nil || page < 1 {
				page = 1
			}
			pageSize, err := strconv.Atoi(pageSizeStr)
			if err != nil || pageSize < 1 {
				pageSize = 20
			}

			start := (page - 1) * pageSize
			if start > len(demoTasks) {
				start = len(demoTasks)
			}
			end := start + pageSize
			if end > len(demoTasks) {
				end = len(demoTasks)
			}

			resp := TaskListResponse{
				Items: demoTasks[start:end],
				Total: len(demoTasks),
			}
			c.JSON(http.StatusOK, resp)
		})

		// GET /api/v1/admin/tasks/:taskId
		// 返回指定任务详情（MVP-A 阶段返回与列表相同的基础信息）。
		adminAuthGroup.GET("/tasks/:taskId", func(c *gin.Context) {
			taskID := c.Param("taskId")
			for _, t := range demoTasks {
				if t.ID == taskID {
					input := "示例任务输入内容"
					result := "示例任务输出摘要"
					detail := TaskDetail{
						ID:            t.ID,
						ProjectID:     t.ProjectID,
						AgentKey:      t.AgentKey,
						Status:        t.Status,
						InputText:     &input,
						FileIDs:       []string{},
						ResultPreview: &result,
						CreatedAt:     t.CreatedAt,
					}
					c.JSON(http.StatusOK, detail)
					return
				}
			}
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": "task not found",
			})
		})

		// GET /api/v1/admin/orders
		// 返回订单列表（MVP-A 阶段为 Demo 数据）。
		adminAuthGroup.GET("/orders", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, err := strconv.Atoi(pageStr)
			if err != nil || page < 1 {
				page = 1
			}
			pageSize, err := strconv.Atoi(pageSizeStr)
			if err != nil || pageSize < 1 {
				pageSize = 20
			}

			start := (page - 1) * pageSize
			if start > len(demoOrders) {
				start = len(demoOrders)
			}
			end := start + pageSize
			if end > len(demoOrders) {
				end = len(demoOrders)
			}

			resp := AdminOrderListResponse{
				Items: demoOrders[start:end],
				Total: len(demoOrders),
			}
			c.JSON(http.StatusOK, resp)
		})

		// GET /api/v1/admin/orders/:orderId
		// 返回订单详情。
		adminAuthGroup.GET("/orders/:orderId", func(c *gin.Context) {
			orderID := c.Param("orderId")
			for _, o := range demoOrders {
				if o.ID == orderID {
					c.JSON(http.StatusOK, o)
					return
				}
			}
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": "order not found",
			})
		})

		// POST /api/v1/admin/orders/:orderId/refund
		// 触发退款（MVP-A 阶段仅返回 204，未接入支付网关）。
		adminAuthGroup.POST("/orders/:orderId/refund", func(c *gin.Context) {
			// 这里可以记录操作日志，MVP-A 阶段暂不实现真实退款逻辑。
			c.Status(http.StatusNoContent)
		})

		// GET /api/v1/admin/knowledge/sources
		// 返回知识源列表。
		adminAuthGroup.GET("/knowledge/sources", func(c *gin.Context) {
			resp := KnowledgeSourceListResponse{
				Items: demoKnowledgeSources,
				Total: len(demoKnowledgeSources),
			}
			c.JSON(http.StatusOK, resp)
		})

		// POST /api/v1/admin/knowledge/sources
		// 创建知识源（MVP-A 阶段将请求体视为完整 KnowledgeSource 并回显）。
		adminAuthGroup.POST("/knowledge/sources", func(c *gin.Context) {
			var req KnowledgeSource
			if err := c.ShouldBindJSON(&req); err != nil {
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
					"error": "invalid request body",
				})
				return
			}
			if req.ID == "" {
				req.ID = "ks_new"
			}
			req.CreatedAt = time.Now()
			demoKnowledgeSources = append(demoKnowledgeSources, req)
			c.JSON(http.StatusCreated, req)
		})
	}

	// OpenAPI 文档：MVP-A 阶段暂由 project/docs/API设计规范(MVP).md 与 packages/api-client/spec/openapi.yaml 描述。
	// 后续接入 swag 生成 /openapi.json 时，可在此挂载静态文件或 handler。

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}

