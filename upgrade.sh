#!/bin/bash
set -e

# Upgrade SeaORM docs
cd SeaORM
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
npm install
yarn install
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
npx update-browserslist-db@latest -y
npm run build
rm -rf build
cd ..

# Upgrade SeaQuery docs
cd SeaQuery
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
npm install
yarn install
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
npx update-browserslist-db@latest -y
npm run build
rm -rf build
cd ..

# Upgrade StarfishQL docs
cd StarfishQL
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
npm install
yarn install
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
npx update-browserslist-db@latest -y
npm run build
rm -rf build
cd ..

# Upgrade SeaQL blog
cd Blog
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
npm install
yarn install
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
npx update-browserslist-db@latest -y
npm run build
rm -rf build
cd ..

# Upgrade Seaography docs
cd Seaography
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
npm install
yarn install
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
npx update-browserslist-db@latest -y
npm run build
rm -rf build
cd ..

# Upgrade SeaStreamer docs
cd SeaStreamer
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
npm install
yarn install
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest
npx update-browserslist-db@latest -y
npm run build
rm -rf build
cd ..
