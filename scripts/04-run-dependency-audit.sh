#!/usr/bin/env bash
set -euo pipefail

cd app
if [ ! -d node_modules ]; then
  npm install
fi
npm audit --audit-level=high || true
