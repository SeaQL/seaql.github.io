#!/bin/bash
set -e

# Build SeaORM docs
cd SeaORM
npm i
npm run build
[[ -d ../docs/SeaORM ]] && rm -r ../docs/SeaORM
mv build ../docs/SeaORM
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

# Build SeaStreamer docs
cd SeaStreamer
npm i
npm run build
[[ -d ../docs/SeaStreamer ]] && rm -r ../docs/SeaStreamer
mv build ../docs/SeaStreamer
cd ..
