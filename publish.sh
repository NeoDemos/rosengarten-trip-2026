#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

cp ../Rosengarten_trip_juni_2026.html index.html

git add index.html README.md publish.sh

if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "Update Rosengarten trip page"
git push

echo "Published to https://neodemos.github.io/rosengarten-trip-2026/"
