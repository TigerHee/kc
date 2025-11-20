# 公共业务模版项目

lerna + yarn workspaces

---

_Updated 2021-04-16_

**[Break change]**

1. @kc/entrance 不再导出 formatUtmAndRcodeUrl 函数和 queryPersistence 对象，utm 和 rcode 相关功能迁移到@kc/gbiz-base/lib/QueryPersistence

```js
// before
import { formatUtmAndRcodeUrl } from '@kc/entrance';
const urlWithUtmAndRcode = formatUtmAndRcodeUrl(url);
// now
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
const urlWithUtmAndRcode = queryPersistence.formatUrlWithStore(url);
```

**[New]**

1. 新版本@kufox/mui 不再提供带 utm format 功能的 Link 组件。 G-Biz 新增 UtmLink package 提供带 utm format 功能的 Link 组件

```js
// before
import { Link } from '@kc/mui';
// after
import Link from '@kc/utm-link';
```

## Dev

**依赖安装**

- packages 依赖，一般指包的运行时依赖。

  `yarn workspace <workspace_name> add <package_name>`

- packages 相互依赖。lerna 会在包之间建立软链接。

  `lerna add <package_name> --scope <workspace_name>`

- 公共依赖。用于构建的非运行时包。

  `yarn add <package_name> -W -D`

**调试**

packages 中的 _private package gbiz-dev_ 用作调试包，它是一个使用 _parcel_ 启动的 React 工程。

**本地开发**
`yarn run dev:externals`

**启动调试**

1. 运行 `yarn run watch` 命令启动 packages build 的 watch 模式
2. 运行 `yarn run dev` 命令启动 _gbiz-dev_ 工程

**提交**

开发提交代码尽量使用命令 `yarn cz`，不符合规范的 commit message 会被 git hook 拒绝。

> cz 命令生成的 commit message 用于自动确定发布版本，生成 changelog

## Release

**workflow**

1. 开发基于 master 创建 feature/xxx 分支并进行开发
2. 开发完成开发后在本地 link 或者本地安装自测(推荐借助 _yalc_ 工具发布本地包)
3. 开发完成后通知项目管理者， CR 代码
4. 项目管理者 CR 通过，从最新的 master 创建 release/\*\* 分支
5. 项目管理者基于 release/\*\* 发布所有修改过的 packages 的 beta 版本，发布命令 `yarn run release:beta`

> 包将发布到 beta dist-tag 下，为避免冲突， preid 采用 beta.{commit id hash}的形式

5. 开发在项目中安装 beta 版本并提测

> 安装命令可以使用 yarn add <pakcage_name>@beta，安装 beta dist tag 的最新版本

6. 开发修改 bug ，持续迭代 release/\*\* 分支和 beta 版本
7. beta 版本通过测试，开发通知项目管理者，将 release/\*\* 分支合并到 master，并发布所有修改过的 packages 的 stable 版本，发布命令 `yarn run release`

> 包将发布到 beta dist-tag 下，采用 SemVer 版本规范。正式版本的发布，脚本会生成 Changelog, git tag, package version。

8. 开发在项目中安装 stable 版本并锁定版本，准备上线

---

### vscode eslint 插件配置

在 WorkSpace Settings 中添加如下配置

```json
// setting.json
{
  "eslint.workingDirectories": [
    {
      "pattern": "packages/*/",
      "changeProcessCWD": true
    }
  ]
}
```
