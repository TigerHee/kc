/**
 * Owner: jesse.shao@kupotech.com
 */
import 'utils/lib-flexible';
import Toast from 'src/components/$/CryptoCup/common/Toast/index.js';
import JsBridge from 'utils/jsBridge';
import intl from 'react-intl-universal';
import { v2ApiHosts } from 'config';
import { searchToJson } from 'helper';
import storage, { noPrefixSessionStorage } from 'utils/storage';
import initKunlun from './utils/kunlun';
import initSensorsReport from 'utils/kcsensors';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { v4 as uuidV4 } from 'uuid';
// import isMobile from 'utils/isMobile';
import some from 'lodash/some';
import forEach from 'lodash/forEach';
import bindRmoteEvents from './utils/bindRemoteEvents';
import { IS_PROD } from 'utils/env';
import { getSensorsABResult } from './utils/abTest';
import { kcsensorsManualExpose } from './utils/ga';

const onIdle = window.requestIdleCallback || window.requestAnimationFrame || window.setTimeout;

// init socket
// const isChrome = /chrome/i.test(navigator.userAgent || '');
// const useSlowFlush = /safari/i.test(navigator.userAgent || '') && !isChrome;
// if (useSlowFlush) {
//   console.log('use slow ws flush');
// }

// ws.setDelay(useSlowFlush ? 1000 : 200);
// @todo 检验下ios 价格订阅刷新不动的问题


if (typeof window.Intl === 'undefined') {
  window.Intl = require('intl');
}

export const dva = {
  config: {
    onError(err, dispatch) {
      if (err && typeof err.preventDefault === 'function') {
        err.preventDefault();
      }

      if (err.code && err.code === '401') {
        console.log('err:', err);
        dispatch({ type: 'user/update', payload: { user: null, isLogin: false } });
      } else {
        const msg = err.message || err.msg;
        if (msg) {
          // message.error(msg);
          // Toast({ msg, type: 'error' });
          Toast(msg);
        } else {
          console.log('err:', err);
        }
        // Raven.captureException(err);
      }

      const { response } = err;
      if (response) {
        switch (response.status) {
          case 401:
            dispatch({ type: 'user/update', payload: { user: null, isLogin: false } });
            return;
          default:
            break;
        }
      }
    },
  },
};

// 大数据埋点上报
const host = _DEV_ ? '' : window.location.origin;

// 设置clientId
let clientId = storage.getItem('clientId');
if (!clientId) {
  clientId = uuidV4();
  storage.setItem('clientId', clientId);
}

initKunlun();
initSensorsReport();

onIdle(() => {
  setTimeout(() => {
    init();
    import('@kc/socket').then(ws => {
      ws.setHost(v2ApiHosts.WEB);
      ws.setDelay(500);
    })
  }, 100);
  setTimeout(() => {
    System.import('@remote/compliance');
  }, 3000);
  resolveUTMSourceAndQueries();
})


// message.config({
//   top: 100,
//   duration: 30000,
//   maxCount: 1,
// });

// 初始化灰度
System.import('@remote/common-base').then(module => {
  if (!module || !module.xgrayCheck) return;
  module.xgrayCheck(['g-biz', 'landing-web']);
})

/*  the current environment is development and from a mobile device.  */
// if (process.env.NODE_ENV === 'development' && isMobile()) {
//   const VConsole = require('vconsole');
//   new VConsole();
// }

// const _BASE_ = '/land/';

window.addEventListener('controllerchange', () => {
  window.location.reload(true);
});



function init() {
  import('@kc/tdk').then(({ default: tdkManager }) => {
    tdkManager.init({
      host: v2ApiHosts.MAINSITE_API_HOST,
      brandName: window._BRAND_NAME_,
    });
  });
  import('@kc/report').then(({ default: Report }) => {
    // Report.useV2 并不是一个hooks，这里属于误报，所以关必该行的检查
    Report.useV2();
    Report.configure({
      host,
      api: '/_api/frontend-event-tracking/eventTracking',
      deviceInfo: _RELEASE_,
      channel: 'web',
      useSm: true,
      env: IS_PROD ? 'prod' : 'sit'
    });
    Report.setIDConfig(null, clientId);
  });
}

/**
 * 处理 utm_source 以及 r/rcode/code 参数问题，全局需要
 *
 * @return  {[type]}  [return description]
 */
function resolveUTMSourceAndQueries() {
  const { hash } = window.location;
  const searchQuery = searchToJson();
  // sessionstorage
  const rcode = queryPersistence.getPersistenceQuery('rcode');
  const utm_source = queryPersistence.getPersistenceQuery('utm_source');
  const utm_campaign = queryPersistence.getPersistenceQuery('utm_campaign');
  const utm_medium = queryPersistence.getPersistenceQuery('utm_medium');
  const queryPersiste = {
    rcode,
    utm_source,
    utm_campaign,
    utm_medium,
  };
  // abc=abc 是为了兼容无hash 的情况
  const hashQuery = searchToJson((hash || '').split('?')[1] || 'abc=abc');
  const queryAll = { ...hashQuery, ...searchQuery, ...queryPersiste };
  const utmFields = ['utm_source', 'utm_campaign', 'utm_medium'];
  const utmExist = some(utmFields, (v) => queryAll[v]);

  forEach([...utmFields, 'rcode', 'code'], (v) => {
    const res = queryAll[v];
    // utm有参数，但不全的时候，清除此次没有的参数
    if (!res && res !== 'rcode' && res !== 'code' && storage.getItem(v) && utmExist) {
      storage.removeItem(v);
    } else if (res) {
      storage.setItem(v, queryAll[v]);
    }
    // 参数存与sessionStorage 中,单次会话有效
    if (v) {
      noPrefixSessionStorage.setItem(v, res, { isPublic: true });
    }
  });
  // 兼容v1 邀请注册
  if (hashQuery.r) {
    noPrefixSessionStorage.setItem('rcode', hashQuery.r, { isPublic: true });
  }
}

// 项目启动时间
storage.setItem('landingOpenTime', Date.now());

function onLangPackLoad() {
  // 等待head中动态插入的语言包加载完毕后，初始化应用
  if (window._KC_LOCALE_DATA?.[window.initLang]) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    document.getElementById('langPack').onload = () => {
      resolve();
    };
  });
}

const loadLang = async () => {
  await onLangPackLoad();
  await intl.init({
    currentLocale: window.initLang,
    locales: _KC_LOCALE_DATA,
  });
  await bindRmoteEvents();
};

async function enableGoogleTranslateIfNeed() {
  try {
    const data = await getSensorsABResult({
      param_name: 'gtenable',
      default_value: 'old',
      value_type: 'String',
    });
    if (data !== 'new') return;

    const gtPolyfillUrl = 'https://assets.staticimg.com/natasha/npm/googleTranslatePollify/1.0.0/google-translate-pollify.min.js';
    const script = document.createElement('script');
    script.src = gtPolyfillUrl;
    script.async = true;
    script.onerror = () => {
      window.Sentry?.captureException?.(new Error(`Failed to load script: ${gtPolyfillUrl}`));
    };
    document.body.appendChild(script);

    const eventHandler = (msg) => {
      if (process.env.NODE_ENV === 'development') return;
      if (msg.detail && msg.detail.changeTo) {
        kcsensorsManualExpose({}, ['translateLang', msg.detail.changeTo]);
      }
    };
    window.addEventListener('translate_lang', eventHandler);
  } catch (e) {
    // do nothing
  }
}

export async function render(oldRender) {
  try {
    await loadLang();
    enableGoogleTranslateIfNeed();
  } catch (error) {}
  oldRender();
}
