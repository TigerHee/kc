/**
 * Owner: iron@kupotech.com
 */
import { forIn, replace } from 'lodash';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import qs from 'query-string';
import { numberFormat as kuxNumberFormat } from '@kux/mui/utils';

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

export const changLangToPath = (lang, _href) => {
  if (lang && _href) {
    let base = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
    const { origin } = window.location;
    // 是否全路径
    const isFullUrl = _href.match(/^https?/);
    const _url = new URL(isFullUrl ? _href : `${origin}${_href}`);
    // 不需要语言子路径的路由
    const withOutLangPath = ['/docs/beginners/introduction'];
    // 支持独立站英文
    const withOutLangIncludePath = ['/docs-new', '/docs-new/sdk'];

    const withOutLang = withOutLangPath.some((item) => {
      return _url.pathname === item;
    });
    const withOutIncludePathLang = withOutLangIncludePath.some((item) => {
      return _url.pathname?.indexOf(item) > -1;
    });
    if (withOutIncludePathLang) {
      // 英文
      base = window.__KC_LANGUAGES_BASE_MAP__.langToBase.en_US || window._DEFAULT_LOCALE_;
    }
    if (withOutLang) {
      // API文档页面只支持中文和英文
      if (_url.pathname === '/docs/beginners/introduction') {
        return ['zh_HK', 'zh_CN'].indexOf(lang) !== -1
          ? `/zh-hant/docs/beginners/introduction`
          : '/docs/beginners/introduction';
      }
      return _href;
    }
    // 语言子路径项目的域名
    const hasLangPathDomain = window._LANG_DOMAIN_ || ['www.kucoin.'];
    // 如果不是全路径(!isFullUrl), 就可以添加子路径
    // 或者域名符合语言子路径的域名，则添加语言子路径
    const accord = !isFullUrl || hasLangPathDomain.some((item) => _url.hostname.startsWith(item));
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
      return removeLangQuery(_url.toString());
    }
  }
  return _href;
};

/*
 * 处理html字符串里的host:
 * 1、html中用$your_host_name$占位，如： $TRADE_HOST$
 * 2、hostConfig传入 { your_host_name: 'xxx' }, 如： { TRADE_HOST: 'https://trade.kucoin.com' }
 */
export const replaceHost = (html, lang, hostConfig = {}) => {
  let result = html || '';
  forIn(hostConfig, (value, key) => {
    // eslint-disable-next-line
    const reg = new RegExp(`(\\\$${key}\\\$)(.*?)(('|"))`, 'g');
    result = replace(result, reg, (match, p1, p2, p3) => {
      const { query: oriQuery, ...parsedUrl } = qs.parseUrl(`${value}${p2}`, {
        parseFragmentIdentifier: true,
      });
      let query = {};
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
        }),
      );
      const urlWithLang = changLangToPath(lang, url);
      return `${urlWithLang}${p3}`;
    });
  });
  return result;
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
