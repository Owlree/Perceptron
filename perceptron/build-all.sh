#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Prin empty line for output readability
echo ""

echo "  Removing _dist directory"
rm -rf _dist
echo "    _dist directory removed successfully"
echo ""

echo "  Building all experiments"

for d in */ ; do
  cd "$d"
  echo "    Building $d"
  npm run build > /dev/null # Only print errors
  cd ..
done

echo "  All experiments build successfully"
echo ""

echo "  Combining all outputs"

for directory in */ ; do
  printf "    %-24s to %s\n" "Copying ${directory}dist/." "_dist/$directory"
  mkdir -p "_dist/$directory"
  cp -r "${directory}dist/." "_dist/$directory/"
done

echo "  Outputs combined successfully"
echo ""

echo "  SUCCESS"
echo ""
