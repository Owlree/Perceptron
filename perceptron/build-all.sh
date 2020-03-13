#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

echo "
         ______________
        /             /|
       /             / |
      /____________ /  |
     | ___________ |   |
     || Building  ||   |
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
  ♫ building $d ♫
       _________
     _|_________|_
    /             \\
   | ###       ### |
   | ###       ### |
    \_____________/
"
  npm run build
  cd ..
done

for d in */ ; do
  mkdir -p "_dist/$d"
  cp -r "$d/dist/." "_dist/$d/"
done

cd _dist
echo '<h1>Perceptron</h1>' > index.html

for d in */ ; do
  echo "<a href='$d'>$d</a>" >> index.html
done
