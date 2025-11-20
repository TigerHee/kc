/**
 * Owner: iron@kupotech.com
 */
export const isElement = (obj) => {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === 'object' &&
      obj.nodeType === 1 &&
      typeof obj.style === 'object' &&
      typeof obj.ownerDocument === 'object'
    );
  }
};

export const isApp = () => window.navigator.userAgent.indexOf('KuCoin') > -1;

export const testUA = () => {
  const ua = window.navigator.userAgent;
  const isMobile = !!ua.match(/AppleWebKit.*Mobile.*/);
  const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
  const inKucoinApp = isApp();
  if (!isMobile) {
    return 'pcBrowser';
  }
  if (inKucoinApp && isAndroid) {
    return 'androidApp';
  }
  if (inKucoinApp && isIOS) {
    return 'iOSApp';
  }
  if (!inKucoinApp && isAndroid) {
    return 'androidBrowser';
  }
  if (!inKucoinApp && isIOS) {
    return 'iOSBrowser';
  }
  return 'pcBrowser';
};

// 判断数组是否是二维数组
export const isDeepArray = (arr) => {
  if (!Array.isArray(arr)) {
    return false;
  }
  if (arr.some((item) => Array.isArray(item))) {
    return true;
  }

  return false;
};

export function noop() {}

const LANGUAGE_PATHS = [
  'de',
  'en',
  'es',
  'fr',
  'ko',
  'nl',
  'pt',
  'ru',
  'tr',
  'vi',
  // 'zh-hans',
  'zh-hant',
  'it',
  'id',
  'ms',
  'hi',
  'th',
  'ja',
  'bn',
  'pl',
  'fil',
  'ar',
  'ur',
  'uk',
];
export function getKCLanguagePaths() {
  // eslint-disable-next-line no-underscore-dangle
  const baseMap = window.__KC_LANGUAGES_BASE_MAP__?.baseToLang || {};
  const langPaths = Object.keys(baseMap);
  return langPaths.length !== 0 ? langPaths : LANGUAGE_PATHS;
}
