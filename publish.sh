#!/bin/bash
set -e

# Build SeaORM docs
cd SeaORM
npm run build
[[ -d ../docs/SeaORM ]] && rm -r ../docs/SeaORM
mv build ../docs/SeaORM
cd ..

# # Build SeaQuery docs
# cd SeaQuery
# npm run build
# [[ -d ../docs/SeaQuery ]] && rm -r ../docs/SeaQuery
# mv build ../docs/SeaQuery
# cd ..

# Build StarfishQL docs
cd StarfishQL
npm run build
[[ -d ../docs/StarfishQL ]] && rm -r ../docs/StarfishQL
mv build ../docs/StarfishQL
cd ..

# Commit & Push
git add docs
git commit -m 'Publish Docs'
git push --force origin master:gh-pages
git reset --hard HEAD~1