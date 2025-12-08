#!/bin/bash
set -e

# Upgrade SeaORM docs
cd SeaORM
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..

# Upgrade SeaORM-X docs
cd SeaORM-X
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..

# Upgrade sea-orm-pro docs
cd sea-orm-pro
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..

# Upgrade SeaQL blog
cd Blog
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..

# Upgrade SeaQL interview
cd Interview
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..

# Upgrade Seaography docs
cd Seaography
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..

# Upgrade SeaStreamer docs
cd SeaStreamer
[[ -d .docusaurus ]] && rm -rf .docusaurus
[[ -d node_modules ]] && rm -rf node_modules
[[ -d .yarn ]] && rm -rf .yarn
[[ -d .pnp.cjs ]] && rm -rf .pnp.cjs
[[ -d .pnp.loader.mjs ]] && rm -rf .pnp.loader.mjs
[[ -d build ]] && rm -rf build
yarn up @docusaurus/core @docusaurus/plugin-content-docs @docusaurus/preset-classic @docusaurus/theme-common
npx -y update-browserslist-db@latest
yarn install
yarn build
rm -rf build
cd ..
