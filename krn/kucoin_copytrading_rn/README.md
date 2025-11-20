# 发版前注意事项

#### 若此项目本次迭代需要升级 @krn/basic-mapping 版本，请保证这次 @krn/basic-mapping 发布要早于业务包的发布。

#### 请确认 package.json 的 appVersion 版本，若本次发版依赖了一些新的原生能力（如依赖了新增的桥或原生的组件），须将此版本号修改为对应 app 版本。其他情况不建议升级 appVersion 以保证更多的用户能更新到。

@author: harry.lai

## 项目介绍

KC-RN 跟单业务 包含简化的内外部 m1 招募/审核/管理功能，跟单流程，跟带单首页/个人页，跟带单管理，仓位管理，跟单广场，关注/订阅，资产页，分享和增长功能

## 项目编码 收敛风格为 就近原则 Proximity Principle

在本项目中，我们采用就近原则来组织我们的组件和代码。就近原则意味着我们不将所有组件统一放置在`src/components`目录下，而是根据以下规则进行组织：

- **原子组件**：那些跨多个页面或功能共享的原子组件仍然位于`src/components/common`目录下。
- **特定组件**：与特定页面或功能强相关的组件将放置在与其相关的目录下，即放置在它们被使用的上下文附近。例如，在`CopyTrade`页面下的特定组件将位于`src/pages/CopyTrade/components`目录中。同理 业务子模块 子组件也放置 父组件最近交集的目录下

这种方式的一定优势是使开发者能够更快地找到与特定功能相关的代码，并更容易地理解和维护相关组件。 暂时尝试性约束 关于这块有想法 可以找我一起再沟通哈

## 项目目录结构简介:

```md
src/
├── components/ # 可复用组件
│ ├── common/ # 跟单业务 原子组件
│ └── Headless/ # 无头组件 (只提供逻辑不具体渲染)
├── constants/ # 常量定义
│ ├── styles.js # 通用 cssinjs 样式常量
│ ├── router-name-map.js # 路由名称映射
│ └── enhance-color.js # 颜色增强常量
└── pages/ # 跟单相关页面
├── components 收敛 跟单页面复用组件
...
└── OtherPage/ # 其他页面 暂无
```

## 业务模块注意细节:

### Components

Common 与 Headless 为跟单下原子组件，根据跟单 UI 基于 KRN/UI 定制或新开发的 原子组件, 使用原则是如果 KRN/UI 能 cover 的 优先用 krn/ui

### Constants

项目中使用的一些常量定义，如样式、路由名等。

### Styles

定义了部分 CSSINJS(emotion)通用的静态样式与动态样式，静态：如 text SecondaryText flex-row-center 布局等。
⚠️ 注意：由于需要 cover 夜间模式 动态样式需要在引用方通过 emotion.styled mixins 方式使用

#### Router Name Map) （todo: 可能会 rename）

存储了路由和页面名称的映射关系，便于进行路由管理。
⚠️ 注意：所有路由声明与路由跳转都应当收敛到 router-name-map.js 中 CR 需注意

#### Enhance Color

颜色增强工具函数，用于@krn/colors 没法 cover ui 场景的颜色进行增强。

⚠️ 注意：此处定义颜色前 一定要 先与 UI 进行沟通 新色或者该特殊场景 是否符合规范 原因 @krn/colors 主题配色已适配夜间模式等 ，EnhanceColors 需持续跟进。

### Pages

每个页面文件夹包含该页面特有的组件和逻辑。

跟单所有页面

#### Pages/\*\*

其他页面 （暂无）

