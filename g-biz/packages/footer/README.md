# `@kc/footer`

> TODO: description

## Usage

```
const footer = require('@kc/footer');

// TODO: DEMONSTRATE API
```

### MenuItem Config

```
MENU_ITEMS = [
  {
    key: '', // menuItem key
    title: '',
    url: '',
    items: [ //  可为空， items 与 groupItems 不能同时存在
      {
        key: '',
        title: '',
        subTitle: '',
        mark: '',
        icon: '',
        url: '',
      },
    ],
    groupItems: [ //  可为空， items 与 groupItems 不能同时存在
      {
        groupTitle: '',
        items: [
          {
            key: '',
            title: '',
            subTitle: '',
            mark: '',
            icon: '',
            url: '',
          },
        ],
      },
    ],
  },
];
```

```
host:
    KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST, // 交易地址
    DOCS_HOST, // 文档地址
    KUMEX_HOST, // kumex地址
    SANDBOX_HOST, // 沙盒地址
    POOLX_HOST, // pool-x地址
```