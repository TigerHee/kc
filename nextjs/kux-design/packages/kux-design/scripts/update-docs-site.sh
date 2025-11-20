#!/usr/bin/env bash

# 报错时退出脚本
set -e

# 进入脚本所在目录
cd "$(dirname "$0")"
# 进入 kux-design 目录
cd ..

# 读取 .env.local 文件中的变量
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# 记录当前路径
CURRENT_DIR=$(pwd)

# 检查 KUFOX_WEBSITE_REPO_PATH 是否设置
if [ -z "$KUFOX_WEBSITE_REPO_PATH" ]; then
  echo "KUFOX_WEBSITE_REPO_PATH is not set. Please set it in .env.local file."
  exit 1
fi

# 检查 $KUFOX_WEBSITE_REPO_PATH 仓库是否在 feature/update-doc 分支
cd "$KUFOX_WEBSITE_REPO_PATH"
if [ "$(git rev-parse --abbrev-ref HEAD)" != "feature/update-doc" ]; then
  echo "Current branch is not feature/update-doc. Please switch to this branch."
  exit 1
fi

# 同步 kufox-website 仓库
git pull origin feature/update-doc

cd "$CURRENT_DIR"

# 构建文档站点
pnpm run build-docs

# 删除 $KUFOX_WEBSITE_REPO_PATH/public/next 目录
rm -rf "$KUFOX_WEBSITE_REPO_PATH/public/next"

# 复制当前目录下的 docs-build 到 $KUFOX_WEBSITE_REPO_PATH/public/next
cp -r docs-build "$KUFOX_WEBSITE_REPO_PATH/public/next"

# 进入 kufox-website 目录
cd "$KUFOX_WEBSITE_REPO_PATH"

# 提交更改
git add public/next
git commit -m "docs(t-heat-five): update kux-design docs site"
# 推送到对应的分支
git push

# 打开PR页面
open "https://bitbucket.kucoin.net/projects/KUFD/repos/kufox-website/pull-requests?create&targetBranch=refs%2Fheads%2Frelease%2Fupdate-doc&sourceBranch=refs%2Fheads%2Ffeature%2Fupdate-doc&targetRepoId=953"
