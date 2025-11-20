import { matchPath } from 'react-router-dom';

const defaultLang = window._DEFAULT_LANG_ || 'en_US';
// const defaultLocale = window._DEFAULT_LOCALE_ || 'en';

export const getLangFromBase = (base) => {
  const baseMap = window.__KC_LANGUAGES_BASE_MAP__ || {};
  if (baseMap.baseToLang) {
    return baseMap.baseToLang[base] || defaultLang;
  }
  return defaultLang;
}
export const getBaseFromLang = (lang) => {
  const baseMap = window.__KC_LANGUAGES_BASE_MAP__ || {};
  if (baseMap.langToBase) {
    return baseMap.langToBase[lang] || '';
  }
  return '';
}

const RTLLangs = ['ar_AE', 'ur_PK'];
export const isRTLLanguage = (lang) => RTLLangs.includes(lang);

export const getCurrentLang = () => {
  const ret = matchPath(window.location.pathname, {
    path: '/:lng',
    exact: false,
    strict: false,
  });
  // 默认语言首页
  if (!ret) {
    return defaultLang;
  }
  // 语言子路径匹配命中或者不带语言子路径非首页
  const currentLang = getLangFromBase(ret.params.lng);
  return currentLang;
}

export const getNextLocation = (currentBasename, nextLang) => {
  const nextLangBase = getBaseFromLang(nextLang);
  const nextLocation = new URL(location.href);
  if (currentBasename) {
    // 当前是非默认语言切换其他语言
    const nextBasename = nextLangBase && `/${nextLangBase}`;
    // nextBasename 为 ‘’ 时切换为默认语言，否则切换为其他非默认语言
    nextLocation.pathname = nextLocation.pathname.replace(currentBasename, nextBasename);
  } else if (nextLangBase) {
    // 当前是默认语言切换其他非默认语言
    nextLocation.pathname = `/${nextLangBase}${nextLocation.pathname}`;
  }

  if (nextLocation.searchParams.has('lang')) {
    nextLocation.searchParams.delete('lang');
  }

  if (nextLocation.pathname.endsWith('/')) {
    nextLocation.pathname = nextLocation.pathname.slice(0, -1);
  }

  return nextLocation.toString();
}
