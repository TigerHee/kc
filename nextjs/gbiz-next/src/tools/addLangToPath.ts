/**
 * Owner: willen@kupotech.com
 */
import { bootConfig, getOrigin } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n'

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

// 不需要语言子路径的链接
// 直接写死
export const WITHOOU_LANG_PATH = ["/rss/news"];

export default (_href) => {
  const lang = getCurrentLang();
  if (lang && _href && (_href.match(/^http?/) || _href.startsWith('/'))) {
    const base = bootConfig.langsMap[lang] || bootConfig._DEFAULT_LOCALE_;
    let _url;

    try {
      _url = new URL(_href.match(/^https?/) ? _href : `${getOrigin()}${_href}`);
    } catch (e) {
      // 报错则不处理
      return _href;
    }

    // 不需要语言子路径的路由
    const withOutLangPath = WITHOOU_LANG_PATH || [];
    if (withOutLangPath && withOutLangPath.length) {
      const withOutLang = withOutLangPath.some((item) => {
        return _url.pathname === item;
      });
      if (withOutLang) {
        return _href;
      }
    }
    // 语言子路径项目的域名
    const hasLangPathDomain = bootConfig._LANG_DOMAIN_ || ['www.kucoin.'];
    const accord = hasLangPathDomain.some((item) => _url.hostname.startsWith(item));
    const isInnet = _url.hostname.endsWith('kucoin.net') || _url.hostname === 'localhost';
    if (base && (accord || isInnet)) {
      const homePage = _url.pathname && _url.pathname === `/${base}`;
      if (
        base !== bootConfig._DEFAULT_LOCALE_ &&
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
    return _href;
  }
  return _href;
};
