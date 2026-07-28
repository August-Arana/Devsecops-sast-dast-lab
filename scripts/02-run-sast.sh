#!/usr/bin/env bash
set -euo pipefail

mkdir -p security/reports

docker run --rm \
  -v "$PWD:/src" \
  semgrep/semgrep:latest \
  semgrep scan \
    --config /src/security/semgrep-rules.yml \
    --json \
    --output /src/security/reports/semgrep-report.json \
    /src/app || true

echo "Semgrep report: security/reports/semgrep-report.json"

docker run --rm \
  -v "$PWD:/src" \
  semgrep/semgrep:latest \
  semgrep scan \
    --config /src/security/semgrep-rules.yml \
    /src/app || true
