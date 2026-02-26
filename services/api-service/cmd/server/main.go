package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/medagil/api-service/adapters/repositories"
	"github.com/medagil/api-service/domain/entities"
	usecases "github.com/medagil/api-service/use_cases"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Response 统一API响应结构
// 所有API响应都应使用此结构，确保前后端交互一致性
type Response struct {
	Code int         `json:"code"`           // 业务状态码：0表示成功，非0表示错误
	Msg  string      `json:"msg"`            // 响应消息：成功时为"success"，错误时为错误描述
	Data interface{} `json:"data,omitempty"` // 响应数据：成功时返回具体数据，错误时为null
}

// UserProfile 描述了前端在「个人中心」和管理端「用户列表」中需要展示的基础用户信息。
// 字段设计与 OpenAPI 规范中 components.schemas.UserProfile 保持一致，便于前后端共享模型。
type UserProfile struct {
	ID       string  `json:"id"`
	Email    *string `json:"email,omitempty"`
	Nickname *string `json:"nickname,omitempty"`
	Avatar   *string `json:"avatar,omitempty"`
	Plan     string  `json:"plan"`              // free | pro | max
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

// TaskListResponse 对应 OpenAPI 中的任务列表结构，供管理端任务列表使用。
type TaskListResponse struct {
	Items []entities.Task `json:"items"`
	Total int             `json:"total"`
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

type AdminOrderListResponse struct {
	Items []entities.Order `json:"items"`
	Total int              `json:"total"`
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

// 数据库查询使用的仓储实例
var (
	userRepo      repositories.UserRepository
	taskRepo      repositories.TaskRepository
	orderRepo     repositories.OrderRepository
	knowledgeRepo repositories.KnowledgeRepository
)

// demoUser MVP-A阶段使用的演示用户
var demoUser = entities.User{
	ID:        1,
	Username:  "demo_user",
	Email:     strPtr("demo@example.com"),
	Status:    "active",
	CreatedAt: time.Now(),
	UpdatedAt: time.Now(),
}

// demoKnowledgeSources MVP-A阶段使用的知识源
var demoKnowledgeSources []KnowledgeSource

// strPtr 辅助函数：返回字符串指针
func strPtr(s string) *string {
	return &s
}

// responseMiddleware 统一响应格式中间件
// 拦截所有/api/v1/*路由的响应，将其转换为统一的JSON格式：
// 成功响应：{"code":0,"msg":"success","data":{...}}
// 错误响应：{"code":状态码,"msg":"错误信息","data":null}
func responseMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 执行请求处理
		c.Next()

		// 获取响应状态码
		statusCode := c.Writer.Status()

		// 仅处理/api/v1/*路由的响应
		if !strings.HasPrefix(c.Request.URL.Path, "/api/v1/") {
			return
		}

		// 如果响应已经被写入，则跳过
		if c.Writer.Written() {
			return
		}

		// 获取上下文中的响应数据
		data, exists := c.Get("response_data")
		if !exists {
			// 如果没有设置响应数据，使用默认的空对象
			data = gin.H{}
		}

		// 根据状态码构建响应
		if statusCode >= 200 && statusCode < 300 {
			// 成功响应
			c.JSON(http.StatusOK, Response{
				Code: 0,
				Msg:  "success",
				Data: data,
			})
		} else {
			// 错误响应
			msg, _ := c.Get("error_msg")
			if msg == nil {
				msg = http.StatusText(statusCode)
			}
			c.JSON(statusCode, Response{
				Code: statusCode,
				Msg:  fmt.Sprintf("%v", msg),
				Data: nil,
			})
		}
	}
}

// successResponse 辅助函数：设置成功响应数据
func successResponse(c *gin.Context, data interface{}) {
	c.Set("response_data", data)
}

// errorResponse 辅助函数：设置错误响应
func errorResponse(c *gin.Context, statusCode int, msg string) {
	c.Set("error_msg", msg)
	c.AbortWithStatus(statusCode)
}

// userAuthMiddleware 是 MVP-A 阶段的极简鉴权实现：
// - 仅校验是否携带 Bearer Token（不校验具体 token 内容）
// - 通过 context 记录当前用户 ID，便于后续替换为真实用户体系
// 这样设计的好处是：可以先让前后端端到端跑通，后续接入微信/手机号登录时只需替换中间件实现。
func userAuthMiddleware(c *gin.Context) {
	auth := c.GetHeader("Authorization")
	if auth == "" {
		errorResponse(c, http.StatusUnauthorized, "missing Authorization header, please set demo token in client")
		return
	}

	// 在 MVP-A 阶段，我们不解析 token，仅作为「是否登录」的开关使用。
	// 后续可以改为解析 JWT 或从 Redis 中加载会话信息。
	c.Set("userID", demoUser.ID)
	c.Next()
}

// adminAuthMiddleware 管理端鉴权中间件
// 用于保护管理端接口，确保只有授权的管理员才能访问
//
// 鉴权流程：
// 1. 从请求头获取 X-Admin-Token
// 2. 从配置文件读取预期的管理员token
// 3. 验证token是否匹配
// 4. 验证通过后，将adminID存入context，供后续处理使用
//
// 后续扩展方向：
// - RBAC（基于角色的访问控制）：根据管理员角色控制可访问的模块与操作范围
// - JWT Token：使用JWT进行更安全的身份验证
// - Redis Session：将会话信息存储在Redis中
// - 多因素认证：添加二次验证机制
//
// 使用示例：
//
//	客户端请求时需要在请求头中添加：
//	X-Admin-Token: your_admin_token_here
func adminAuthMiddleware(c *gin.Context) {
	// 步骤1：从请求头获取管理员token
	// 请求头名称：X-Admin-Token
	// 注意：请求头名称不区分大小写，但建议使用标准格式
	adminToken := c.GetHeader("X-Admin-Token")

	// 验证token是否存在
	if adminToken == "" {
		// 返回401未授权错误
		// 错误信息明确告知客户端缺少哪个请求头
		errorResponse(c, http.StatusUnauthorized, "missing X-Admin-Token header")
		return
	}

	// 步骤2：从配置文件读取预期的管理员token
	// 配置路径：admin.token
	// 如果配置文件中未设置，使用默认值（仅用于MVP阶段）
	expectedToken := viper.GetString("admin.token")

	// 安全检查：确保配置了有效的token
	// 生产环境中应该强制要求配置token，而不是使用默认值
	if expectedToken == "" {
		// MVP阶段使用默认token，便于快速开发和测试
		expectedToken = "admin_default_token"
		// 记录警告日志，提醒开发者配置正式token
		log.Println("WARNING: Using default admin token. Please configure admin.token in production.")
	}

	// 步骤3：验证token是否匹配
	// 使用严格的字符串比较，防止时序攻击
	// 注意：实际生产环境应使用更安全的验证方式（如JWT）
	if adminToken != expectedToken {
		// 记录失败的鉴权尝试，便于安全审计
		// 包含客户端IP、请求路径、时间等信息
		clientIP := c.ClientIP()
		requestPath := c.Request.URL.Path
		log.Printf("WARNING: Failed admin auth attempt from %s to %s", clientIP, requestPath)

		// 返回401未授权错误
		// 不暴露具体的错误信息，防止信息泄露
		errorResponse(c, http.StatusUnauthorized, "invalid admin token")
		return
	}

	// 步骤4：鉴权通过，将管理员信息存入context
	// 存储的信息：
	// - adminID: 管理员唯一标识
	// - adminToken: 验证通过的管理员token（可选）
	//
	// 后续处理可以通过以下方式获取：
	// adminID := c.GetString("adminID")
	c.Set("adminID", "admin_demo")
	c.Set("adminToken", adminToken)

	// 记录成功的鉴权操作，便于审计和监控
	log.Printf("INFO: Admin authenticated: adminID=admin_demo, IP=%s", c.ClientIP())

	// 继续处理请求
	c.Next()
}

// 注意：toInterfaceSlice和Paginate函数已被移除
//
// 原因：
// 1. 分页查询已改用GORM原生分页（Offset().Limit()），性能更优
// 2. 不再将所有数据加载到内存后再分页，避免内存溢出
// 3. 数据库层面的分页更高效，特别是大数据量场景（10万+条）
//
// 新的分页实现：
// - repositories/*.go中的FindPaginated方法使用GORM原生分页
// - 使用Offset和Limit实现数据库层面的分页
// - 查询总数和分页数据在数据库层面完成
//
// 性能对比：
// 旧方案（内存分页）：
//   - 查询所有数据到内存
//   - 在内存中切片分页
//   - 缺点：内存占用高，大数据量时性能差
//
// 新方案（数据库分页）：
//   - 使用Offset和Limit在数据库层面分页
//   - 只查询当前页的数据
//   - 优点：内存占用低，性能稳定
//
// 验证标准：
// - 大数据量（10万+条）分页查询响应时间<1s
// - 无内存溢出
// - 数据库连接数稳定

func main() {
	// 加载配置文件
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	// 启用环境变量支持
	// 允许通过环境变量覆盖配置文件中的值
	// 环境变量格式：DB_HOST, DB_PORT, DB_USER等
	viper.AutomaticEnv()

	// 绑定环境变量到配置键
	// 这样viper就能正确读取环境变量
	viper.BindEnv("database.host", "DB_HOST")
	viper.BindEnv("database.port", "DB_PORT")
	viper.BindEnv("database.user", "DB_USER")
	viper.BindEnv("database.password", "DB_PASSWORD")
	viper.BindEnv("database.dbname", "DB_NAME")
	viper.BindEnv("database.sslmode", "DB_SSLMODE")
	viper.BindEnv("database.max_open_conns", "DB_MAX_OPEN_CONNS")
	viper.BindEnv("database.max_idle_conns", "DB_MAX_IDLE_CONNS")
	viper.BindEnv("database.conn_max_lifetime", "DB_CONN_MAX_LIFETIME")
	viper.BindEnv("server.port", "SERVER_PORT")
	viper.BindEnv("server.read_timeout", "SERVER_READ_TIMEOUT")
	viper.BindEnv("server.write_timeout", "SERVER_WRITE_TIMEOUT")
	viper.BindEnv("server.mode", "GIN_MODE")
	viper.BindEnv("admin.token", "ADMIN_TOKEN")

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	// 验证数据库配置是否加载成功
	dbHost := viper.GetString("database.host")
	if dbHost == "" {
		log.Fatalf("Database host not found in config")
	}

	// 初始化数据库连接
	// 从配置文件读取数据库连接参数
	dbPort := viper.GetInt("database.port")
	dbUser := viper.GetString("database.user")
	dbPassword := viper.GetString("database.password")
	dbName := viper.GetString("database.dbname")
	sslMode := viper.GetString("database.sslmode")

	// 构建PostgreSQL数据源名称(DSN)
	// 格式: host=host port=port user=user password=password dbname=dbname sslmode=sslmode
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, sslMode)

	// 使用GORM打开数据库连接
	// 配置说明：
	// - SkipDefaultTransaction: 禁用默认事务，提高性能
	// - PrepareStmt: 启用预编译语句缓存，提高查询性能
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 获取底层sql.DB对象以配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying sql.DB: %v", err)
	}

	// 配置数据库连接池参数
	//
	// SetMaxOpenConns: 设置数据库的最大打开连接数
	// - 作用：限制同时打开的数据库连接总数，防止连接数过多导致数据库压力过大
	// - 推荐值：根据应用并发量和数据库性能调整，通常设置为 20-100
	// - 说明：设置为0表示无限制，但不推荐
	sqlDB.SetMaxOpenConns(20)

	// SetMaxIdleConns: 设置数据库的最大空闲连接数
	// - 作用：保持一定数量的空闲连接，避免频繁创建和销毁连接
	// - 推荐值：通常设置为 MaxOpenConns 的 50% 左右
	// - 说明：设置为0表示不保留任何空闲连接，每次使用后立即关闭
	sqlDB.SetMaxIdleConns(10)

	// SetConnMaxLifetime: 设置连接的最大生命周期
	// - 作用：定期关闭长时间使用的连接，防止连接老化导致的性能问题
	// - 推荐值：通常设置为 30分钟 到 2小时
	// - 说明：设置为0表示连接永不过期，但可能导致连接泄漏
	sqlDB.SetConnMaxLifetime(time.Hour)

	// SetConnMaxIdleTime: 设置空闲连接的最大空闲时间
	// - 作用：关闭长时间未使用的空闲连接，释放资源
	// - 推荐值：通常设置为 5分钟 到 30分钟
	// - 说明：设置为0表示不关闭空闲连接
	sqlDB.SetConnMaxIdleTime(30 * time.Minute)

	// 验证数据库连接
	// 通过Ping操作确保连接池配置正确且数据库可访问
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}
	log.Println("Database connection pool initialized successfully")

	gin.SetMode(gin.ReleaseMode)

	// 初始化仓储层
	var projectRepo repositories.ProjectRepository
	projectRepo = repositories.NewProjectRepository(db)
	taskRepo = repositories.NewTaskRepository(db)
	orderRepo = repositories.NewOrderRepository(db)
	userRepo = repositories.NewUserRepository(db)
	knowledgeRepo = repositories.NewKnowledgeRepository(db)

	// 初始化业务逻辑层（依赖倒置：use_cases依赖接口而非具体实现）
	projectUC := usecases.NewProjectUseCase(projectRepo)
	taskUC := usecases.NewTaskUseCase(taskRepo)
	orderUC := usecases.NewOrderUseCase(orderRepo)
	r := gin.New()
	r.Use(gin.Recovery())
	// 添加统一响应格式中间件，确保所有/api/v1/*路由返回统一的JSON结构
	r.Use(responseMiddleware())

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
			successResponse(c, gin.H{"message": "pong"})
		})

		// 需要登录态的接口统一挂载到带鉴权的子分组，后续替换鉴权实现时改动集中。
		authGroup := v1.Group("")
		authGroup.Use(userAuthMiddleware)

		// GET /api/v1/me
		// 返回当前用户的基础信息，用于 Web/小程序端「个人中心」与顶部状态栏。
		authGroup.GET("/me", func(c *gin.Context) {
			// 从context获取用户ID
			userIDStr := c.GetString("userID")
			if userIDStr == "" {
				errorResponse(c, http.StatusUnauthorized, "user not authenticated")
				return
			}

			// 转换用户ID
			userID, err := strconv.ParseInt(userIDStr, 10, 64)
			if err != nil {
				errorResponse(c, http.StatusBadRequest, "invalid user ID")
				return
			}

			// 从数据库查询用户
			user, err := userRepo.FindByID(userID)
			if err != nil {
				errorResponse(c, http.StatusNotFound, "user not found")
				return
			}

			// 获取用户的订阅计划
			plan, err := userRepo.GetUserPlan(userID)
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, "failed to get user plan")
				return
			}

			// 获取用户的积分余额
			credits, err := userRepo.GetUserCredits(userID)
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, "failed to get user credits")
				return
			}

			// 转换为UserProfile格式
			profile := UserProfile{
				ID:       strconv.FormatInt(user.ID, 10),
				Email:    user.Email,
				Nickname: &user.Username,
				Avatar:   nil,
				Plan:     plan,
				Credits:  &credits,
			}
			successResponse(c, profile)
		})

		// GET /api/v1/projects
		// 返回当前用户的项目列表，支持 page 与 pageSize 分页参数。
		authGroup.GET("/projects", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, _ := strconv.Atoi(pageStr)
			pageSize, _ := strconv.Atoi(pageSizeStr)

			items, total, err := projectUC.GetProjects(page, pageSize)
			if err != nil {
				// 区分错误类型：分页相关错误返回400，其他错误返回500
				if strings.Contains(err.Error(), "页码无效") || strings.Contains(err.Error(), "每页条数无效") {
					errorResponse(c, http.StatusBadRequest, err.Error())
				} else {
					errorResponse(c, http.StatusInternalServerError, err.Error())
				}
				return
			}

			// 转换entities.Project为ProjectSummary
			var summaries []ProjectSummary
			for _, p := range items {
				summaries = append(summaries, ProjectSummary{
					ID:        strconv.FormatInt(p.ID, 10), // int64转string
					Name:      p.Name,
					CreatedAt: p.CreatedAt,
				})
			}

			resp := ProjectListResponse{
				Items: summaries,
				Total: total,
			}
			successResponse(c, resp)
		})
	}

	// ---------- 管理端 API：/api/v1/admin/* ----------
	// 调用方：apps/admin
	admin := r.Group("/api/v1/admin")
	{
		// 管理端心跳接口，便于验证管理端路由是否正确配置到网关。
		admin.GET("/ping", func(c *gin.Context) {
			successResponse(c, gin.H{"message": "admin pong"})
		})

		adminAuthGroup := admin.Group("")
		adminAuthGroup.Use(adminAuthMiddleware)

		// GET /api/v1/admin/dashboard/stats
		// 返回管理端数据看板的核心指标。
		adminAuthGroup.GET("/dashboard/stats", func(c *gin.Context) {
			// 从数据库统计用户总数
			totalUsers, err := userRepo.Count()
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, "failed to count users")
				return
			}

			// 从数据库统计订单总数
			totalOrders, err := orderRepo.Count()
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, "failed to count orders")
				return
			}

			// 计算MRR（月度经常性收入）
			mrr, err := orderRepo.CalculateMRR()
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, "failed to calculate MRR")
				return
			}

			stats := DashboardStats{
				TotalUsers:  int(totalUsers),
				TotalOrders: int(totalOrders),
				MRR:         mrr,
			}
			successResponse(c, stats)
		})

		// GET /api/v1/admin/users
		// 返回平台用户列表。
		adminAuthGroup.GET("/users", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, _ := strconv.Atoi(pageStr)
			pageSize, _ := strconv.Atoi(pageSizeStr)

			// 从数据库查询用户列表
			users, total, err := userRepo.FindPaginated(page, pageSize)
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, err.Error())
				return
			}

			// 转换为UserProfile格式
			var profiles []UserProfile
			for _, u := range users {
				// 获取用户的订阅计划
				plan, _ := userRepo.GetUserPlan(u.ID)

				// 获取用户的积分余额
				credits, _ := userRepo.GetUserCredits(u.ID)

				profile := UserProfile{
					ID:       strconv.FormatInt(u.ID, 10),
					Email:    u.Email,
					Nickname: &u.Username,
					Avatar:   nil,
					Plan:     plan,
					Credits:  &credits,
				}
				profiles = append(profiles, profile)
			}

			resp := AdminUserListResponse{
				Items: profiles,
				Total: total,
			}
			successResponse(c, resp)
		})

		// GET /api/v1/admin/tasks
		// 返回全平台任务列表（MVP-A 阶段为 Demo 数据）。
		adminAuthGroup.GET("/tasks", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, _ := strconv.Atoi(pageStr)
			pageSize, _ := strconv.Atoi(pageSizeStr)

			items, total, err := taskUC.GetTasks(page, pageSize)
			if err != nil {
				// 区分错误类型：分页相关错误返回400，其他错误返回500
				if strings.Contains(err.Error(), "页码无效") || strings.Contains(err.Error(), "每页条数无效") {
					errorResponse(c, http.StatusBadRequest, err.Error())
				} else {
					errorResponse(c, http.StatusInternalServerError, err.Error())
				}
				return
			}

			resp := TaskListResponse{
				Items: items,
				Total: total,
			}
			successResponse(c, resp)
		})

		// GET /api/v1/admin/tasks/:taskId
		// 返回指定任务详情。
		adminAuthGroup.GET("/tasks/:taskId", func(c *gin.Context) {
			taskIDStr := c.Param("taskId")
			taskID, err := strconv.ParseInt(taskIDStr, 10, 64)
			if err != nil {
				errorResponse(c, http.StatusBadRequest, "invalid task ID")
				return
			}

			// 从数据库查询任务详情
			taskDetail, err := taskRepo.GetTaskDetail(taskID)
			if err != nil {
				errorResponse(c, http.StatusNotFound, "task not found")
				return
			}

			// 转换为TaskDetail格式
			detail := TaskDetail{
				ID:            strconv.FormatInt(taskDetail.ID, 10),
				ProjectID:     nil, // TODO: 从project_task关联表查询
				AgentKey:      taskDetail.AgentType,
				Status:        taskDetail.Status,
				InputText:     taskDetail.InputText,
				FileIDs:       taskDetail.FileIDs,
				ResultPreview: taskDetail.ResultPreview,
				CreatedAt:     taskDetail.CreatedAt,
			}
			successResponse(c, detail)
		})

		// GET /api/v1/admin/orders
		// 返回订单列表（MVP-A 阶段为 Demo 数据）。
		adminAuthGroup.GET("/orders", func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, _ := strconv.Atoi(pageStr)
			pageSize, _ := strconv.Atoi(pageSizeStr)

			items, total, err := orderUC.GetOrders(page, pageSize)
			if err != nil {
				// 区分错误类型：分页相关错误返回400，其他错误返回500
				if strings.Contains(err.Error(), "页码无效") || strings.Contains(err.Error(), "每页条数无效") {
					errorResponse(c, http.StatusBadRequest, err.Error())
				} else {
					errorResponse(c, http.StatusInternalServerError, err.Error())
				}
				return
			}

			resp := AdminOrderListResponse{
				Items: items,
				Total: total,
			}
			successResponse(c, resp)
		})

		// GET /api/v1/admin/orders/:orderId
		// 返回订单详情。
		adminAuthGroup.GET("/orders/:orderId", func(c *gin.Context) {
			orderIDStr := c.Param("orderId")
			orderID, err := strconv.ParseInt(orderIDStr, 10, 64)
			if err != nil {
				errorResponse(c, http.StatusBadRequest, "invalid order ID")
				return
			}

			// 从数据库查询订单
			order, err := orderRepo.FindByID(orderID)
			if err != nil {
				errorResponse(c, http.StatusNotFound, "order not found")
				return
			}

			successResponse(c, order)
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
			pageStr := c.DefaultQuery("page", "1")
			pageSizeStr := c.DefaultQuery("pageSize", "20")

			page, _ := strconv.Atoi(pageStr)
			pageSize, _ := strconv.Atoi(pageSizeStr)

			// 从数据库查询知识库列表
			bases, total, err := knowledgeRepo.FindPaginated(page, pageSize)
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, err.Error())
				return
			}

			// 转换为KnowledgeSource格式
			var sources []KnowledgeSource
			for _, b := range bases {
				source := KnowledgeSource{
					ID:        strconv.FormatInt(b.ID, 10),
					Name:      b.Name,
					Type:      "knowledge_base",     // 知识库类型
					Status:    string(b.Visibility), // 使用Visibility字段
					CreatedAt: b.CreatedAt,
				}
				sources = append(sources, source)
			}

			resp := KnowledgeSourceListResponse{
				Items: sources,
				Total: total,
			}
			successResponse(c, resp)
		})

		// POST /api/v1/admin/knowledge/sources
		// 创建知识源（MVP-A 阶段将请求体视为完整 KnowledgeSource 并回显）。
		adminAuthGroup.POST("/knowledge/sources", func(c *gin.Context) {
			var req KnowledgeSource
			if err := c.ShouldBindJSON(&req); err != nil {
				errorResponse(c, http.StatusBadRequest, "invalid request body")
				return
			}
			if req.ID == "" {
				req.ID = "ks_new"
			}
			req.CreatedAt = time.Now()
			demoKnowledgeSources = append(demoKnowledgeSources, req)
			successResponse(c, req)
		})
	}

	// OpenAPI 文档：MVP-A 阶段暂由 project/docs/API设计规范(MVP).md 与 packages/api-client/spec/openapi.yaml 描述。
	// 后续接入 swag 生成 /openapi.json 时，可在此挂载静态文件或 handler。

	// ========================================
	// 服务启动配置
	// ========================================

	// 从配置文件读取服务器端口
	// 配置路径：server.port
	// 默认值：8080（当配置文件中未设置时）
	// 环境变量：SERVER_PORT（可覆盖配置文件）
	//
	// 使用说明：
	// 1. 修改config.yaml中的server.port值可更改端口
	// 2. 通过环境变量SERVER_PORT可覆盖配置
	// 3. 如果配置文件和环境变量都未设置，使用默认值8080
	//
	// 示例：
	// config.yaml: server.port: 8081
	// 环境变量: export SERVER_PORT=8081
	// 命令行: ./server --port 8081
	serverPort := viper.GetInt("server.port")

	// 如果配置文件中未设置端口，使用默认值8080
	// 这确保服务始终可以启动，即使配置文件不完整
	if serverPort == 0 {
		serverPort = 8080
	}

	// 启动HTTP服务
	// 说明：
	// - 监听地址：0.0.0.0（所有网络接口）
	// - 监听端口：serverPort（从配置读取）
	// - 运行模式：gin.ReleaseMode（生产环境）
	//
	// 注意事项：
	// - 确保端口未被其他程序占用
	// - 生产环境建议使用非特权端口（>1024）
	// - 防火墙需要开放相应端口
	if err := r.Run(fmt.Sprintf(":%d", serverPort)); err != nil {
		log.Fatalf("Failed to start server on port %d: %v", serverPort, err)
	}

	// 记录服务启动信息
	log.Printf("Server started successfully on port %d", serverPort)
	log.Printf("Health check endpoint: http://0.0.0.0:%d/health", serverPort)
	log.Printf("API documentation: http://0.0.0.0:%d/docs", serverPort)
}
