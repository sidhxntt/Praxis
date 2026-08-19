package httpserver

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
)

func registerSocialRoutes(router *gin.Engine) {
	goth.UseProviders(github.New(
		os.Getenv("OAUTH_GITHUB_CLIENT_ID"),
		os.Getenv("OAUTH_GITHUB_CLIENT_SECRET"),
		os.Getenv("OAUTH_GITHUB_CALLBACK_URL"),
		"user:email",
	), google.New(
		os.Getenv("OAUTH_GOOGLE_CLIENT_ID"),
		os.Getenv("OAUTH_GOOGLE_CLIENT_SECRET"),
		os.Getenv("OAUTH_GOOGLE_CALLBACK_URL"),
		"profile", "email",
	))
	store := sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))
	store.Options = &sessions.Options{Path: "/", HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode, MaxAge: 600}
	gothic.Store = store

	provider := func(c *gin.Context) {
		query := c.Request.URL.Query()
		query.Set("provider", c.Param("provider"))
		c.Request.URL.RawQuery = query.Encode()
	}
	router.GET("/api/v1/auth/social/:provider", func(c *gin.Context) {
		provider(c)
		gothic.BeginAuthHandler(c.Writer, c.Request)
	})
	router.GET("/api/v1/auth/social/:provider/callback", func(c *gin.Context) {
		provider(c)
		user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "social authentication failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"provider": user.Provider, "subject": user.UserID, "email": user.Email})
	})
}
