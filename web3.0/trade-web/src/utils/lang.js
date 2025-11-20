/**
 * Owner: borden@kupotech.com
 */
import intl from 'react-intl-universal';
import config, { siteCfg } from 'config';
import _ from 'lodash';
import qs from 'query-string';
import { pathToRegexp } from 'path-to-regexp';
import urlparser from 'urlparser';
import { getLang } from 'services/lang';
import { formatUrlWithLang } from 'utils/getMainsiteLink';
import escapeHtml from 'escape-html';
import { getUtmLink } from 'utils/getUtm';
import { WITHOUT_QUERY_PARAM } from 'codes';
import { reportIntlMissing } from './sentry';
import sentry from '@kc/sentry';

const { MAINSITE_HOST } = siteCfg;
const { DEFAULT_LANG, DEFAULT_LOCALE } = config;

export const languages = window?.__KC_LANGUAGES__?.__ALL__ || [
  'de_DE',
  'en_US',
  'es_ES',
  'fr_FR',
  'ko_KR',
  'nl_NL',
  'pt_PT',
  'ru_RU',
  'tr_TR',
  'vi_VN',
  // 'zh_CN',
  'zh_HK',
  'it_IT',
  'id_ID',
  'ms_MY',
  'hi_IN',
  'th_TH',
  'ja_JP',
  'bn_BD',
  'pl_PL',
  'fil_PH',
  'ar_AE',
  'ur_PK',
];

export const allLanguages = window?.__KC_LANGUAGES__?.__ALL__ || [
  'de_DE',
  'en_US',
  'es_ES',
  'fr_FR',
  'ko_KR',
  'nl_NL',
  'pt_PT',
  'ru_RU',
  'tr_TR',
  'vi_VN',
  // 'zh_CN',
  'zh_HK',
  'it_IT',
  'id_ID',
  'ms_MY',
  'hi_IN',
  'th_TH',
  'ja_JP',
  'bn_BD',
  'pl_PL',
  'fil_PH',
  'ar_AE',
  'ur_PK',
];

const allLocaleMap = _.reduce(
  allLanguages,
  (acc, lang) => {
    if (lang === 'zh_HK') {
      acc[lang] = 'zh-hant';
    } else if (lang === 'zh_CN') {
      acc[lang] = 'zh-hans';
    } else {
      [acc[lang]] = _.split(lang, '_');
    }
    return acc;
  },
  {},
);

export const getPathByLang = (lang) => {
  return allLocaleMap[lang];
};

let localeBasename = null;

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
  return getLangFromLocaleMap(localeBasename);
};

export const getLocaleFromLocaleMap = (lang) => {
  if (!lang) {
    return DEFAULT_LOCALE;
  }
  const currentLocale = _.get(allLocaleMap, lang);

  return currentLocale || DEFAULT_LOCALE;
};

/**
 * url 语言
 */
export const determineBasenameFromUrl = (needLang) => {
  const { pathname } = window.location;
  const pathRe = pathToRegexp('/:locale/trade/(.*)?');
  const execResult = pathRe.exec(pathname);
  const localeBasenameFromPath = execResult && execResult[1]; // 如果匹配不成功，basename 为 null
  const isExist = _.findKey(allLocaleMap, (o) => o === localeBasenameFromPath);
  if (localeBasenameFromPath && isExist) {
    localeBasename = localeBasenameFromPath;
  }
  if (needLang) {
    return {
      lang: isExist,
      localeBasename,
    };
  }

  return localeBasename;
};

/**
 * @description: 获取语言包
 * @param {*} locale
 * @param {string} dir 业务语言包文件夹\
 * @param {function} mergeCallback merge的时候,需要操作的函数
 * @return {*}
 */
export const initLocale = async (locale, dir = 'locale', mergeCallback = (d) => d) => {
  await getLang(locale, dir, mergeCallback);
  return intl.init({
    currentLocale: locale,
    locales: { [locale]: _KC_LOCALE_DATA[locale] },
  });
};

/**
 * 获取语言包对应本地化语言
 * @param key
 * @param variables
 * @returns {*}
 * @private
 */
export const _t = (key, variables) => {
  // return key;
  try {
    if (variables) {
      for (const k in variables) {
        if (variables[k] === 0) {
          variables[k] = '0';
        }
      }
      // console.log('------------variables-----------', variables);
    }
    const target = intl.get(key, {
      brandName: window._BRAND_NAME_,
      ...variables,
    });
    if (!target) {
      reportIntlMissing(key);
      return key;
    }
    return target.d(key);
  } catch (e) {
    sentry.captureException(e);
    return key;
  }
};

/**
 * 获取html格式语言包对应本地化语言值
 * @param key
 * @param variables
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
    sentry.captureException(e);
    return key;
  }
};

export function deleteLangQuery(url = '') {
  if (!url) {
    return url;
  }
  let href = url;
  const query = qs.parse(window.location.search, { decode: false });
  if (query.lang) {
    delete query.lang;
    const search = qs.stringify(query);
    if (search) {
      href = url.replace(window.location.search, `?${search}`);
    } else {
      // 去掉lang的search
      href = url.substr(0, url.lastIndexOf('?'));
    }
  }
  if (href.endsWith('/')) {
    href = href.substring(0, href.length - 1);
  }
  return href;
}

export function replaceUrlWithoutLang(url, changeLocation = false) {
  // 删除语言参数
  let _href = url || window.location.href;
  if (_href.endsWith('/')) {
    _href = _href.substring(0, _href.length - 1);
  }
  const _url = deleteLangQuery(_href);
  if (changeLocation) {
    window.location.replace(_url);
  }
  if (_url !== _href) {
    window.location.replace(_url);
  }
}

// 不需要语言子路径的链接 比如: '/rss/news'
export const WITHOOU_LANG_PATH = ['/docs'];
// 这些域名下的链接需要语言子路径。
export const LANG_DOMAIN = ['www.kucoin.', 'trade.kucoin.', 'futures.kucoin.', 'm.kucoin.'];
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
        return urlLocation?.path?.base.startsWith(item);
      });
      // 内链，不需要语言子路径的
      if (withOutLang) {
        // api文档页面不支持多语言，只有英文和中文。多站点跳转也有问题，不能加 en，暂时去掉addLangToPath逻辑
        if (urlLocation?.path?.base.startsWith('docs')) {
          if (['zh-hant'].indexOf(localeBasename) === -1) {
            return url;
          }
        }
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

/**
 * copy form components/Router/Link.js
 */
export const getHrefProps = (goto) => {
  if (goto && typeof goto === 'string' && goto.indexOf('/') === 0) {
    if (goto === '/') {
      goto = getUtmLink(MAINSITE_HOST || '', WITHOUT_QUERY_PARAM);
    } else {
      goto = getUtmLink(`${MAINSITE_HOST}${goto}`, WITHOUT_QUERY_PARAM);
    }
  }
  return addLangToPath(goto);
};

/*
 * 获取多语言链接，默认情况下默认语言为 en_US
 * @param {Record<string, string>} conf
 * @param {string} [defLang]
 */
export const getLangLink =
  (conf, defLang = 'en_US') =>
  (lang) => {
    const res = conf?.[lang] || conf?.[defLang];
    return typeof res === 'function' ? res() : res;
  };
