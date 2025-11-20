# landing-web

Responsive landing pages.


## For Developer

```
# install deps
yarn install

# dev开头的为开发本机开发环境
# site-sdb开头的为沙盒环境
# sit开头的为测试和联调环境
# site-cn开头的为国内站;
# 其他如site-kucoin为国际站
cp site-config.tpl.json site-config.json

# run dev
yarn dev
```

## 开发代理

```
https://gitlab.kucoin.net/kucoin-web/dev-proxy
```

## Config

Config file: `src/config.js`

## H5
因为本仓库里面有`pc` 和 `h5` 的代码，`h5`样式书写可以用 `style.m.less` 这种方式书写，会自动转化为 vw

## 币种名称显示 
有的币种currency和实际的展示币种名称不一样；比如 LOKI 展示应该是OXEN；所以请使用 src/hooks/useKuCurrency.js 这个方法来获取正确的实际的展示币种名称。 测试环境可以用 LOKI 和 ETH测试， 测试环境是 LOKI 展示为 OXEN； ETH 展示为 ETH_test

## 怎么跳转到App呢？
使用 onelink跳转；跳转的h5路径需要用encodeURIComponent转一次 例如 跳转路径为 
```
`kucoin:///link?url=${encodeURIComponent(`${LANDING_HOST_COM}/annual-report?loading=2&appNeedLang=true&dark=true&utm_source=2023annualBill&utm_medium=mail`)}`
```

使用 download页面跳转；跳转的h5路径需要用encodeURIComponent转一次 例如 跳转路径为 
```
`${KUCOIN_HOST}/download?jump_url=${encodeURIComponent(`${LANDING_HOST_COM}/annual-report?loading=2&appNeedLang=true&dark=true&utm_source=2023annualBill&utm_medium=mail` )}`
```

