/**
 * Owner: willen@kupotech.com
 */
import { basename, currentLang } from '@kucoin-base/i18n';
import intl from 'react-intl-universal';
import { DEFAULT_LANG, DEFAULT_LOCALE, languages, allLanguages } from 'config/base';
import pathToRegexp from 'path-to-regexp';
import urlparser from 'urlparser';
import escapeHtml from 'escape-html';
import formatUrlWithLang from 'utils/formatUrlWithLang';
import { searchToJson } from 'helper';
import sentry from '@kc/sentry';
import { reportIntlMissing } from 'tools/sentry';

// 这里对错误进行主动上报

/**
 * 获取语言包对应本地化语言
 * @param key
 * @param variables
 * @returns {*}
 * @private
 */
export const _t = (key, variables = {}) => {
  try {
    const target = intl.get(key, { brandName: window._BRAND_NAME_, ...variables });
    if (!target) {
      reportIntlMissing(key);
    }
    return target.d(key);
  } catch (e) {
    console.warn('_t error', e);
    sentry.captureException(e);
    return key;
  }
};

/**
 * 获取html格式语言包对应本地化语言值
 * @param key
 * @param variables
 * @param escape
 * @returns {*}
 * @private
 */
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
      ...variables,
    });
    if (!target) {
      reportIntlMissing(key);
      return key;
    }
    return target.d(key);
  } catch (e) {
    console.warn('_tHTML error', e);
    sentry.captureException(e);
    return key;
  }
};

let localeBasename = basename.slice(1);

export const getLocaleBasename = () => localeBasename;

export const getLangFromLocaleMap = (locale) => {
  return window.__KC_LANGUAGES_BASE_MAP__.baseToLang[locale] || window._DEFAULT_LANG_;
};

export const getCurrentLangFromPath = () => {
  return currentLang;
};

export const getPathByLang = (lang) => {
  return window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
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
  const appConfirmLang = window.sessionStorage.getItem('appConfirmLang');
  if (
    isInApp &&
    (langByPath ||
      (!langByPath && langInQuery === window._DEFAULT_LANG_) ||
      appConfirmLang === 'yes')
  ) {
    window.sessionStorage.setItem('appConfirmLang', 'yes');
    return false;
  }
  return true;
};

export function getLocaleFromBrowser() {
  const lowerBrowserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  let lang = window._DEFAULT_LANG_;
  if (!lowerBrowserLang) return lang;
  if (lowerBrowserLang === 'zh-cn' || lowerBrowserLang === 'zh') {
    lang = 'zh_CN';
  } else if (lowerBrowserLang === 'zh-tw' || lowerBrowserLang === 'zh-hk') {
    lang = 'zh_HK';
  } else {
    const index = lowerBrowserLang.indexOf('-');
    const browserLang = index === -1 ? lowerBrowserLang : lowerBrowserLang.substring(0, index);
    if (browserLang === window._DEFAULT_LOCALE_) {
      lang = window._DEFAULT_LANG_;
    } else if (browserLang === 'zh') {
      lang = 'zh_CN';
    } else {
      lang = getLangFromLocaleMap(browserLang);
    }
  }
  return lang;
}
