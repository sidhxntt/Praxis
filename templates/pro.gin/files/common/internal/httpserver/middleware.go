package httpserver

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

func requestContext(log *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = time.Now().UTC().Format("20060102T150405.000000000")
		}
		c.Header("X-Request-ID", requestID)
		started := time.Now()
		c.Next()
		log.Info("http request",
			"request_id", requestID,
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"duration_ms", time.Since(started).Milliseconds(),
		)
	}
}
