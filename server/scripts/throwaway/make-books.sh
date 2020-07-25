#!/usr/bin/env sh
set -e

# curl -X POST -H "Content-Type: application/json" -d '{"title":"book1", "chapters":["b1c1", "b1c2", "b1c3"]}' "localhost:8000/api/books"
curl -X POST -H "Content-Type: application/json" -d '{"title":"book2", "chapters":["b2c1", "b2c2", "b2c3"]}' "localhost:8000/api/books"

echo
