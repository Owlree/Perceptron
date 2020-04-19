#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

echo ""

echo "  Installing dependencies for all experiments"

for directory in */ ; do
  cd "$directory"
  echo "    Installing dependencies in $directory"

  npm install > /dev/null # Only print errors
  cd ..
done

echo "  All dependencies installes successfully"
echo ""

echo "  SUCCESS"
echo ""
