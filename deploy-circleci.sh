git pull
yarn build
cd .vuepress dist
git init
git add -A
git push -f git@github.com:sishenhei7/vue-blog.git master:gh-pages
