#!/bin/bash
set -e

cd $1
yarn install
npx -y update-browserslist-db@latest
yarn build
[[ -d ../docs/$2 ]] && rm -r ../docs/$2
mv build ../docs/$2
