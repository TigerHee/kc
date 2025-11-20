import { removeLangQuery } from './tools';

// 语言子路径的域名
export const LANG_DOMAIN = ['www.kucoin.', 'trade.kucoin.', 'futures.kucoin.', 'm.kucoin.'];

export const addLangToPath = (_href, lang) => {
  if (lang && _href && (_href.match(/^http?/) || _href.startsWith('/'))) {
    const base = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
    const { origin } = window.location;
    const _url = new URL(_href.match(/^https?/) ? _href : `${origin}${_href}`);
    // 不需要语言子路径的路由
    const withOutLangPath = window.WITHOOU_LANG_PATH || [];
    if (withOutLangPath && withOutLangPath.length) {
      const withOutLang = withOutLangPath.some((item) => {
        return _url.pathname === item;
      });
      if (withOutLang) {
        return _href;
      }
    }
    // 语言子路径项目的域名
    const hasLangPathDomain = window._LANG_DOMAIN_ || ['www.kucoin.'];
    const accord = hasLangPathDomain.some((item) => _url.hostname.startsWith(item));
    const isInnet = _url.hostname.endsWith('kucoin.net');
    if (base && (accord || isInnet)) {
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
      const urlWithPath = removeLangQuery(_url.toString());
      return urlWithPath;
    }
    return _href;
  }
  return _href;
};
