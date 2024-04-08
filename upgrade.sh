#!/bin/bash
set -e

# Upgrade SeaORM docs
cd SeaORM
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx -y update-browserslist-db@latest
yarn build
rm -rf build
cd ..

# Upgrade SeaORM-X docs
cd SeaORM-X
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx -y update-browserslist-db@latest
yarn build
rm -rf build
cd ..

# Upgrade SeaQuery docs
cd SeaQuery
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx --yes update-browserslist-db@latest
yarn build
rm -rf build
cd ..

# Upgrade StarfishQL docs
cd StarfishQL
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx --yes update-browserslist-db@latest
yarn build
rm -rf build
cd ..

# Upgrade SeaQL blog
cd Blog
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx --yes update-browserslist-db@latest
yarn build
rm -rf build
cd ..

# Upgrade Seaography docs
cd Seaography
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx --yes update-browserslist-db@latest
yarn build
rm -rf build
cd ..

# Upgrade SeaStreamer docs
cd SeaStreamer
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d build ]] && rm -rf build
yarn install
yarn up @docusaurus/core @docusaurus/preset-classic
npx --yes update-browserslist-db@latest
yarn build
rm -rf build
cd ..
