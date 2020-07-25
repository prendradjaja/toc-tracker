#!/usr/bin/env sh
set -e

curl -X POST -H "Content-Type: application/json" "localhost:8000/api/chapters/2/unread"

echo
