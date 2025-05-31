#!/bin/sh

if [ "$#" -ne 1 ]; then
  echo "Usage: pdm run startapp <app_name>"
  exit 1
fi

APP_NAME="$1"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
APP_DIR="$PROJECT_ROOT/$APP_NAME"

# Run the Django startapp command
python "$SRC_DIR/manage.py" startapp "$APP_NAME"

# Move the app into the src/ directory
mv "$APP_DIR" "$SRC_DIR"

echo "✅ Created Django app '$APP_NAME' inside src/"
