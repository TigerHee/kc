# kc-web-checker

kc-web-checker 是 kucoin 前端 CI 检查工具，以确保上线的代码符合前端开发规范。

支持检查如下项

- [x] owner-check 
- [x] e2e-check 
- [x] eslint-check 
- [x] ~~ performance-check(lighthouse) ~~
- [x] 单元测试 
- [x] commitlint 
- [x] size 

## 使用

1. 安装依赖 `yarn add kc-web-checker`
2. 在 `package.json` `scripts` 中添加 `ci` 脚本
    ```json
    {
      "ci": "kc-web-checker"
    }
    ```
3. 执行命令 `yarn ci`


## 本地开发

1. 安装依赖 `yarn install`

## API

默认执行 `kc-web-checker` 会检查除 `performance` 之外所有规则。

* `-t, --type <string>` 指定执行特定类型的检查，多种类型可以通过 `,` 隔开，支持的类型包括 `owner|e2e|eslint|test|performance|performance-local`
* ~~ `-p, --performance` 开启 Docker 性能检测 ~~ performance 采用独立的 `kc-web-performance` 进行检测
* ~~ `-pl, --performance-local` 开启本地 Node 性能检测 ~~ 
* `-fo, --fixOwner <string>` 自动在文件头部添加 owner
* `-diff, --diff` 使用git 的diff，在owner checker 时可添加此参数，快速对比master差异文件的owner

举例

1. 指定执行 onwer 和 eslint 检查 `kc-web-checker -t owner,eslint`
2. 执行全部，并开启性能检测 `kc-web-checker -p`
3. 修复 Owner `kc-web-checker -fo brick.fan@kupotech.com`
