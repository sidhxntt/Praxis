package httpserver

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestNotFoundUsesStableErrorShape(t *testing.T) {
	router, err := New(slog.New(slog.NewJSONHandler(io.Discard, nil)), nil)
	require.NoError(t, err)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/missing", nil)
	router.ServeHTTP(recorder, request)
	require.Equal(t, http.StatusNotFound, recorder.Code)
	require.JSONEq(t, `{"error":{"code":"not_found","message":"route not found"}}`, recorder.Body.String())
}
