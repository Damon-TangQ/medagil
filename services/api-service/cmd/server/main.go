package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// 用户端 API：/api/v1/*，鉴权为用户登录态
	// 调用方：apps/web、apps/miniapp
	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})
		// TODO: 注册用户端 controllers（projects, tasks, orders, me 等）
	}

	// 管理端 API：/api/v1/admin/*，鉴权为 RBAC + 管理员 Token
	// 调用方：apps/admin
	admin := r.Group("/api/v1/admin")
	{
		admin.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "admin pong"})
		})
		// TODO: 注册管理端 controllers（users, dashboard, orders 等）
	}

	// TODO: OpenAPI 文档：GET /openapi.json（swag 生成后挂载）

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
