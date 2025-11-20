# check-web

kucoin 前端检查工具，详情见子项目 README。

# 前端项目中添加 husky

## yarn add husky --dev

## npx husky install

## npx husky add .husky/pre-commit "npx lint-staged && yarn run e2e:check && yarn check:owner --diff"

## npx husky add .husky/commit-msg 'npx --no -- yarn check:commitlint -msg "$(cat "$1")"'
