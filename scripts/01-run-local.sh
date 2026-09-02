#!/usr/bin/env bash
set -euo pipefail

sudo docker-compose up --build -d app
./scripts/wait-for-app.sh

echo
printf "App:       http://localhost:3000\n"
printf "Health:    http://localhost:3000/health\n"
printf "Search:    http://localhost:3000/search?q=alice\n"
printf "XSS demo:  http://localhost:3000/greet?name=<script>alert(1)</script>\n"
printf "Debug:     http://localhost:3000/debug\n"
