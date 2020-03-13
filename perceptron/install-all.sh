#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

echo "
         ______________
        /             /|
       /             / |
      /____________ /  |
     | ___________ |   |
     ||Installing ||   |
     ||   all     ||   |
     ||     demos ||   |
     ||___________||   |
     |   _______   |  /
    /|  (_______)  | /
   ( |_____________|/
"

rm -rf _dist

for d in */ ; do
  cd "$d"
  echo "
  ♫ installing $d ♫
       _________
     _|_________|_
    /             \\
   | ###       ### |
   | ###       ### |
    \_____________/
"
  npm install
  cd ..
done
