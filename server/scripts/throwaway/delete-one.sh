#!/usr/bin/env sh
set -e

curl -X DELETE -H "Content-Type: application/json" "localhost:8000/api/books/2"

echo
