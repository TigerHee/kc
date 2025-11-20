## 人机校验公共组建

#### kucoin-main-web 引入

```js
import systemDynamic from 'utils/systemDynamic';

const Captcha = systemDynamic('@remote/captcha', 'Captcha');
```

#### public-web 引入

```js
// config/config.js 配置动态下发路径
memo.externals([
  {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    'react-redux': 'window.ReactRedux',
    '@remote/download': 'window.$KcRemoteApp.packages.downloadBanner',
    '@remote/captcha': 'window.$KcRemoteApp.packages.captcha',
  },
]);

// 使用的js文件
import dynamic from 'utils/dynamic';
const Captcha = dynamic('@remote/captcha', 'Captcha');
```

```js
//本地调试时 需要将 config/sources.js 的 gbizHost z为本地的g-biz 路径 使用yarn start:gbiz:local 启动

``` 
