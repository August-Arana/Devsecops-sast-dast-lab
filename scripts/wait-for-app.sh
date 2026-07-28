#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://localhost:3000/health}"
MAX_ATTEMPTS="${2:-40}"

echo "Waiting for ${URL} ..."
for i in $(seq 1 "$MAX_ATTEMPTS"); do
  if curl -fsS "$URL" >/dev/null 2>&1; then
    echo "App is healthy."
    exit 0
  fi
  sleep 2
done

echo "App did not become healthy in time." >&2
exit 1
