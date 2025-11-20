const gbizLocale = process.env.GBIZ === 'local';

const currentVersion = '2022-06-01';

const kufoxMuiVersion = '2.5.6';

const reactFile =
  process.env.NODE_ENV === 'production' ? 'react.production.min.js' : 'react.development.js';

const reactDomFile =
  process.env.NODE_ENV === 'production'
    ? 'react-dom.production.min.js'
    : 'react-dom.development.js';

const reactReduxFile =
  process.env.NODE_ENV !== 'production' ? 'react-redux.js' : 'react-redux.min.js';

const systemjsFile = process.env.NODE_ENV === 'production' ? 'system.min.js' : 'system.js';

const kufoxMuiStyleSheetFile =
  process.env.NODE_ENV !== 'production' ? 'kufox-mui.umd.css' : 'kufox-mui.umd.min.css';

const intranet = process.env.NODE_ENV === 'development' || process.env.UMI_ENV === 'sit';

export const kufoxMuiFontStyleSheet = 'https://assets.staticimg.com/natasha/npm/@kufox/font/css.css';

export const kufoxMuiLink = `https://assets.staticimg.com/kufox-mui/${kufoxMuiVersion}/kufox-mui.umd.min.js`;

export const kufoxMuiStyleSheet = `https://assets.staticimg.com/kufox-mui/${kufoxMuiVersion}/${kufoxMuiStyleSheetFile}`;

export const commonStaticHost = 'https://assets.staticimg.com';

const gbizHost = gbizLocale
    ? 'http://localhost:5001/externals'
    : 'https://assets.staticimg.com/externals';

export default {
  reactSrc: `${commonStaticHost}/natasha/npm/react@17.0.2/umd/${reactFile}`,
  reactDomSrc: `${commonStaticHost}/natasha/npm/react-dom@17.0.2/umd/${reactDomFile}`,
  reactReduxSrc: `${commonStaticHost}/natasha/npm/react-redux@7.2.3/dist/${reactReduxFile}`,
  kufoxMuiLink,
  // 通过 system 异步加载 mui.[hash].js 会导致 App 组件必须是异步组件，
  customScript: `
  var script = document.getElementById('_gbiz_');
  if (script) {
    script.remove();
  }
  var d = Date.now();
  var timestamp = d - d % (60 * 1000);
  var script = document.createElement('script');
  script.id = '_gbiz_';
  script.type = 'systemjs-importmap';
  script.src = '${gbizHost}/import-map.${
    intranet ? 'sit' : 'prod'
  }.${currentVersion}.json?t=' + timestamp;
  document.querySelector('head').append(script);
`,
  systemjsSrc: `${commonStaticHost}/natasha/npm/systemjs@6.12.1/dist/${systemjsFile}`,
  customSystemLoad: `
    System.set('app:react', { default: window.React, ...window.React });
    System.set('app:react-dom', { default: window.ReactDOM, ...window.ReactDOM });
    System.set('app:react-redux', window.ReactRedux);
    System.set('app:kufox-mui', window.$KufoxMui);
  `,
};
