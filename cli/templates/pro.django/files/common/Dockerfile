FROM python:3.13-slim AS builder
RUN pip install --no-cache-dir pdm==2.28.2
WORKDIR /app
COPY pyproject.toml ./
RUN pdm install --prod --no-editable

FROM python:3.13-slim AS runtime
ENV PATH="/app/.venv/bin:$PATH" PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN groupadd --system app && useradd --system --gid app --home /app app
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY --chown=app:app . .
USER app
EXPOSE 8000
CMD ["gunicorn", "config.asgi:application", "--worker-class", "uvicorn_worker.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "30", "--graceful-timeout", "30"]
