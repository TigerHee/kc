/**
 * Owner: iron@kupotech.com
 */
import { indexOf } from 'lodash';
import remoteEvent from '@tools/remoteEvent';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { WITHOUT_QUERY_PARAM } from '../LearnHeader/config';

dayjs.extend(duration);

/**
 * 判断是否子账号
 */
export const checkIsSub = (obj = {}) => {
  const { isSub = false, type = 1 } = obj || {};
  return isSub || type === 3;
};

export const getScrollY = (parent = () => window) => {
  if (parent.pageYOffset !== undefined) {
    return parent.pageYOffset;
  }
  if (parent.scrollTop !== undefined) {
    return parent.scrollTop;
  }
  return (document.documentElement || document.body.parentNode || document.body).scrollTop;
};

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async (key, eventLevelVariables) => {
  // console.log('--埋点--', key, eventLevelVariables);
  if (!key) return;
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  if (typeof window.gio === 'function') {
    window.gio('track', key, eventLevelVariables);
  }
  // eslint-disable-next-line no-unused-expressions
  remoteEvent.emit(remoteEvent.evts.GET_REPORT, (Report) => {
    Report?.logAction(key, 'click');
  });
  // ReactGA.event({ category: key, action: 'click' }); // react-ga
};

export const compose = (spm = []) => {
  let spmId = '';
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (spm) {
      const siteId = sensors?.spm?.getSiteId();
      const pageId = sensors?.spm?.getPageId();
      if (siteId && pageId) {
        spmId = sensors?.spm?.compose(spm);
      }
    }
  });
  return spmId;
};

export const kcsensorsClick = (spm = [], data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (!spm) return;
    const { pagecate, ...rest } = data;
    sensors.trackClick(spm, { ...rest, pagecate: pagecate || 'topNavigation' });
  });
};

// 向url添加参数
const updateQueryStringParameter = (uri, key, value) => {
  if (!uri || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = indexOf(uri, '?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  }

  return `${uri}${separator}${key}=${value}`;
};

export const addLangToPath = (_href, lang) => {
  if (lang && _href && (_href.match(/^http?/) || _href.startsWith('/'))) {
    let base = '';
    if (lang === 'zh_HK') {
      base = 'zh-hant';
    } else if (lang === 'zh_CN') {
      base = 'zh-hans';
    } else {
      [base] = lang.split('_');
    }
    const { origin } = window.location;
    const _url = new URL(_href.match(/^https?/) ? _href : `${origin}${_href}`);
    // 不需要语言子路径的路由
    const withOutLangPath = window.WITHOOU_LANG_PATH || [];
    if (withOutLangPath && withOutLangPath.length) {
      const withOutLang = withOutLangPath.some((item) => {
        return _url.pathname === item;
      });
      if (withOutLang) {
        return _href;
      }
    }
    // 语言子路径项目的域名
    const hasLangPathDomain = window._LANG_DOMAIN_ || ['www.kucoin.'];
    const accord = hasLangPathDomain.some((item) => _url.hostname.startsWith(item));
    if (base && accord) {
      const homePage = _url.pathname && _url.pathname === `/${base}`;
      if (
        base !== (window._DEFAULT_LOCALE_ || 'en') &&
        !(_url.pathname && _url.pathname.startsWith(`/${base}/`)) &&
        !homePage
      ) {
        if (_url.pathname === '/') {
          _url.pathname = `/${base}`;
        } else {
          _url.pathname = `/${base}${_url.pathname}`;
        }
      }
      const urlWithPath = removeLangQuery(_url.toString());
      return urlWithPath;
    }
    return _href;
  }
  return _href;
};

export const removeLangQuery = (url = '') => {
  if (!url) {
    return url;
  }
  const langIndex = url.indexOf('lang=');
  if (langIndex !== -1) {
    const query = url.substr(url.indexOf('?') + 1);
    const queryArr = query.split('&') || [];
    if (queryArr && queryArr.length === 1) {
      if (queryArr[0].indexOf('lang=') === 0) {
        return url.substr(0, url.indexOf('?'));
      }
      return url;
    }
    let langQueryLen = 0;
    queryArr.forEach((item) => {
      if (item?.indexOf('lang=') === 0) {
        langQueryLen = item.length;
      }
    });
    // 有多个参数
    if (url[langIndex - 1] === '?') {
      return `${url.substr(0, url.indexOf('?') + 1)}${url.slice(url.indexOf('&') + 1)}`;
    }
    const delIndex = url.indexOf('&lang=');
    return `${url.substr(0, delIndex)}${url.substr(delIndex + langQueryLen + 1, url.length)}`;
  }
  return url;
};

// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms, currentLang) => {
  const spm = compose(spms);
  const href = currentLang ? addLangToPath(url, currentLang) : url; // 增加语言子路径
  if (!spm) return href;
  return updateQueryStringParameter(href, 'spm', spm);
};

// saveSpmQueryParam2SessionStorage
export const saveSpm2Storage = (url, spm, currentLang) => {
  if (!spm) {
    return;
  }
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (spm && sensors.spmStorage) {
      let _href = url;
      if (_href && _href.startsWith('/')) {
        _href = `${window.location.origin}${_href}`;
      }
      _href = addLangToPath(_href, currentLang);
      sensors.spmStorage.saveSpm2SessionStorage(_href, spm);
    }
  });
};

export const composeSpmAndSave = (url, spms, currentLang) => {
  const spm = compose(spms);
  if (spm && url && currentLang) {
    saveSpm2Storage(url, spm, currentLang);
  }
};

export const isSameOrigin = (menuUrl = '') => {
  if (!menuUrl) {
    return false;
  }
  const currentOrigin = window.location.origin;
  return menuUrl.startsWith('/') || menuUrl.startsWith(currentOrigin);
};

// 通域名的存储sessionstorage
// 不同域名，跳转链接带上query参数
export const spmSaveOrQuery = (e, menuUrl = '', menuSpm, currentLang) => {
  const isSame = isSameOrigin(menuUrl);
  if (!isSame) {
    const url = addSpmIntoQuery(
      queryPersistence.formatUrlWithStore(menuUrl, WITHOUT_QUERY_PARAM),
      menuSpm,
      currentLang,
    );
    const newWindow = window.open(url, '_blank');
    if (newWindow) newWindow.opener = null;
  } else {
    composeSpmAndSave(menuUrl, menuSpm, currentLang);
  }
};

// 判断SSG环境
export const isSSG = navigator.userAgent.indexOf('SSG_ENV') > -1;
// 判断 SSG mobile puppeteer 运行环境
export const isMobileSSG = navigator.userAgent.indexOf('SSG_MOBILE_ENV') > -1;

/**
 * SSG 环境不渲染
 *
 * @param fallback  定义当在ssg 环境运行时进行的渲染;
 */
export const NoSSG = ({ children, fallback = null }) => {
  if (isSSG) {
    return fallback;
  }
  return children;
};

export const checkIsInApp = () => {
  return window.navigator.userAgent.includes('KuCoin');
};

// 判断是否是IOS
export const isIOS = () => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

export const isSafari = () => {
  return (
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') === -1 &&
    navigator.userAgent.indexOf('FxiOS') === -1 &&
    navigator.userAgent.indexOf('Chrome') === -1
  );
};

export const isMobile = () => {
  const regMobile = /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo)/i;
  const regPad = /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?!\s.+?\smobile))/i;
  if (regMobile.test(navigator.userAgent) || regPad.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

export const isInApp = !!navigator.userAgent.match(/kucoin/gi);
