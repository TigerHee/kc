// gbiz-next 胶水层 
// import { matchPath } from 'react-router-dom';

const defaultLang = window._DEFAULT_LANG_ || 'en_US';
const defaultLocale = window._DEFAULT_LOCALE_;

export const getLangFromBase = (base) => {
  const baseMap = window.__KC_LANGUAGES_BASE_MAP__ || {};
  if (baseMap.baseToLang) {
    return baseMap.baseToLang[base] || defaultLang;
  }
  return defaultLang;
};

// export const getCurrentLang = () => {
//   const ret = matchPath(window.location.pathname, {
//     path: '/:lng',
//     exact: false,
//     strict: false,
//   });
//   // 默认语言首页
//   if (!ret) {
//     return defaultLang;
//   }
//   // 语言子路径匹配命中或者不带语言子路径非首页
//   const currentLang = getLangFromBase(ret.params.lng);
//   return currentLang;
// };

export const getCurrentLang = () => {
  let hasLocaleInPath = false;
  // 检查 url 第一个路径是否是语言
  const pathArr = location.pathname.split("/").filter(Boolean);
  const firstFragment = pathArr[0];
  if (firstFragment) {
    if (window.__KC_LANGUAGES_BASE_MAP__.baseToLang[firstFragment]) {
      hasLocaleInPath = true;
    }
  }
  // 默认语言首页
  if (!hasLocaleInPath) {
    return defaultLang;
  }
  // 语言子路径匹配命中或者不带语言子路径非首页
  const currentLang = getLangFromBase(firstFragment);
  return currentLang;
};

export const getAllLocaleMap = () => {
  return window.__KC_LANGUAGES_BASE_MAP__.langToBase;
};

/**
 * 从 URL 上推断当前 locale
 */
export function getCurrentLocalePath() {
  if (typeof window === 'undefined') return undefined;
  const basename = window.location.pathname.split('/')[1];
  return window.__KC_LANGUAGES_BASE_MAP__.baseToLang[basename] ? basename : '';
}

/**
 * 当前的 basename (/ja)
 */
export function getCurrentBaseName() {
  const currentBasename = getCurrentLocalePath();
  return currentBasename ? `/${currentBasename}` : '';
}

export function getCurrentLocale() {
  return getCurrentLocalePath();
}

/**
 * 将 lang 转成 locale，例如 en_US => en
 */
export function langToLocale(lang) {
  return getAllLocaleMap()[lang] || defaultLocale;
}

export function changeLocale(locale) {
  history.pushState({}, '', `${locale}${window.location.pathname}`);
}

export function getDefaultLocale() {
  return defaultLocale;
}

export function getSupportedLocales() {
  return getAllLocaleMap();
}

