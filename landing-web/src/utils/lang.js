/**
 * Owner: jesse.shao@kupotech.com
 */

import intl from 'react-intl-universal';
import urlparser from 'urlparser';
import escapeHtml from 'escape-html';
import formatUrlWithLang from 'utils/formatUrlWithLang';
import { LANG_DOMAIN, getLocalBase } from 'config';
import { searchToJson, setHTMLLang } from 'helper';
import { reportIntlMissing } from 'utils/sentry';
import { kucoinStorage, noPrefixSessionStorage } from 'utils/storage';
import { matchPath } from 'react-router-dom';

/** 当前语言逻辑 start
 *  借鉴的kucoin-base-web的，不用老是依赖去store里面拿语言
 */
const defaultLang = window._DEFAULT_LANG_;

export const supportedLngs = window.__KC_LANGUAGES__.__ALL__.map((lng) => {
  const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lng] || window._DEFAULT_LOCALE_;
  return [lng, value];
});

function getSupportedLng() {
  const ret = matchPath(window.location.pathname, {
    path: '/:lng',
    exact: false,
    strict: false,
  });

  if (!ret) {
    return null;
  }

  const supportedLng = supportedLngs.find((item) => item[1] === ret.params.lng);

  return supportedLng || null;
}

const supportedLng = getSupportedLng();
// 英语的 basename 为 ''
export const basename =
  supportedLng && supportedLng[0] !== defaultLang ? `/${supportedLng[1]}` : '';

let currentLang = supportedLngs.find((lng) => `/${lng[1]}` === basename);
currentLang = currentLang ? currentLang[0] : defaultLang;


export { currentLang };
/** 当前语言逻辑 end */

export const _t = (key, values) => {
  const target = intl.get(key, {
    brandName: window._BRAND_NAME_,
    siteBaseCurrency: window._BASE_CURRENCY_,
    ...(values || {})
  });

  if (!target) {
    reportIntlMissing(key);
    return key;
  }
  return target.d(key);
};

export const _tHTML = (key, variables, tagName = 'span', escape = true) => {
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
    siteBaseCurrency: window._BASE_CURRENCY_,
    ...(variables || {})
  });
  if (!target) {
    reportIntlMissing(key);
    return key;
  }
  return target.d(key);
};

export const setLang = (localeKey, realReload = false) => {
  // 设置html上语言标识
  setHTMLLang(localeKey);
};

// 不需要语言子路径的链接
export const WITHOOU_LANG_PATH = ['/rss/news', '/cert'];
// 语言子路径的域名
const langDomain = window.LANG_DOMAIN || LANG_DOMAIN;
const { localeBasenameFromPath: localeBasename } = getLocalBase();
const withOutLangPath = WITHOOU_LANG_PATH.map((item) => item.substring(1));
// 增加语言子路径
export const addLangToPath = (url = '') => {
  if (!url) {
    return url;
  }
  // 是语言子路径的项目
  const langDomains = window.LANG_DOMAIN || LANG_DOMAIN;
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
      const isLangDomain = langDomains?.some((item) => urlLocation.host.hostname.startsWith(item));
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
  const { isExist: langByPath } = getLocalBase();
  const langInQuery = searchToJson()?.lang;
  const appConfirmLang = noPrefixSessionStorage.getItem('appConfirmLang', { isPublic: true });
  if (
    isInApp &&
    (langByPath || (!langByPath && langInQuery === window._DEFAULT_LANG_) || appConfirmLang === 'yes')
  ) {
    //已确认语言采用语言子路径， storage存储的语言数据与语言子路径一致
    const lang = langByPath || window._DEFAULT_LANG_;
    kucoinStorage.setItem('lang', lang);
    noPrefixSessionStorage.setItem('appConfirmLang', 'yes', { isPublic: true });
    return false;
  }
  return true;
};
