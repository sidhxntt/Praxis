package httpserver

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/coder/websocket"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func registerRealtimeRoute(router *gin.Engine) {
	router.GET("/ws/v1/rooms/:room", realtimeHandler)
}

func realtimeHandler(c *gin.Context) {
	room := c.Param("room")
	if room == "" || len(room) > 64 || strings.ContainsAny(room, " /\\") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid room"})
		return
	}
	options, err := redis.ParseURL(environmentValue("REDIS_URL", "redis://localhost:6379/0"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "realtime unavailable"})
		return
	}
	client := redis.NewClient(options)
	defer client.Close()
	conn, err := websocket.Accept(c.Writer, c.Request, &websocket.AcceptOptions{
		OriginPatterns: strings.Split(environmentValue("WEBSOCKET_ORIGINS", "localhost:8080"), ","),
	})
	if err != nil {
		return
	}
	defer conn.Close(websocket.StatusNormalClosure, "")
	conn.SetReadLimit(4096)
	ctx, cancel := context.WithCancel(c.Request.Context())
	defer cancel()
	channel := "room." + room
	subscription := client.Subscribe(ctx, channel)
	defer subscription.Close()

	received := make(chan string)
	failed := make(chan error, 1)
	go func() {
		for {
			message, receiveErr := subscription.ReceiveMessage(ctx)
			if receiveErr != nil {
				failed <- receiveErr
				return
			}
			received <- message.Payload
		}
	}()
	go func() {
		for {
			_, payload, readErr := conn.Read(ctx)
			if readErr != nil {
				failed <- readErr
				return
			}
			if publishErr := client.Publish(ctx, channel, payload).Err(); publishErr != nil {
				failed <- publishErr
				return
			}
		}
	}()
	for {
		select {
		case payload := <-received:
			if err := conn.Write(ctx, websocket.MessageText, []byte(payload)); err != nil {
				return
			}
		case <-failed:
			return
		case <-ctx.Done():
			return
		}
	}
}

func environmentValue(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
