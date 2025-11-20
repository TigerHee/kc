# Kux Design
下一代 KuCoin 前端组件库.



## Project Structure
基于 turbo + pnpm 的 monorepo

```sh

├── packages # 库
│   ├── kux-app-sdk # 公共sdk, 主要为工具函数库
│   ├── kux-design # 组件库
│   ├── repo-utils # monorepo 开发构建的工具函数
│   └── tsconfig # monorepo 公共的 tsconfig
```


## 开发准备
* Node.js >= 20.12.0 (可使用 [Volta](https://volta.sh/) 自动切换)
* pnpm@9.12.x, 请使用 `npm install -g pnpm` 安装

## 开始开发
1. 在开发之前, 需要先在项目根目录下准备好开发环境
```sh
pnpm install # 安装依赖
pnpm build # 构建所有包, 保证基础产物子包可用
```

2. 通用的开发
每个包(少数包除外)的都有提供 `dev` 命令, 可直接进入包目录后执行 `pnpm dev` 进入开发.

各个项目的详细开发说明请查看各个项目的 README.md


3. 核心包的开发, 下述几个核心包提供了公共的开发命令:
* `pnpm dev:kux-design`: 开发 组件库

这些命令除了会启动对应包自身的dev命令, 还会watch其使用到的包的变化, 若变化则会自动构建.

使用注意:
* 这些公共命令会启动多个node进程, 开发效率会略有降低, **仅当会改动到依赖的包的时候使用**
* 依赖的包改动后, 应当稍等片刻, 再刷新页面, 确保更改生效(因项目庞大, 为保证性能, 暂未做自动刷新)
* 初次启动命令时, 因为各个依赖的包构建时序不同, 会有报错, 可忽略, 静置一会等不再输出日志即表示就绪, 可正常开发


## 公共命令
项目根目录下存在的公共命令
```sh
# 构建整个项目
pnpm build
```


## 依赖管理说明
项目使用 pnpm workspace 管理依赖, 请不要使用 `npm` / `yarn` 安装依赖

* 若某个包需要需要添加依赖, 命令行进入该包目录, 使用 `pnpm add xxx` 安装依赖
* 若整个monorepo需要添加依赖, 在项目根目录下运行 `pnpm add xxx -W` 安装依赖

### Why pnpm
* pnpm 可以解决[幽灵依赖问题](https://juejin.cn/post/7226610046833442872)
* pnpm 在单体仓库中可以便利的[统一管理子包中的依赖版本](https://pnpm.io/catalogs)

## 发包步骤

* 每次提交代码后，如果有涉及发包的package：
* 1.可以先执行 `pnpm pkg:changelog-add`，一并录入changelog msg
* 2.执行 `pnpm pkg:changelog-beta` 或者 `pnpm pkg:changelog-release`，升级版本号
* 3.最后一步，`pnpm pkg:save-packages` 选择需要发包的package并写入到.publish-packages
* 4.提交PR合并后，在jenkins选择release打beta包

