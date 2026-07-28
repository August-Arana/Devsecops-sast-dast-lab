#!/usr/bin/env bash
set -euo pipefail

mkdir -p security/reports

docker compose build app

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$PWD/security/reports:/reports" \
  aquasec/trivy:latest \
  image \
    --severity HIGH,CRITICAL \
    --format table \
    --output /reports/trivy-image-report.txt \
    devsecops-sast-dast-lab-app:local || true

echo "Trivy image report: security/reports/trivy-image-report.txt"
cat security/reports/trivy-image-report.txt || true
