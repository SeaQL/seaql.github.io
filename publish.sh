cd SeaORM
npm run build
rm -r ../docs/SeaORM
mv build ../docs/SeaORM
cd ..
git add docs
git commit -m 'Update Docs'
git push