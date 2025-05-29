ARG PYTHON_BASE=3.10-slim
FROM python:${PYTHON_BASE}

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PDM
RUN pip install -U pdm

# Configure environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PDM_CHECK_UPDATE=false \
    PATH="/project/.venv/bin:$PATH" 

# Copy project files
WORKDIR /project
COPY pyproject.toml pdm.lock ./
COPY . .

# Install dependencies
RUN pdm install 

# Expose port
EXPOSE 4000


# Startup command
CMD ["sh", "-c", "pdm run migrate && pdm run docker_prod"]