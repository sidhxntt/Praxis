package httpserver

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func New(pool *pgxpool.Pool, log *slog.Logger, trustedProxies []string) (*gin.Engine, error) {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery(), requestContext(log))
	if err := router.SetTrustedProxies(trustedProxies); err != nil {
		return nil, err
	}
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "route not found"}})
	})
	health := router.Group("/api/v1/health")
	health.GET("/live", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})
	ready := func(c *gin.Context) {
		if err := pool.Ping(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"status": "unavailable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "ready"})
	}
	health.GET("/ready", ready)
	health.GET("/startup", ready)
	return router, nil
}
