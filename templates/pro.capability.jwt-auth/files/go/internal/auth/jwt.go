package auth

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const SubjectKey = "jwt.subject"

type Claims struct {
	jwt.RegisteredClaims
}

func Issue(subject string, lifetime time.Duration) (string, error) {
	key := os.Getenv("JWT_SIGNING_KEY")
	if len(key) < 32 {
		return "", errors.New("JWT_SIGNING_KEY must contain at least 32 characters")
	}
	now := time.Now().UTC()
	claims := Claims{RegisteredClaims: jwt.RegisteredClaims{
		Subject: subject,
		IssuedAt: jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(lifetime)),
	}}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(key))
}

func RequireBearer() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		key := os.Getenv("JWT_SIGNING_KEY")
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(strings.TrimPrefix(header, "Bearer "), claims, func(token *jwt.Token) (any, error) {
			return []byte(key), nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}), jwt.WithExpirationRequired())
		if err != nil || !token.Valid || claims.Subject == "" || len(key) < 32 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid bearer token"})
			return
		}
		c.Set(SubjectKey, claims.Subject)
		c.Next()
	}
}
