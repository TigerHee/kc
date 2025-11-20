yar## 依赖安装

三种依赖安装的情况

1. package 依赖：`yarn workspace <workspace_name> add react`

2. packages 相互依赖：`lerna add package-n --scope <package>`

3. 共用的依赖，DEMO 的依赖：`yarn add react -W -D`

## 发布流程

**关于分支**

发布分支仅允许两个类型

- `master` 用于发布stable版本，保证代码是通过测试的
- `sit/*` 用于发布beta版本，提测版本，不能用于生产环境

**发布工作流**

1. 开发基于master创建feature/xxx分支并进行开发
2. 开发完成开发后在本地link或者本地安装自测
3. 开发完成后通知项目管理者，cr代码并创建sit/xxx分支
4. 项目管理者基于sit/xxx发布所有修改过的packages的beta版本，发布命令`yarn run release:beta`
5. 开发在项目中安装beta版本并提测
6. 开发修改bug，持续迭代sit/xxx分支和beta版本
7. beta版本通过测试，开发通知项目管理者，将sit/xxx分支合并到master，并发布所有修改过的packages的stable版本，发布命令`yarn run release`
8. 开发在项目中应用stable版本并锁定版本，准备上线

### vscode eslint 插件配置

在 WorkSpace Settings 中添加如下配置

```json
{
  "eslint.workingDirectories": [
    { "pattern": "packages/*/", "changeProcessCWD": true }
  ]
}
```
