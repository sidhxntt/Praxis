FROM golang:1.26-alpine AS builder
RUN apk add --no-cache ca-certificates git
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /out/api /api
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/api"]
