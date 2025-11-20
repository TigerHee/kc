/**
 * Owner: iron@kupotech.com
 */
import { map, mapKeys, indexOf, isEqual, sortBy } from 'lodash';
import { toPercent } from '@utils/math';
import Big from 'bignumber.js';
import remoteEvent from '@tools/remoteEvent';
import { numberFormat as kuxNumberFormat } from '@kux/mui/utils';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import semver from 'semver';
import { WITHOUT_QUERY_PARAM } from '../Header/config';

dayjs.extend(duration);

export const getOtcVisible = (list, currentLang, currency) => {
  // 根据后台返回的语言列表限制是否显示otc 从外部传入
  const langList = map(list, (item) => item.typeCode) || [];
  if (langList.indexOf(currentLang) > -1) {
    if (currentLang === 'en_US' && ['IDR', 'VND', 'CNY'].indexOf(currency || '') < 0) {
      return false;
    }
    return true;
  }
  return false;
};

/**
 * @description 高精度乘法并取给定位数向下取整
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
// export const multiplyFloor = (a, b, decimal = 8, round = Decimal.ROUND_FLOOR) => {
//   return new Decimal(a).mul(b).toFixed(decimal, round);
// };

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
// export const numberFixed = (v, decimal, round = Decimal.ROUND_DOWN) => {
//   const numberV = +v;
//   if (typeof numberV !== 'number' || v === undefined) {
//     return v;
//   }
//   if (numberV === 0) {
//     return '0';
//   }
//   const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
//   return new Decimal(stringV).toFixed(decimal, round);
// };

/**
 * 合并组件的classes和传入的classes
 * @param {object} classes 组件本身定义的classes
 * @param {object} classesFromProps 传入的classes，组件使用者定义的类名集
 * @returns {string}
 */
export const mergeClasses = (classes, classesFromProps = {}) => {
  let result;
  const _classesFromProps = {};
  try {
    mapKeys(classesFromProps, (value, key) => {
      if (classes[key]) {
        _classesFromProps[key] = `${classes[key]} ${classesFromProps[key]}`;
      }
    });
    result = { ...classes, ..._classesFromProps };
  } catch (e) {
    result = classes || {};
  }
  return result;
};

/**
 * 转换成百分比
 * @param {*} num
 */
// export const floadToPercent = (num) => {
//   // console.log('floadToPercent', num);
//   if (typeof +num !== 'number' || Number.isNaN(+num)) {
//     return num;
//   }
//   return `${new Decimal(+num).mul(100).toFixed()}%`;
// };

export const resolveFee = (num, isDiscount, discountRate = 80, lang) => {
  if (+num > 0) {
    return toPercent(
      isDiscount ? new Big(num).multipliedBy(new Big(discountRate || 100).dividedBy(100)) : num,
      lang,
    );
  }
  return toPercent(num, lang);
};

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

/**
 * 获取携带相关属性的node节点
 *
 * @param {HTMLNode} node node节点
 * @param {string} attr 查询的属性
 */
export const getGaElement = (node, attr) => {
  if (!node || node.localName === 'body') {
    return null;
  }
  const key = node.getAttribute(attr);
  if (key) {
    return node;
  }

  if (!node.parentNode) {
    return null;
  }

  return getGaElement(node.parentNode, attr);
};

/**
 * 新版本自定义点击埋点
 */
export const gaClickNew = async (key, obj) => {
  if (!key) return;
  const { siteid, pageid, modid, eleid, ...other } = obj || {};
  ga(key, {
    ...other,
    str1: siteid,
    str2: `${siteid}.${pageid}`,
    str3: `${siteid}.${pageid}.${modid}`,
    str4: `${siteid}.${pageid}.${modid}.${eleid}`,
  });
};

export const getMenuSpm = (index = 0, subIndex = 0) => {
  return [`Header${index + 1}`, String(subIndex + 1)];
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

export const kcsensorsManualTrack = (menuSpm, params = {}, type = 'expose') => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (!menuSpm) return;
    // kcsensors spm 模块
    const { pagecate, ...rest } = params;
    const pageId = sensors?.spm?.getPageId?.();
    const exposeCfg = {
      spm_id: sensors?.spm?.compose(menuSpm),
      page_id: pageId,
      ...rest,
      pagecate: pagecate || 'topNavigation',
    };
    sensors.track(type, exposeCfg);
  });
};

export const kcsensorsMenuClick = (menuSpm, params = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (!menuSpm) return;
    const { pagecate, ...rest } = params;
    sensors.trackClick(menuSpm, { ...rest, pagecate: pagecate || 'topNavigation' });
  });
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
    const base = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
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
    const isInnet = _url.hostname.endsWith('kucoin.net');
    if (base && (accord || isInnet)) {
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

export const Event = {};

Event.addHandler = window.addEventListener
  ? (target, type, handler, capture) => {
      target.addEventListener(type, handler, capture || false);
    }
  : (target, type, handler) => {
      target.attachEvent(`on${type}`, handler);
    };

Event.removeHandler = window.removeEventListener
  ? (target, type, handler, capture) => {
      target.removeEventListener(type, handler, capture || false);
    }
  : (target, type, handler) => {
      target.detachEvent(`on${type}`, handler);
    };

Event.triggerEvent = (target, type) => {
  if (document.createEvent) {
    const eventMp = {
      HTMLEvents: [
        'abort',
        'blur',
        'change',
        'error',
        'focus',
        'load',
        'reset',
        'resize',
        'scroll',
        'select',
        'submit',
        'unload',
      ],
      UIEvents: ['DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'keydown', 'keypress', 'keyup'],
      MouseEvents: ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'],
      MutationEvents: [
        'DOMAttrModified',
        'DOMNodeInserted',
        'DOMNodeRemoved',
        'DOMCharacterDataModified',
        'DOMNodeInsertedIntoDocument',
        'DOMNodeRemovedFromDocument',
        'DOMSubtreeModified',
      ],
    };
    let eventKey = null;
    map(eventMp, (types, key) => {
      if (indexOf(types, type) > -1) {
        eventKey = key;
        return false;
      }
    });

    if (!eventKey) {
      throw new TypeError('Unknown EventType.');
    }

    const event = document.createEvent(eventKey);
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
  } else if (document.createEventObject) {
    target.fireEvent(`on${type}`);
  }
};

/**
 * 缓存币种精度
 */
const precisionMap = {};
export const precision = (coin, precision = null) => {
  if (typeof precision !== 'number') {
    return precisionMap[coin];
  }
  precisionMap[coin] = precision;
  return precision;
};

export const allprecisionMap = () => {
  return precisionMap;
};

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
export const numberFixed = (v, decimal, round = Big.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Big(stringV).toFixed(decimal, round);
};

export const createDecimals = (decimalPrecision) => {
  const maxDecimalPrecision = 10;
  const decimals = [];
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      // eslint-disable-next-line no-restricted-properties
      group: Math.pow(10, maxDecimalPrecision - decimalPrecision),
    });
    decimalPrecision -= 1;
  }

  return decimals;
};

/**
 * 增加千分位分隔符
 * @param n
 * @returns {string}
 */
const SeparateNumberPool = {
  pool: Object.create(null),
  poolCount: 0,
  has(k) {
    return !!this.pool[k];
  },
  get(k) {
    return this.pool[k];
  },
  set(k, v) {
    if (this.poolCount > 100000) {
      // 清理缓存
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};
export const separateNumber = (n) => {
  if (typeof +n !== 'number') {
    return n;
  }
  const num = `${n}`;

  if (SeparateNumberPool.has(num)) {
    return SeparateNumberPool.get(num);
  }
  if (!/^[0-9.]+$/.test(num)) {
    return n;
  }

  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    [integer, floater] = arr;
  }
  const len = integer.length;
  let parser = '';
  if (len > 3) {
    let count = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      parser = integer[i] + parser;
      count += 1;
      if (count % 3 === 0 && i > 0) {
        parser = `,${parser}`;
      }
    }
  } else {
    parser = integer;
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  const r = `${parser}${floater}`;
  SeparateNumberPool.set(num, r);

  return r;
};

/**
 * @decription 高精度减法
 */
export const sub = (a, b) => {
  return new Big(a).minus(b);
};

/**
 * 高精度除法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divide = (a, b, decimal = 8, round = Big.ROUND_HALF_UP) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  return new Big(a).div(b).toFixed(decimal, round);
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

export const isChrome = () => {
  return (
    navigator.userAgent.indexOf('Chrome') !== -1 ||
    (/CriOS/i.test(navigator.userAgent) && /iphone|ipod|ipad/i.test(navigator.userAgent))
  );
};

// 判断是否在桌面
export const checkIfIsStandAlone = () => {
  return navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
};

// 计算距离之前已经有多长时间
export const hasBeenALongTime = (time) => {
  const t = dayjs.duration(dayjs().diff(dayjs(time)));
  return t.asDays();
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

// IOS上的chrome，必须IOS版本>= 16.4 才支持pwa
export const isIOSSupportPWA = () => {
  try {
    if (!isIOS() || !isMobile()) return false;
    const { userAgent } = navigator;
    let iOSversion;
    if (userAgent.indexOf('OS ') > -1) {
      const iOSVersionInfo = userAgent.split('OS ');
      // eslint-disable-next-line prefer-destructuring
      iOSversion = iOSVersionInfo[1].split(' ')[0];
      iOSversion = iOSversion.replace(/_/g, '.');
    }
    if (semver.valid(iOSversion)) {
      return semver.gte(iOSversion, '16.4.0');
    }
    if (isChrome()) {
      return semver.gte(`${iOSversion}.0`, '16.4.0');
    }
    return false;
  } catch (e) {
    console.info('e:', e);
    return false;
  }
};

// 判断是否是Edge浏览器
export const isEdge = () => {
  const { userAgent } = window.navigator;
  // Edge on Chromium (Edge v79 and later)
  const isEdgeChromium = userAgent.indexOf('Edg/') > -1;
  // Legacy Edge (EdgeHTML, Edge v18 and earlier)
  const isEdgeHTML = userAgent.indexOf('Edge/') > -1;
  return isEdgeChromium || isEdgeHTML;
};

// 通过检测Brave浏览器的特定功能来更可靠地判断用户是否在使用Brave,比userAgent可靠
export const isBrave = async () => {
  if (navigator?.brave) {
    const result = await navigator.brave?.isBrave();
    return result;
  }
  return false;
};

// 判断两个数组是否一致，不考虑数组内元素的顺序
export const isEqualUnordered = (arr1, arr2) => {
  return isEqual(sortBy(arr1), sortBy(arr2));
};

export const raf =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function(fn) {
    return window.setTimeout(fn, 16);
  };

export function extractRelativePath(href) {
  try {
    // 如果是绝对路径，提取 pathname
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const match = href.match(/https?:\/\/[^/]+(\/[^?#]*)/);
      return match ? match[1] : '/'; // 没有路径时返回根路径
    }
    // 如果是相对路径，去掉查询参数部分
    return href.split('?')[0];
  } catch (error) {
    console.error('extractRelativePath Invalid href:', error);
    return href;
  }
}

/**
 * 格式化数字，支持语言
 * @param numString
 * @param lang
 * @returns {string}
 */
export function formatLangNumber(numString, lang, options = {}) {
  const number = +numString;
  if (typeof number !== 'number') {
    return numString;
  }

  return kuxNumberFormat({
    number,
    lang,
    options,
  });
}

// token地址缩写
export function shortenAddress(address) {
  if (!address) {
    return '--';
  }
  // 检查输入是否为字符串，并且长度足够
  if (typeof address !== 'string' || address.length <= 10) {
    return address; // 如果字符串太短，则直接返回原字符串
  }
  // 截取前6位和后4位
  const prefix = address.slice(0, 6);
  const suffix = address.slice(-4);
  // 拼接结果
  return `${prefix}....${suffix}`;
}
