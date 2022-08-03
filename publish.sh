#!/bin/bash
set -e

sh build.sh

# Commit & Push
git add docs
git commit -m 'Publish Docs'
git push --force origin master:gh-pages
git reset --hard HEAD~1