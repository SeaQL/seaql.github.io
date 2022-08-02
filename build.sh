#!/bin/bash
set -e

# Build SeaORM docs
cd SeaORM
npm i
npm run build
[[ -d ../docs/SeaORM ]] && rm -r ../docs/SeaORM
mv build ../docs/SeaORM
cd ..

# # Build SeaQuery docs
# cd SeaQuery
# npm i
# npm run build
# [[ -d ../docs/SeaQuery ]] && rm -r ../docs/SeaQuery
# mv build ../docs/SeaQuery
# cd ..

# Build StarfishQL docs
cd StarfishQL
npm i
npm run build
[[ -d ../docs/StarfishQL ]] && rm -r ../docs/StarfishQL
mv build ../docs/StarfishQL
cd ..

# Build SeaQL blog
cd Blog
npm i
npm run build
[[ -d ../docs/blog ]] && rm -r ../docs/blog
mv build ../docs/blog
cd ..

# Build Seaography docs
cd Seaography
npm i
npm run build
[[ -d ../docs/Seaography ]] && rm -r ../docs/Seaography
mv build ../docs/Seaography
cd ..