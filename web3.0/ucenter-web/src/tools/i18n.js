/**
 * Owner: willen@kupotech.com
 */
import sentry from '@kc/sentry';
import { basename, currentLang } from '@kucoin-base/i18n';
import { allLanguages, DEFAULT_LANG, DEFAULT_LOCALE, languages } from 'config/base';
import escapeHtml from 'escape-html';
import _ from 'lodash';
import intl from 'react-intl-universal';
import { reportIntlMissing } from 'tools/sentry';
import urlparser from 'urlparser';
import formatUrlWithLang from 'utils/formatUrlWithLang';
import searchToJson from 'utils/searchToJson';
import sessionStorage from 'utils/sessionStorage';

/**
 * 获取语言包对应本地化语言
 * @param key
 * @param variables
 * @returns {*}
 * @private
 */
export const _t = (key, variables) => {
  try {
    const params = {};
    if (variables) {
      Object.keys(variables).forEach((key) => {
        const value = variables[key];
        // 修复value=0时，为空字符串问题
        if (value === 0) {
          params[key] = '0';
        } else {
          params[key] = value;
        }
      });
    }
    const target = intl.get(key, {
      brandName: window._BRAND_NAME_,
      siteBaseCurrency: window._BASE_CURRENCY_ || 'USDT',
      ...params,
    });
    if (!target) reportIntlMissing(key);
    return target.d(key);
  } catch (e) {
    sentry.captureException(e);
    return key;
  }
};

export const _tHTML = (key, variables, escape = true) => {
  try {
    if (variables) {
      for (const k in variables) {
        if (variables[k] === 0) {
          variables[k] = '0';
        } else if (escape) {
          variables[k] = escapeHtml(variables[k]);
        }
      }
    }
    const target = intl.getHTML(key, {
      brandName: window._BRAND_NAME_,
      siteBaseCurrency: window._BASE_CURRENCY_ || 'USDT',
      ...variables,
    });
    if (!target) reportIntlMissing(key);
    return target.d(key);
  } catch (e) {
    sentry.captureException(e);
    return key;
  }
};

const allLocaleMap = _.reduce(
  allLanguages,
  (acc, lang) => {
    const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
    acc[lang] = value;
    return acc;
  },
  {},
);

const localeMap = _.reduce(
  languages,
  (acc, lang) => {
    const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
    acc[lang] = value;
    return acc;
  },
  {},
);

let localeBasename = basename.slice(1);

export const getLocaleBasename = () => localeBasename;

export const getLangFromLocaleMap = (locale) => {
  if (!locale) {
    return DEFAULT_LANG;
  }
  const currentLang = _.findKey(allLocaleMap, (o) => o === locale);
  // 没找到的话返回 default en
  return currentLang || DEFAULT_LANG;
};

export const getCurrentLangFromPath = () => {
  return currentLang;
};

export const getLocaleFromLocaleMap = (lang) => {
  if (!lang) {
    return DEFAULT_LOCALE;
  }
  const currentLocale = _.get(localeMap, lang);

  return currentLocale || DEFAULT_LOCALE;
};

//app 进入web界面：
// 1: 如果链接带有语言子路径，语言由语言子路径确定，不跳转。
// 2: 英文比较特殊(没有语言子路径)，那如果英文链接带上?lang=en_US, 不跳转。
// 3: 否则按照语言顺序判断语言，再进行跳转：用户数据，?lang参数，语言子路径，本地存储，浏览器语言。
// app进入web界面，可以通过带上语言子路径避免跳转一次。
export const needConfirmLang = () => {
  const { userAgent } = window.navigator;
  const isInApp = userAgent.includes('KuCoin');
  const langByPath = getLocaleBasename();
  const langInQuery = searchToJson()?.lang;
  const appConfirmLang = sessionStorage.getItem('appConfirmLang');
  if (
    isInApp &&
    (langByPath ||
      (!langByPath && langInQuery === window._DEFAULT_LANG_) ||
      appConfirmLang === 'yes')
  ) {
    sessionStorage.setItem('appConfirmLang', 'yes');
    return false;
  }
  return true;
};

// 去掉当前窗口链接的query.lang的参数
export function deleteLangQuery(url = '') {
  if (!url) {
    return url;
  }

  url = new URL(url, window.location.origin);

  if (url.searchParams.has('lang')) {
    url.searchParams.delete('lang');
  }
  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

export const getPathByLang = (lang) => {
  return localeMap[lang] || window._DEFAULT_LOCALE_;
};

// 不需要语言子路径的链接
export const WITHOOU_LANG_PATH = ['/rss/news', '/cert'];
// 语言子路径的域名

const withOutLangPath = WITHOOU_LANG_PATH.map((item) => item.substring(1));
// 增加语言子路径
export const addLangToPath = (url = '') => {
  if (!url) {
    return url;
  }
  // 是语言子路径的项目
  const langDomains = window._LANG_DOMAIN_ || [];
  if (url.startsWith('http') || url.startsWith('/')) {
    const urlLocation = urlparser.parse(url);
    if (urlLocation?.path?.base) {
      const withOutLang = withOutLangPath.some((item) => {
        return urlLocation?.path?.base === item;
      });
      // 内链，不需要语言子路径的
      if (withOutLang) {
        return urlLocation?.query?.params?.lang ? url : formatUrlWithLang(url);
      }
    }
    if (urlLocation?.host?.hostname) {
      const isLangDomain = langDomains.some((item) => urlLocation.host.hostname.startsWith(item));
      const isInnet = urlLocation.host.hostname.endsWith('kucoin.net');
      // 外链
      if (!isLangDomain && !isInnet) {
        return url;
      }
    }
    if (localeBasename && urlLocation) {
      if (urlLocation.path) {
        const homePage = urlLocation.path?.base === localeBasename;
        if (urlLocation.path?.base?.startsWith(`${localeBasename}/`) || homePage) {
          return url;
        }
        urlLocation.path.base = `${localeBasename}/${urlLocation.path.base}`;
      } else {
        urlLocation.path = { base: localeBasename };
      }
    }
    if (!localeBasename) {
      return url;
    }
    return urlLocation.toString();
  }
  return url;
};

export function getLocaleFromBrowser() {
  const browserLang = navigator.language || navigator.userLanguage;
  const lowerBrowserLang = browserLang && browserLang.toLowerCase();
  let lang;
  if (lowerBrowserLang === 'zh-cn' || lowerBrowserLang === 'zh') {
    lang = 'zh_CN';
  } else if (lowerBrowserLang === 'zh-tw' || lowerBrowserLang === 'zh-hk') {
    lang = 'zh_HK';
  } else {
    let index = lowerBrowserLang.indexOf('-');
    let browser = index === -1 ? lowerBrowserLang : lowerBrowserLang.substring(0, index);
    if (browser === 'en') {
      lang = 'en_US';
    } else if (browser === 'zh') {
      lang = 'zh_CN';
    } else {
      const hasItem = Object.entries(allLocaleMap).find(([key, val]) => {
        return val === browser;
      });
      if (hasItem) {
        lang = hasItem[0];
      }
    }
  }
  return lang;
}
const localeMapCache = {};
export const getAllLocaleMap = () => {
  if (!localeMapCache.allLocaleMap) {
    localeMapCache.allLocaleMap = allLanguages.reduce((acc, lang) => {
      const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
      acc[lang] = value;
      return acc;
    }, {});
  }

  return localeMapCache.allLocaleMap;
};
