package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"example.com/{{projectName}}/internal/config"
	"example.com/{{projectName}}/internal/database"
	"example.com/{{projectName}}/internal/httpserver"
	// @praxis:imports
)

func main() {
	if len(os.Args) == 2 && os.Args[1] == "healthcheck" {
		client := &http.Client{Timeout: 2 * time.Second}
		response, err := client.Get("http://127.0.0.1:8080/api/v1/health/live") // #nosec G107 -- fixed loopback probe
		if err != nil || response.StatusCode != http.StatusOK {
			os.Exit(1)
		}
		response.Body.Close()
		return
	}
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := config.Load()
	if err != nil {
		log.Error("invalid configuration", "error", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := database.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Error("database startup failed", "error", err)
		os.Exit(1)
	}
	defer pool.Close()
	// @praxis:startup

	router, err := httpserver.New(log, cfg.TrustedProxies, pool.Ping)
	if err != nil {
		log.Error("router startup failed", "error", err)
		os.Exit(1)
	}
	server := &http.Server{
		Addr:              cfg.HTTPAddress,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	failed := make(chan error, 1)
	go func() {
		if listenErr := server.ListenAndServe(); !errors.Is(listenErr, http.ErrServerClosed) {
			failed <- listenErr
		}
	}()

	select {
	case <-ctx.Done():
		log.Info("shutdown requested")
	case listenErr := <-failed:
		log.Error("server failed", "error", listenErr)
	}
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Error("graceful shutdown failed", "error", err)
		os.Exit(1)
	}
}
