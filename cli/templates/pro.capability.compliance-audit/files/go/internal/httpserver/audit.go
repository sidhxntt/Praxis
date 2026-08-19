package httpserver

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func auditTrail(log *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		if !mutationMethod(c.Request.Method) {
			return
		}
		actor := c.GetString("jwt.subject")
		if actor == "" {
			actor = "anonymous"
		}
		log.Info("audit event",
			"event_type", "audit.http_mutation",
			"timestamp", time.Now().UTC().Format(time.RFC3339Nano),
			"request_id", c.Writer.Header().Get("X-Request-ID"),
			"actor", actor,
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
		)
	}
}

func mutationMethod(method string) bool {
	switch method {
	case http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete:
		return true
	default:
		return false
	}
}
