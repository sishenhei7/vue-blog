git pull
yarn build
cd docs
cd .vuepress
cd dist
git init
git config --global user.email "you@example.com"
git config --global user.name "sishenhei7"
git add .
git commit -m 'deploy: deploy[ci skip]'
git push -f git@github.com:sishenhei7/vue-blog.git master:gh-pages
