#!/usr/bin/env bash
set -euo pipefail

mkdir -p security/reports

docker run --rm \
  -v "$PWD:/repo" \
  zricethezav/gitleaks:latest \
  detect \
    --source /repo \
    --no-git \
    --config /repo/security/gitleaks.toml \
    --report-format json \
    --report-path /repo/security/reports/gitleaks-report.json \
    --verbose || true

echo "Gitleaks report: security/reports/gitleaks-report.json"
