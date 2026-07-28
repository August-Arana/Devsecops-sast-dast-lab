#!/usr/bin/env bash
set -euo pipefail

mkdir -p security/reports

docker compose up --build -d app
./scripts/wait-for-app.sh

# In a compose network, ZAP can reach the app by service name: http://app:3000
NETWORK="devsecopslab_default"
TARGET="http://app:3000"

if ! docker network inspect "$NETWORK" >/dev/null 2>&1; then
  echo "Network ${NETWORK} not found. Falling back to host.docker.internal."
  NETWORK="bridge"
  TARGET="http://host.docker.internal:3000"
fi

docker run --rm \
  --network "$NETWORK" \
  -v "$PWD/security:/zap/wrk" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
    -t "$TARGET" \
    -c /zap/wrk/zap/zap-baseline.conf \
    -r reports/zap-baseline-report.html \
    -w reports/zap-baseline-report.md \
    -J reports/zap-baseline-report.json \
    -I || true

echo "ZAP reports: security/reports/zap-baseline-report.{html,md,json}"
