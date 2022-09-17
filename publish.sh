#!/bin/bash
set -e

sh build.sh

# Build Seaography docs
cd Seaography
npm run build
[[ -d ../docs/Seaography ]] && rm -r ../docs/Seaography
mv build ../docs/Seaography
cd ..

# Commit & Push
git add docs
git commit -m 'Publish Docs'
git push --force origin master:gh-pages
git reset --hard HEAD~1