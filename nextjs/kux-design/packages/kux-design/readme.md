# @kux/design

营销组件库

[组件库设计文档](https://www.figma.com/design/D3Pp4F7sFpTkfSEFsQTm9e/%E5%A2%9E%E9%95%BF%E7%BB%84%E4%BB%B6?node-id=9-657&m=dev)

组件库文档网站 <https://kux.sit.kucoin.net/next/>


## 项目介绍
本项目基于 turbo + pnpm + react + typescript + vite + sass + storybook 构建.

项目目录结构:
```sh
.
├── CHANGELOG.md # 组件版本变更记录文件
├── coverage # (忽略)测试覆盖率结果文件夹
├── dev-guide.md
├── dist # (忽略) 组件产物
├── style # (忽略) 组件产物, 提供共业务引用 sass 工具的快捷入口
├── docs # 组件库文档
├── docs-build # 组件库文档构建后的产物目录
├── eslint.config.mjs
├── package.json
├── postcss.config.js # postcss 配置, 增加了 css逻辑属性插件
├── readme.md
├── scripts # 相关工具脚本
│   ├── extract-theme-colors.ts # 提取主题变量信息给文档使用的脚本
│   ├── themes # 主题变量相关的工具脚本
│   └── update-docs-site.sh # 一键更新文档站点的脚本
├── src # 源码
│   ├── common # 公共工具目录
│   ├── components # 组件目录
│   ├── global.d.ts # 全局类型定义
│   ├── hooks # 公共hooks
│   ├── index.ts # 组件库入口
│   ├── setup.ts # 组件库配置模块
│   ├── shared-type.ts # 组件库中组件共享的类型定义
│   └── style # 样式相关(sass)
├── test # 测试用例相关
│   ├── common
│   ├── hooks
│   └── test-utils
├── tsconfig.json
├── turbo # turbo 脚本
│   └── generators # 组件模版文件(pnpm addc 命令)
└── vite.config.ts

```

## 开发组件

* [总览](./contributing/1.get-started.md)
* [组件代码规范](./contributing/2.typescript.md)
* [样式规范](./contributing/3.style.md)
* [文档&stories 用例](./contributing/4.doc.md)
* [测试用例](./contributing/5.test.md)
* [网站更新&库的发布](./contributing/6.release.md)
