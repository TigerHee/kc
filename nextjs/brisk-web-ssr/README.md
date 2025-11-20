## 项目说明

- 更新.neeko.config.js 国际化文件替换, 变量统一为`{}`定义

## Getting Started

```bash
"node": "22.14.0"
```

```bash
# 所有命令说明
dev # 开发环境运行SSR 模式
dev:spa # 开发环境下运行 SPA 模式 和 next dev 不能同时开启
build # kc-next 会依赖的 next build
build:analyze # webpack 构建分析
build:ssr # 构建 SSR 版本 默认开启debug
build:spa # 构建 SPA 版本
build:all # 同时构建 SSR 和 SPA 版本，用于 CI/CD

# 运行
yarn dev
```

打开 http://localhost:3000 在浏览器中查看结果

## 目录结构约定（重要）

```bash
src/
├── app.ts                       # 自定义 全局配置 入口
├── tenant.ts                    # 多站点租户配置
├── instrumentation.ts           # Next.js instrumentation 服务端数据采集
├── instrumentation-client.ts    # 客户端专属数据采集
├── components/                  # 业务组件目录
├── config/                       # 配置相关内容等
├── core/                        # 全局能力模块注册与实现
├── hooks/                       # 通用 React hooks
├── pages/                       # Next.js 页面路由目录
├── routers/                     # 路由具体业务组件
├── api/                         # 数据请求与接口管理 api-generator 生成接口
├── store/                       # 状态管理（结合 zustand）
├── styles/                      # 样式相关（global.scss / mixin.scss 等）
├── tools/                       # 工具方法封装
└── types/                       # 全局TypeScript 类型定义
```

## 合规模块

> 接入合规能力、展业中台能力等

## 默认集成模块

- 全局：kc-next 各类能力
- 全局基础数据：user(csrf 等关键逻辑)
- 数据上报：Sentry
- kunlun，后续会接入链路日志
- 设备指纹：report
- 神策：Sensor
- 多语言：i18n
- 翻译：neeko
- [OneTrust 能力](./docs/modules/onetrust-module.md)
- 代码规范：eslint 9.x
- 组件库：@kux/design、@kux/icons
- 存储：@kc/storage(gbiz-next|gbiz)
- 请求库：@kc/request(gbiz-next|gbiz)
- SEO 信息配置：TDK(可根据情况删除)
- 单测：jest(如果想使用 vitest 请发起技术评审，尽量保持技术一致性)

---

## 全局能力模块体系（core）

本项目对所有全局能力进行统一管理和注册，所有能力均实现为独立的 module，具备如下优势：

- **高内聚、低耦合**：每个能力独立实现，互不影响，易于维护和扩展。
- **可插拔**：只需在 `enabledModules` 中注册即可按需启用/关闭能力。
- **统一生命周期**：所有能力支持统一的初始化、销毁等生命周期管理。
- **环境隔离**：每个能力可根据运行环境（客户端/服务端）自动判断是否执行。

### 已集成的能力模块

| 模块名            | 说明                                                                |
| ----------------- | ------------------------------------------------------------------- |
| telemetry         | 神策埋点能力，自动初始化全局埋点，设备指纹/链路日志能力（仅客户端） |
| xgray             | 灰度染色能力，根据环境自动进行页面灰度处理（仅客户端）              |
| onetrust          | OneTrust 合规能力，自动注入合规脚本（仅客户端）                     |
| baseRestrict      | 权限/ip限制，自动初始化基础权限校验（仅客户端）                     |
| queryPersistence  | Query 持久化能力，自动初始化全局查询参数持久化（仅客户端）          |
| clientGlobals     | 客户端全局windows方法注入与配置初始化（仅客户端）                   |
| fetchInterceptor  | 服务端 fetch 拦截能力，自动增强服务端 fetch（仅服务端）             |
| performanceMetric | kc/performance 性能数据上报（仅客户端）                             |
| serviceWorker     | 注册serviceWorker（仅客户端）                                       |

> 你可以在 `src/core/index.ts` 中查看和维护所有能力模块的注册。

### 能力模块开发规范

每个能力模块需实现如下接口：

```typescript
export interface IAppModule {
  name: string;
  init: (context?: AppContext) => void;
  destroy?: () => void;
}
```

- **init**：初始化能力，支持按需传递 context。
- **destroy**（可选）：销毁能力，做清理工作。

### 如何扩展/接入新能力

- [KRNBridge](./docs/krn-bridge.md) H5 in App 需要
- [Mock 能力](./docs/mock.md) mock 数据调试，也可以考虑走 api handler 代理
- [Socket 能力](./docs/socket.md) 集成 websocket 能力，做实时应用
- [service worker 能力](./docs/service-worker.md) 离线应用能力

1. 在 `src/core/` 下新建能力模块文件，实现 `IAppModule` 接口。
2. 在 `src/core/index.ts` 中注册新模块到 `enabledModules`。
3. 在 应用启动时自动初始化。

---

## 可选集成模块

- [Header](./docs/modules/header-module.md)
- [Footer](./docs/modules/footer-module.md)
- [全局用户迁移弹框](./docs/modules/site-redirect-module.md)
- [全局合规顶飘](./docs/modules/restrict-notice-module.md)
- [GoogleTag](./docs/modules/google-tag-module.md)

## 全局状态数据（重要）

```typescript jsx
// 用户信息
useUserStore();

// 币种信息
TODO;

// 汇率信息
TODO;

// 价格信息
TODO;
```

## 可选库

- 日期：dayjs
- 大数：big.js
- 请求控制：react-query
- 类型校验：zod、yup

## 禁用库

- lodash（如果有特别需要使用 lodash-es，尽量不走构建时间）
- decimal.js（先不管依赖）
