import _ from 'lodash';

export const getIsInApp = () => {
  return window.navigator.userAgent.indexOf('KuCoin') > -1;
};

export const addLangToPath = (_href, lang) => {
  if (lang && _href && (_href.match(/^http?/) || _href.startsWith('/'))) {
    let base = '';
    base = window.__KC_LANGUAGES_BASE_MAP__?.langToBase?.[lang] || window._DEFAULT_LOCALE_;
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

export const removeLangQuery = (url = '') => {
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

// 跳转到对应链接
export const goPage = (url) => {
  if (!url) {
    return;
  }
  const newWindow = window.open(addLangToPath(url));
  if (newWindow) newWindow.opener = null;
};

/**
 * 获取展示按钮配置
 * @param {*} item 初始按钮配置
 * @param {*} replaceShareBtn 需要替换的按钮数据
 * @returns 替换后的按钮
 */
export const getDisplayShareBtn = (item, replaceShareBtn) => {
  let target = { ...item, gBizShareUrl: item?.url };
  if (!_.isEmpty(replaceShareBtn)) {
    if (_.isObject(replaceShareBtn) && replaceShareBtn?.id === target?.id) {
      target = { target, ...replaceShareBtn };
    } else if (_.isArray(replaceShareBtn)) {
      const replaceObj = _.find(replaceShareBtn, (i) => i?.id === target?.id);
      if (!_.isEmpty(replaceObj)) {
        target = { ...target, ...replaceObj };
      }
    }
  }
  return target;
};
