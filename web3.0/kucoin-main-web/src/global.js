/**
 * Owner: willen@kupotech.com
 */
// import RouterMiddleWare from 'utils/router/RouterMiddleWare';
import 'tools/sentry';
import 'requestidlecallback';
import { addLangToPath, WITHOOU_LANG_PATH } from 'tools/i18n';
// import { injectionYandex } from 'tools/injectionYandex';
// import { injectionTwitterAds } from 'tools/injectionTwitterAds';
// import ReactGA from 'react-ga';
import 'tools/bindRemoteEvents';
import { initQueryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import './global.less';

// 不需要语言子路径的
window.WITHOOU_LANG_PATH = WITHOOU_LANG_PATH;

// ReactGA.initialize('UA-46608064-1');

// init router register
// RouterMiddleWare.init();

// TODO 遇到访问量大的活动，在此处修改 id,开启缓存请求
// spotlight 活动的缓存判断
// if (window.location.pathname === '/activity/86') {
//   setOnCache(true);
// }

// require('utils/getRealIP');

// injectionYandex();
// injectionTwitterAds();

// window.open()链接带上url参数
const windowOpen = window.open;
window.open = (url = '', ...rest) => {
  if (!url) {
    return windowOpen(url, ...rest);
  }
  const urlWithLang = addLangToPath(url);
  return windowOpen(urlWithLang, ...rest);
};

// saveQueryParam2SessionStorage
initQueryPersistence();
