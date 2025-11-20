
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

### 国际化

- [安装@kc/neeko国际化cli](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/17146069/kc+neeko+cli)
- [@kc/neeko@2.0.0版本的使用方法](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/209848109/kc+neeko+2.0.0)

#### 使用

```bash
neeko lokalise -m # 拉取多语言
```
