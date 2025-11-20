# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```

## Migrate from next-web

- `_t`, `_tHTML` 函数从tools/i18n中导出, 废弃以前的withLocale高阶。
- `currentLang` 不再存在app模型中。分两种情况获取。
  1. 组件中获取。使用`useLocale` hook 或者 `injectLocale` 高阶。两者从 components/LoadLocale 导出
  2. 其它地方获取。使用`intl.options.currentLocale`
- `fetch` 从tools/fetch中导出
- 作为 extend 的 model 从 models/common 迁移到 common/models
- `noSSRHoc(() => import('xxx'))` 改为 `noSSRHoc(() => import('xxx'))`
- connect, useDispatch, useSelector 改为从 umi 导出

## fork from kucoin-main-web
  只保留 /、/news 、 /download 模块，其余模块依旧存在 ```kucoin-main-web```
# ⚠️注意， 该项目一旦有路由变化，切记上线前告知运维，并在审批中说明

### 翻译
neeko lokalise -m
