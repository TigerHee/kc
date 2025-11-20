/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * requests
 */
import qs from 'qs';
import fetch from './fetch';
import storage, { kucoinStorage } from './storage';
import * as config from 'config';
import pathToRegexp from 'path-to-regexp';
import { includes } from 'lodash';
import JsBridge from 'utils/jsBridge';
import { formlize, searchToJson } from 'helper';
import memStorage from './memStorage';
import _ from 'lodash';
import { getCurrentLangFromPath } from 'utils/langTools';

const exceptCode = ['110020', '110023', '110019', '110006', '200200'];
// const SERVICE_ERROR_CODE_REG = /^5\d{2}$/;

let xVersion = null; // debug x-version
// let xVersion = 'new-currency-pull-users'; // debug x-version

const {
  v2ApiHosts,
  activityUrl,
  interfaceUrl,
  commonInterfaceCache,
  commonInterfaceCacheExpireTime,
  FINGERPRINT_URLS,
} = config;

// 设备指纹埋点上报拦截器
fetch.interceptors.request.use(async (url, fetchConfig) => {
  const urlMatch = FINGERPRINT_URLS.find((o) => {
    const [Url] = url.split('?');
    const path = _.replace(Url, host, '');
    const pathRegExp = pathToRegexp(o.url);
    let isMatch = pathRegExp.test(path);
    if (isMatch && o.method) {
      isMatch = _.toLower(o.method) === _.toLower(fetchConfig.method);
    }
    return isMatch;
  });
  if (urlMatch) {
    const { default: Report } = await import('@kc/report');
    const token = await Report.logFingerprint(urlMatch.event);
    // token重新取值
    let tokenObj = {};
    if (Object.prototype.toString.call(token) === '[object Object]') {
      tokenObj = {
        TOKEN_SM: token?.token_sm,
      };
    }
    // 将token添加到header中
    fetchConfig.headers = {
      ...fetchConfig.headers,
      ...tokenObj,
    };
  }
  return [url, fetchConfig];
});

// 根据灰度变化确定是否要进行页面刷新
function checkIfXgrayNeedReload(response, curProjectName) {
  return System.import('@remote/common-base')
  .then(module => {
    if (!module || !module.checkIfXgrayNeedReload) return response;
    return module.checkIfXgrayNeedReload(response, curProjectName)
  })
  .catch(() => {
    // g-biz加载失败，返回response，不阻塞后续流程
    // 否则后续所有接口请求均拿不到接口响应数据
    return response
  })
}

export function getRequestBaseUrl() {
  let baseUrl = v2ApiHosts.WEB;
  // mock模式
  if (_DEV_ && `${_USE_MOCK_}` === '1') {
    baseUrl = '/_api';
  }
  return baseUrl;
}
const host = getRequestBaseUrl();

const langByPath = getCurrentLangFromPath();
const cacheExpireTime = 10 * 60 * 1000; // 缓存过期时间，10分钟
// 校验当前页面、接口是否使用缓存
function checkIsUseCache(url, query) {
  const nowPageUrl = window.location.href || '';
  const _find = _.find(activityUrl, (item) => _.includes(nowPageUrl, item));
  if (_find && _.find(interfaceUrl, (item) => _.includes(url, item))) {
    // 缓存页内 需缓存的 接口
    const storageKey = url + JSON.stringify(query);
    return storageKey;
  }
  return false;
}

const searchQuery = searchToJson();

function checkStatus(response, url, options = {}) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

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

//上报code=401且刷新session成功,
function reportRequestSession(url, options = {}) {
  // try {
  //   sentry.captureEvent({
  //     message: `${url} 接口401，已重新刷新session成功`,
  //     level: 'info',
  //     tags: {
  //       requestError: 'successFalseError',
  //     },
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
}

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

function checkError(json, _storageKey = '', url, options = {}) {
  if (typeof json.code === 'number') {
    json.code = `${json.code}`;
  }

  if (typeof json.success === 'undefined' || json.success === false) {
    if (includes(exceptCode, json.code)) {
      return json;
    }
    throw json;
  }

  if (_storageKey) {
    // 需要存缓存
    const map = storage.getItem(commonInterfaceCache) || {};
    map[_storageKey] = json;
    storage.setItem(commonInterfaceCache, map);
    storage.setItem(commonInterfaceCacheExpireTime, Date.now() + cacheExpireTime);
  }
  return json;
}

function isDefaultHost(url) {
  return url.indexOf('/') === 0 && url.indexOf('//') !== 0 && url.indexOf('/_api') !== 0;
}

function isAPI(url) {
  let isV2Api = false;
  for (const key in v2ApiHosts) {
    if (url.indexOf(v2ApiHosts[key]) > -1) {
      isV2Api = true;
    }
  }
  return isDefaultHost(url) || isV2Api;
}

function getCsrf(url) {
  const csrf = memStorage.getItem('csrf');
  return csrf;
}

export function setCsrf(value = '') {
  memStorage.setItem('csrf', value);
}

export function setKuCoinCsrf(value = '') {
  memStorage.setItem('kucoinCsrf', value);
}

export function setXVersion(value = '') {
  xVersion = value;
  storage.setItem('_x_version', value);
}

window.setXVersion = setXVersion;

export function requestFetch(
  url,
  options = {
    method: 'GET',
  },
) {
  options.mode = options.mode || 'cors';
  options.credentials = options.credentials || 'include';
  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  const _xVersion = xVersion || storage.getItem('_x_version');

  if (_xVersion) {
    if (url.indexOf('?') === -1) {
      url = `${url}?x-version=${_xVersion}`;
    } else {
      url = `${url}&x-version=${_xVersion}`;
    }
  }

  const requestHost = isDefaultHost(url) ? `${host}${url}` : url;

  return fetch(requestHost, options).then(checkStatus);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return { Promise<Record<any, any>>} An object containing either "data" or "err"
 */
export default function request(url, options = {}, _storageKey = '') {
  options.mode = options.mode || 'cors';
  options.credentials = options.credentials || 'include';
  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  const _xVersion = xVersion || storage.getItem('_x_version');

  if (_xVersion) {
    if (url.indexOf('?') === -1) {
      url = `${url}?x-version=${_xVersion}`;
    } else {
      url = `${url}&x-version=${_xVersion}`;
    }
  }

  const { _cms_ts, _cms_hash } = searchQuery;
  if (_cms_ts && _cms_hash) {
    if (url.indexOf('?') === -1) {
      url = `${url}?_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
    } else {
      url = `${url}&_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
    }
  }

  const requestHost = isDefaultHost(url) ? `${host}${url}` : url;

  return (
    fetch(requestHost, options)
      .then((response) => checkIfXgrayNeedReload(response, ['g-biz', 'landing-web']))
      .then((fetchRes) => checkStatus(fetchRes, requestHost, options))
      .then(parseJSON)
      //添加App内嵌H5的session过期重连机制
      .then((json) => sessionInAppRenewal(json, requestHost, options))
      .then((json) => checkError(json, _storageKey, requestHost, options))
      .catch((e) => {
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
      })
  );
}

/**
 * Get.
 *
 * @param {string} url
 * @param {object} query
 */
export function pull(url, query = {}) {
  const _storageKey = checkIsUseCache(url, query) || '';
  if (_storageKey) {
    // 使用缓存，先检查过期时间
    const expireTime = storage.getItem(commonInterfaceCacheExpireTime) || 0;
    if (expireTime >= Date.now()) {
      // 未过期
      const map = storage.getItem(commonInterfaceCache) || {};
      const nowRes = map[_storageKey] || null;
      if (nowRes) {
        return Promise.resolve(nowRes);
      }
    } else {
      // 已过期
      storage.removeItem(commonInterfaceCache);
    }
  }

  if (isAPI(url)) {
    const isInApp = window.navigator.userAgent.includes('KuCoin');
    if (!isInApp) {
      query.c = getCsrf(url) || undefined;
    }
    query.lang = query.lang || langByPath || kucoinStorage.getItem('lang');
    // query._t = Date.now(); // Prevent caching mechanism
  }
  let queryStr = qs.stringify(query) || '';
  if (queryStr) {
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }

  return request(
    `${url}${queryStr}`,
    {
      method: 'GET',
    },
    _storageKey,
  );
}

/**
 * Post.
 *
 * @param {string} url
 * @param {object} [data]
 * @param {Boolean} [disabledLang]
 */
export function post(url, data = {}, disabledLang = false, isJson = false) {
  const _storageKey = checkIsUseCache(url, data) || '';
  if (_storageKey) {
    // 使用缓存，先检查过期时间
    const expireTime = storage.getItem(commonInterfaceCacheExpireTime) || 0;
    if (expireTime >= Date.now()) {
      // 未过期
      const map = storage.getItem(commonInterfaceCache) || {};
      const nowRes = map[_storageKey] || null;
      if (nowRes) {
        return Promise.resolve(nowRes);
      }
    } else {
      // 已过期
      storage.removeItem(commonInterfaceCache);
    }
  }

  let queryStr = '';
  if (isAPI(url)) {
    const query = {};
    const isInApp = window.navigator.userAgent.includes('KuCoin');

    if (!isInApp) {
      query.c = getCsrf(url) || undefined;
    }

    if (!disabledLang) {
      query.lang = langByPath || kucoinStorage.getItem('lang');
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
      // 'X-Request-With': null,
    };
  }
  return request(`${url}${queryStr}`, options, _storageKey);
}

/**
 * Post Json
 *
 * @param {string} url
 * @param {object} [data]
 * @param {Boolean} [disabledLang]
 */
export const postJson = (url, data, disabledLang) => {
  return post(url, data, (disabledLang = false), true);
};

/**
 * Delete.
 *
 * @param {string} url
 * @param {object} query
 */
export function del(url, query = {}) {
  if (isAPI(url)) {
    const isInApp = window.navigator.userAgent.includes('KuCoin');
    if (!isInApp) {
      query.c = getCsrf(url) || undefined;
    }
    query.lang = query.lang || langByPath || kucoinStorage.getItem('lang');
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

/**
 * 对处理返回的正常数据进行处理
 * 基于success的值进行处理success为false则抛错，true则正常
 * onSilenceOk 优先级高于 onOk
 * @template { {code: string, data: any, msg: string, retry: boolean, success: boolean} } T code 在200-300是正常的
 * @param {Promise<T>} response
 * @param {{
 *  message: any,
 *  onOk?: ((res: T) => false | void | string) | string,
 *  onSilenceOk?: ((res: T) => void) | true,
 *  onError?: ((res?: T) => false | void | string) | string | false,
 * }} conf 返回false则意味着不进行弹窗提示, onError 中没有值则表示是其他错误，如状态码为非200时的错误, onOk, onError 函数返回string则表示其作为提示信息,onSilenceOk和onOk基本一致，只是不弹出成功的信息
 */
export function fetchHandle(response, conf) {
  const { onOk, onError, onSilenceOk, message } = conf;
  const showOkMsg = !onSilenceOk;
  const onOkFn = onSilenceOk || onOk;
  return response
    .then((res) => {
      const successMsg = res.msg || '成功';
      if (typeof onOkFn === 'function') {
        const okMsg = onOkFn(res);
        if (showOkMsg && okMsg !== false) {
          message && message.success(typeof okMsg === 'string' ? okMsg : successMsg);
        }
      } else if (showOkMsg) {
        message && message.success(onOkFn || successMsg);
      }
      return res;
    })
    .catch((res) => {
      const messageError = (msg) => {
        console.error(msg);
        if (onError !== false) {
          message && message.error(msg);
        }
      };

      // checkError 中的逻辑，抛出来的是res if (json.success === false) {throw json;}
      if (res && res.success === false) {
        const errorMsg = res.msg || '请求错误';
        if (typeof onError === 'function') {
          const errMsg = onError(res);
          if (errMsg !== false) {
            messageError(typeof errMsg === 'string' ? errMsg : errorMsg);
          }
        } else {
          messageError(onError || errorMsg);
        }
        return res;
      } else {
        const getMsg = () => {
          return res != null && typeof res === 'object' ? res.msg || res.message : res;
        };
        if (typeof onError === 'function') {
          const errMsg = onError(res);
          if (errMsg !== false) {
            messageError(typeof errMsg === 'string' ? errMsg : getMsg());
          }
        } else {
          messageError(onError || getMsg());
        }
      }
    });
}

/**
 * 获取某个命名空间下的url
 * @param {string} namespace
 */
export const getNamespaceUrl = (namespace) => (url) => `/${namespace}${url}`;
