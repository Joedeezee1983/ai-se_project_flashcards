#!/usr/bin/env bash
set -euo pipefail

# Start a static file server for the project (used by automated tests).
PORT="${PORT:-8000}"
HOST="${HOST:-127.0.0.1}"

if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT" --bind "$HOST"
elif command -v python >/dev/null 2>&1; then
  exec python -m http.server "$PORT" --bind "$HOST"
elif command -v py >/dev/null 2>&1; then
  exec py -m http.server "$PORT" --bind "$HOST"
else
  echo "Python is required to run the local server." >&2
  exit 1
fi
