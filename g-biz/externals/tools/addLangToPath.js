/**
 * Owner: willen@kupotech.com
 */
// 帮助中心语言参数做特殊映射
export const getSupportLang = {
  ar_AE: 'ar',
  bn_BD: 'bn',
  de_DE: 'de',
  en_US: 'en-us',
  es_ES: 'es',
  fil_PH: 'fil',
  fr_FR: 'fr',
  hi_IN: 'hi',
  it_IT: 'it',
  ja_JP: 'ja',
  ko_KR: 'ko-kr',
  id_ID: 'id-id',
  ms_MY: 'ms-my',
  nl_NL: 'nl',
  pl_PL: 'pl',
  pt_PT: 'pt',
  ru_RU: 'ru',
  th_TH: 'th',
  tr_TR: 'tr',
  vi_VN: 'vi',
  zh_CN: 'zh-cn',
  zh_HK: 'zh-tw',
  ur_PK: 'ur',
  uk_UA: 'uk-ua',
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

export default (_href, lang) => {
  if (lang && _href && (_href.match(/^http?/) || _href.startsWith('/'))) {
    const base = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
    const { origin } = window.location;
    let _url;
    try {
      _url = new URL(_href.match(/^https?/) ? _href : `${origin}${_href}`);
    } catch (e) {
      // 报错则不处理
      return _href;
    }
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
    const isInnet = _url.hostname.endsWith('kucoin.net') || _url.hostname === 'localhost';
    if (base && (accord || isInnet)) {
      const homePage = _url.pathname && _url.pathname === `/${base}`;
      if (
        base !== window._DEFAULT_LOCALE_ &&
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
