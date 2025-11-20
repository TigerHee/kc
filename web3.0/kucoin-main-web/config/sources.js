const currentVersion = '2022-06-01';

const gbizLocal = process.env.GBIZ === 'local';

const kufoxMuiVersion = '2.5.14';

const reactFile =
  process.env.NODE_ENV === 'production' ? 'react.production.min.js' : 'react.development.js';

const reactDomFile =
  process.env.NODE_ENV === 'production'
    ? 'react-dom.production.min.js'
    : 'react-dom.development.js';

const reactReduxFile =
  process.env.NODE_ENV !== 'production' ? 'react-redux.js' : 'react-redux.min.js';

const axiosFile = process.env.NODE_ENV !== 'production' ? 'axios.js' : 'axios.min.js';

const kufoxMuiFile =
  process.env.NODE_ENV !== 'production' ? 'kufox-mui.umd.js' : 'kufox-mui.umd.min.js';

const kufoxMuiStyleSheetFile =
  process.env.NODE_ENV !== 'production' ? 'kufox-mui.umd.css' : 'kufox-mui.umd.min.css';

const systemjsFile = process.env.NODE_ENV !== 'production' ? 'system.js' : 'system.min.js';

const intranet =
  process.env.NODE_ENV === 'development' ||
  process.env.UMI_ENV === 'sit' ||
  process.env.BUILD_ENV === 'sit';

const timestamp = new Date().getTime();

export const kufoxMuiFontStyleSheet = intranet
  ? `https://assets-v2.kucoin.net/natasha/npm/@kufox/font/css.css?t=${timestamp}`
  : `https://assets.staticimg.com/natasha/npm/@kufox/font/css.css?t=${timestamp}`;

export const kufoxMuiLink = intranet
  ? `https://assets-v2.kucoin.net/natasha/npm/@kufox/mui@${kufoxMuiVersion}/umd/${kufoxMuiFile}`
  : `https://assets.staticimg.com/natasha/npm/@kufox/mui@${kufoxMuiVersion}/umd/${kufoxMuiFile}`;

export const kufoxMuiStyleSheet = intranet
  ? `https://assets-v2.kucoin.net/natasha/npm/@kufox/mui@${kufoxMuiVersion}/umd/${kufoxMuiStyleSheetFile}`
  : `https://assets.staticimg.com/natasha/npm/@kufox/mui@${kufoxMuiVersion}/umd/${kufoxMuiStyleSheetFile}`;

const commonStaticHost = intranet
  ? 'https://assets-v2.kucoin.net/common-statics'
  : 'https://assets3.staticimg.com';

const gbizLocalHost = gbizLocal
  ? 'http://localhost:5001/externals'
  : 'https://assets-v2.kucoin.net/g-biz/externals';

const muiHost = intranet ? gbizLocalHost : 'https://assets3.staticimg.com/externals';
const gbizHost = intranet ? gbizLocalHost : 'https://assets.staticimg.com/g-biz/externals';
console.log('gbiz', gbizLocalHost, gbizHost, gbizLocal)
export default [
  `${commonStaticHost}/react/17.0.2/${reactFile}`,
  `${commonStaticHost}/react-dom/17.0.2/${reactDomFile}`,
  `${commonStaticHost}/react-redux/7.2.3/${reactReduxFile}`,
  `${commonStaticHost}/axios/0.22.0/${axiosFile}`,
  `${commonStaticHost}/emotion/emotion-css/11.5.0/emotion-css.umd.min.js`,
  kufoxMuiLink,
  // 通过 system 异步加载 mui.[hash].js 会导致 App 组件必须是异步组件，
  // 由于 mui 相对稳定，也不需要动态更新，所以这里同步加载 mui 资源
  `${muiHost}/${gbizLocal ? 'mui.js' : 'mui.231b1a98.js'}`,
  `
    var script = document.getElementById('_gbiz_');
    if (script) {
      script.remove();
    }
    var d = Date.now();
    var timestamp = d - d % (60 * 1000);
    var script = document.createElement('script');
    script.id = '_gbiz_';
    script.type = 'systemjs-importmap';
    script.src = '${gbizHost}/import-map.${intranet ? 'sit' : 'prod'
  }.${currentVersion}.json?t=' + timestamp + '&__kcorigin=' + window.location.host;
    document.querySelector('head').append(script);
  `,
  `${commonStaticHost}/systemjs/6.12.1/${systemjsFile}`,
  `${commonStaticHost}/systemjs/6.12.1/extras/origin.js`,
  `
  System.set('app:react', { default: window.React, ...window.React });
  System.set('app:react-dom', { default: window.ReactDOM, ...window.ReactDOM });
  System.set('app:react-redux', window.ReactRedux);
  System.set('app:emotion-css', window.emotion);
  System.set('app:kufox-mui', window.$KufoxMui);
  `,
];
