/**
 * Owner: iron@kupotech.com
 */
import _forIn from 'lodash/forIn';
import _replace from 'lodash/replace';
import qs from 'query-string';
import { queryPersistence } from '@packages/gbiz-base/src/QueryPersistence';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

const excludePathnames = ['/cert'];

const includeDomains = window._LANG_DOMAIN_ || ['www.kucoin.'];

const defineBase = (lang = '') => {
  return window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
};

const eliminatePathname = (url) => {
  return excludePathnames.some((o) => url.pathname === o);
};

const addLangPath = (lang, url) => {
  const base = defineBase(lang);
  const parsedUrl = new URL(url, window.location.origin);

  if (eliminatePathname(parsedUrl)) {
    return url;
  }

  const domainCompat = includeDomains.some((o) => parsedUrl.hostname.startsWith(o));

  if (base && domainCompat) {
    const homePage = parsedUrl.pathname && parsedUrl.pathname === `/${base}`;
    if (
      base !== window._DEFAULT_LOCALE_ &&
      !(parsedUrl.pathname && parsedUrl.pathname.startsWith(`/${base}/`)) &&
      !homePage
    ) {
      if (parsedUrl.pathname === '/') {
        parsedUrl.pathname = `/${base}`;
      } else {
        parsedUrl.pathname = `/${base}${parsedUrl.pathname}`;
      }
    }
    // 删除 query lang
    parsedUrl.searchParams.delete('lang');
    return parsedUrl.toString();
  }
  return url;
};

/*
 * 处理html字符串里的host:
 * 1、html中用$your_host_name$占位，如： $TRADE_HOST$
 * 2、hostConfig传入 { your_host_name: 'xxx' }, 如： { TRADE_HOST: 'https://trade.kucoin.com' }
 */
const parseHtmlHost = (html, lang, hostConfig = {}) => {
  let result = html || '';
  _forIn(hostConfig, (value, key) => {
    // eslint-disable-next-line
    const reg = new RegExp(`(\\\$${key}\\\$)(.*?)(('|"))`, 'g');
    result = _replace(result, reg, (match, p1, p2, p3) => {
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
        WITHOUT_QUERY_PARAM,
      );
      const urlWithLang = addLangPath(lang, url);
      return `${urlWithLang}${p3}`;
    });
  });
  return result;
};

export default parseHtmlHost;
