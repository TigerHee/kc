/**
 * Owner: iron@kupotech.com
 */
import { forIn, replace } from 'lodash-es';
import qs from 'query-string';
import { numberFormat as kuxNumberFormat } from '@kux/mui-next/utils';
import { bootConfig, getHref } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';
import { queryPersistence } from 'tools/base/QueryPersistence';

const removeLangQuery = (url = '') => {
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
    queryArr.forEach(item => {
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

// 新增 site 参数，将需要的 window 参数从外部给
export const changLangToPath = (_href: string, lang?: string) => {
  const currentLang = lang || getCurrentLang();
  const _GLOBAL_HREF_ = getHref();
  if (currentLang && _href && _GLOBAL_HREF_) {
    // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
    let base = bootConfig.langsMap[currentLang] || bootConfig._DEFAULT_LOCALE_;
    const location = new URL(_GLOBAL_HREF_);
    const { origin } = location;

    // 是否全路径
    const isFullUrl = _href.match(/^https?/);
    const _url = new URL(isFullUrl ? _href : `${origin}${_href}`);

    // 不需要语言子路径的路由
    const withOutLangPath = ['/docs/beginners/introduction'];
    // 支持独立站英文
    const withOutLangIncludePath = ['/docs-new', '/docs-new/sdk'];

    const withOutLang = withOutLangPath.some(item => {
      return _url.pathname === item;
    });
    const withOutIncludePathLang = withOutLangIncludePath.some(item => {
      return _url.pathname?.indexOf(item) > -1;
    });
    if (withOutIncludePathLang) {
      //只支持 英文
      base =bootConfig.langsMap.en_US || bootConfig._DEFAULT_LOCALE_;
    }

    if (withOutLang) {
      // API文档页面只支持中文和英文
      if (_url.pathname === '/docs/beginners/introduction') {
        return ['zh_HK', 'zh_CN'].indexOf(currentLang) !== -1
          ? `/zh-hant/docs/beginners/introduction`
          : '/docs/beginners/introduction';
      }
      return _href;
    }

    // 语言子路径项目的域名
    const hasLangPathDomain = bootConfig._LANG_DOMAIN_ || ['www.kucoin.'];

    // 如果不是全路径(!isFullUrl), 就可以添加子路径
    // 或者域名符合语言子路径的域名，则添加语言子路径
    const accord = !isFullUrl || hasLangPathDomain.some(item => _url.hostname.startsWith(item));
    if (base && accord) {
      const homePage = _url.pathname && _url.pathname === `/${base}`;
      if (
        base !== (bootConfig._DEFAULT_LOCALE_ || 'en') &&
        !(_url.pathname && _url.pathname.startsWith(`/${base}/`)) &&
        !homePage
      ) {
        if (_url.pathname === '/') {
          _url.pathname = `/${base}`;
        } else {
          _url.pathname = `/${base}${_url.pathname}`;
        }
      }
      return removeLangQuery(_url.toString());
    }
  }
  return _href;
};

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

/*
 * 处理html字符串里的host:
 * 1、html中用$your_host_name$占位，如： $TRADE_HOST$
 * 2、hostConfig传入 { your_host_name: 'xxx' }, 如： { TRADE_HOST: 'https://trade.kucoin.com' }
 */
export const replaceHost = (html: string, lang: string, hostConfig = {}) => {
  let result = html || '';

  forIn(hostConfig, (value, key) => {
    // eslint-disable-next-line
    const reg = new RegExp(`(\\\$${key}\\\$)(.*?)(('|"))`, 'g');
    result = replace(result, reg, (match, p1, p2, p3) => {
      const { query: oriQuery, ...parsedUrl } = qs.parseUrl(`${value}${p2}`, {
        parseFragmentIdentifier: true,
      });
      let query: Record<string, string> = {};
      if (!oriQuery) {
        query.lang = lang;
      } else {
        query = {
          ...oriQuery,
          lang,
        };
      }
      const url = queryPersistence.formatUrlWithStore(
        qs.stringifyUrl({
          query,
          ...parsedUrl,
        })
      );
      const urlWithLang = changLangToPath(url, lang);
      return `${urlWithLang}${p3}`;
    });
  });
  return result;
};

export const getRelativePath = (url) => {
  if (url.startsWith('/')) {
    return url;
  }
  try {
    const { origin } = window.location;
    const parsedUrl = new URL(url, origin);
    if (parsedUrl.origin === origin) {
      return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    }
    return parsedUrl.href;
  } catch (e) {
    return url;
  }
};
