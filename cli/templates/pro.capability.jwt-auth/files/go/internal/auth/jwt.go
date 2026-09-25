package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const SubjectKey = "jwt.subject"

type RevocationStore interface {
	Revoke(context.Context, string, time.Time) error
	IsRevoked(context.Context, string) (bool, error)
}

type Claims struct {
	TokenType string `json:"token_type"`
	jwt.RegisteredClaims
}

type Pair struct {
	Access  string `json:"access"`
	Refresh string `json:"refresh"`
}

var revocations struct {
	sync.RWMutex
	store RevocationStore
}

func ConfigureRevocations(store RevocationStore) {
	revocations.Lock()
	defer revocations.Unlock()
	revocations.store = store
}

func IssuePair(subject string) (Pair, error) {
	access, err := issue(subject, "access", 15*time.Minute)
	if err != nil {
		return Pair{}, err
	}
	refresh, err := issue(subject, "refresh", 7*24*time.Hour)
	if err != nil {
		return Pair{}, err
	}
	return Pair{Access: access, Refresh: refresh}, nil
}

func issue(subject string, tokenType string, lifetime time.Duration) (string, error) {
	key := os.Getenv("JWT_SIGNING_KEY")
	if len(key) < 32 || subject == "" {
		return "", errors.New("JWT signing key and subject are required")
	}
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}
	now := time.Now().UTC()
	claims := Claims{TokenType: tokenType, RegisteredClaims: jwt.RegisteredClaims{
		ID: hex.EncodeToString(random), Subject: subject,
		IssuedAt: jwt.NewNumericDate(now), ExpiresAt: jwt.NewNumericDate(now.Add(lifetime)),
	}}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(key))
}

func parse(raw string, expectedType string) (*Claims, error) {
	key := os.Getenv("JWT_SIGNING_KEY")
	if len(key) < 32 {
		return nil, errors.New("JWT signing key is not configured")
	}
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(raw, claims, func(token *jwt.Token) (any, error) {
		return []byte(key), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}), jwt.WithExpirationRequired(), jwt.WithIssuedAt())
	if err != nil || !token.Valid || claims.Subject == "" || claims.ID == "" || claims.TokenType != expectedType {
		return nil, errors.New("invalid JWT")
	}
	return claims, nil
}

func RotateRefresh(ctx context.Context, raw string) (Pair, error) {
	claims, err := parse(raw, "refresh")
	if err != nil {
		return Pair{}, err
	}
	store := revocationStore()
	if store == nil {
		return Pair{}, errors.New("revocation store is not configured")
	}
	revoked, err := store.IsRevoked(ctx, claims.ID)
	if err != nil || revoked {
		return Pair{}, errors.New("refresh token is revoked")
	}
	if err := store.Revoke(ctx, claims.ID, claims.ExpiresAt.Time); err != nil {
		return Pair{}, err
	}
	return IssuePair(claims.Subject)
}

func revocationStore() RevocationStore {
	revocations.RLock()
	defer revocations.RUnlock()
	return revocations.store
}

func RequireBearer() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		claims, err := parse(strings.TrimPrefix(header, "Bearer "), "access")
		store := revocationStore()
		if err == nil && store != nil {
			var revoked bool
			revoked, err = store.IsRevoked(c.Request.Context(), claims.ID)
			if revoked {
				err = errors.New("access token is revoked")
			}
		}
		if err != nil || store == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid bearer token"})
			return
		}
		c.Set(SubjectKey, claims.Subject)
		c.Next()
	}
}
