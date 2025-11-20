/**
 * Owner: willen@kupotech.com
 */
/**
 * request库
 * runtime: next/browser
 */
import JsBridge from '@knb/native-bridge';
import fetch from '@kucoin-base/fetch';
import history from '@kucoin-base/history';
import { currentLang } from '@kucoin-base/i18n';
import { checkIfXgrayNeedReload } from '@kucoin-biz/common-base';
import config from 'config';
import { FINGERPRINT_URLS, zendeskApiPrefix } from 'config/base';
import pathToRegexp from 'path-to-regexp';
import qs from 'query-string';
import Report from 'tools/ext/kc-report';
import formlize from 'utils/formlize';
import storage from 'utils/storage';
import memStorage from './memStorage';

const isInApp = JsBridge.isApp();
const { v2ApiHosts } = config;
const host = v2ApiHosts.WEB;

// 设备指纹埋点上报拦截器
fetch.interceptors.request.use(async (url, fetchConfig) => {
  const urlMatch = FINGERPRINT_URLS.find((o) => {
    const [_url] = url.split('?');
    const path = _url.replace(host, '');
    const pathRegExp = pathToRegexp(o.url);
    let isMatch = pathRegExp.test(path);
    if (isMatch && o.method) {
      isMatch = o.method.toLowerCase() === fetchConfig.method.toLowerCase();
    }
    return isMatch;
  });
  if (urlMatch) {
    const token = await Report.logFingerprint(urlMatch.event);
    fetchConfig.headers['TOKEN_SM'] = token?.token_sm || '';
  }
  return [url, fetchConfig];
});

let xVersion = _XVERSION_; // 调试 x-version

function checkStatus(response, url, options = {}) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  Report.logSelfDefined(`http-error-${response.status}`, response.statusText);
  // const error = new Error(response.statusText)
  // error.response = response;
  const error = {
    msg: response.statusText,
    response,
  };
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function checkError(json, url, options = {}) {
  if (typeof json.code === 'number') {
    json.code = `${json.code}`;
  }

  if (json.code >= 500 && json.code < 999) {
    Report.logSelfDefined(`code-error-${json.code}`, json.msg || 'no msg in code error');
  }

  if (typeof json.success === 'undefined' || json.success === false) {
    throw json;
  }

  return json;
}

function isDefaultHost(url) {
  return url.indexOf('/') === 0 && url.indexOf('//') !== 0 && url.indexOf('/_api') !== 0;
}

function isAPI(url) {
  let isV2Api = false;
  // zendesk接口不需要语言参数
  if (url.startsWith(zendeskApiPrefix)) {
    return false;
  }
  Object.keys(v2ApiHosts).forEach((key) => {
    if (url.indexOf(v2ApiHosts[key]) > -1) {
      isV2Api = true;
    }
  });

  return isDefaultHost(url) || isV2Api;
}

export function setCsrf(value = '') {
  memStorage.setItem('csrf', value);
}

export function setXVersion(value = '') {
  xVersion = value;
  storage.setItem('_x_version', value);
}

// runtime: browser
window.setXVersion = setXVersion;

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options = {}) {
  options.mode = options.mode || 'cors';
  options.credentials = options.credentials || 'include';
  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  // const _xVersion = '123' || xVersion || storage.getItem('_x_version');
  const _xVersion = xVersion || storage.getItem('_x_version');

  if (_xVersion) {
    if (url.indexOf('?') === -1) {
      url = `${url}?x-version=${_xVersion}`;
    } else {
      url = `${url}&x-version=${_xVersion}`;
    }
  }

  const { query: { _cms_ts, _cms_hash } = {} } = history.location;

  if (_cms_ts && _cms_hash) {
    if (_cms_ts && _cms_hash) {
      if (url.indexOf('?') === -1) {
        url = `${url}?_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
      } else {
        url = `${url}&_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
      }
    }
  }

  const requestHost = isDefaultHost(url) ? `${host}${url}` : url;

  try {
    const response = await fetch(requestHost, options);
    await checkIfXgrayNeedReload(response, ['public-web', 'g-biz']);
    await checkStatus(response, url, options);
    const json = await parseJSON(response);
    const json2 = await sessionInAppRenewal(json, requestHost, options);
    await checkError(json2, url, options);
    return json2;
  } catch (e) {
    if (typeof e === 'object') {
      e._req_host = requestHost;

      if (
        e.code === '401' || // user need login
        e.code >= '600' // system error code
      ) {
        e._no_sentry = true;
      }
    }
    throw e;
  }
}

/**
 * Get.
 *
 * @param {string} url
 * @param {object} query
 * @return {object} An object containing either "data" or "err"
 */
export function pull(url, query = {}, options = {}) {
  if (isAPI(url)) {
    query.c = memStorage.getItem('csrf') || undefined;
    query.lang = query.lang || currentLang || storage.getItem('lang');
    // 去除防缓存机制，降低服务器压力
    // query._t = Date.now(); // 防止缓存机制
  }
  let queryStr = qs.stringify(query) || '';
  if (queryStr) {
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }

  return request(`${url}${queryStr}`, {
    method: 'GET',
    ...options,
  });
}

/**
 * Post.
 *
 * @param {string} url
 * @param {object} data
 * @param {Boolean} disabledLang
 * @return {object} An object containing either "data" or "err"
 */
export function post(url, data = {}, disabledLang = false, isJson = false) {
  let queryStr = '';
  if (isAPI(url)) {
    const query = {};

    query.c = memStorage.getItem('csrf') || undefined;

    if (!disabledLang) {
      query.lang = currentLang || storage.getItem('lang');
    }

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  const options = {
    method: 'POST',
    body: isJson ? JSON.stringify(data) : formlize(data),
  };
  if (isJson) {
    options.headers = {
      'Content-Type': 'application/json',
      'X-Request-With': null,
    };
  }
  return request(`${url}${queryStr}`, options);
}

/**
 * Post Json
 * @param {string} url
 * @param {object} [data]
 * @param {Boolean} [disabledLang]
 * @return {Promise<any>} An object containing either "data" or "err"
 */
export function postJson(url, data, disabledLang) {
  return post(url, data, disabledLang, true);
}

/**
 * Delete.
 *
 * @param {string} url
 * @param {object} query
 * @return {object} An object containing either "data" or "err"
 */
export function del(url, query = {}) {
  if (isAPI(url)) {
    query.c = memStorage.getItem('csrf') || undefined;
    query.lang = query.lang || currentLang || storage.getItem('lang');
  }
  let queryStr = qs.stringify(query) || '';
  if (queryStr) {
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }

  return request(`${url}${queryStr}`, {
    method: 'DELETE',
  });
}

// app内session过期刷新
const maxRequestTime = 3;
let reLoginPromise = null;
let requestExistMap = new Map();
//Bridge 刷新session回流
async function bridgeRenewal(url, options) {
  if (reLoginPromise) {
    return reLoginPromise;
  }
  const requestTime = requestExistMap.get(url) || 0;
  requestExistMap.set(url, requestTime + 1);
  //h5通过桥方式刷新session来进行搂底
  reLoginPromise = new Promise((resolve, reject) => {
    //安卓没有callback,暂时通过主动监听实现，后续会提供新的桥
    let timeoutId = null;
    const callback = () => {
      // JsBridge.open({ type: 'func', params: { name: 'showToast', value: 'session 刷新成功' } });
      clearTimeout(timeoutId); // 清除超时定时器
      resolve(true);
      JsBridge.listenNativeEvent.off('onLogin', callback);
    };

    JsBridge.listenNativeEvent.on('onLogin', callback);

    // 设置超时定时器
    timeoutId = setTimeout(() => {
      JsBridge.listenNativeEvent.off('onLogin', callback); // 移除回调，避免多次触发 resolve
      reject(new Error('刷新session超时')); // 在超时后拒绝 Promise
    }, 3000); // 设置超时时间，这里是 3 秒

    //旧版容器需要callback
    JsBridge.open({ type: 'func', params: { name: 'refreshAppSession' } }, ({ code }) => {
      console.log(code); // 不要删除这个空函数
    });
  })
    .catch((e) => {
      console.error('Promise rejected:', e);
    })
    .finally(() => {
      reLoginPromise = null;
    });

  return reLoginPromise;
}

async function sessionInAppRenewal(json, requestHost, options) {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    if (json.code === '401') {
      const url = requestHost.split('?')[0];
      // 重复的401超过最大回流请求次数直接放掉
      const requestTime = requestExistMap.get(url) || 0;
      if (requestTime >= maxRequestTime) {
        return { ...json, ignoreError: true };
      } else {
        const success = await bridgeRenewal(url, options);
        if (success) return request(requestHost, options);
      }
    }
  }
  return json;
}
