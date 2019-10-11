git pull
yarn build
cd docs
cd .vuepress
cd dist
git init
git add .
git commit -m 'deploy'
git push -f git@github.com:sishenhei7/vue-blog.git master:gh-pages
