#!/bin/bash
set -e

cd $1
npm i
npm run build
[[ -d ../docs/$2 ]] && rm -r ../docs/$2
mv build ../docs/$2
