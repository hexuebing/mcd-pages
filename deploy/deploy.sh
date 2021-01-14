#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 拷贝部署文件
cp -r ./deploy/conf.d .sites/conf.d
cp ./deploy/app.yaml .sites/app.yaml
cp ./deploy/Dockerfile .sites/Dockerfile

# 进入生成的文件夹
cd .sites

git init
git add -A
git commit -m "deploy $(date)"

git remote add origin https://git-pd.megvii-inc.com/megvii-gis-group/style-sets.git

git checkout -b release-sites

git push -f origin release-sites
