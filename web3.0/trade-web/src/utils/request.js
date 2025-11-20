/**
 * Owner: borden@kupotech.com
 */
/**
 * request库
 */
import JsBridge from '@kucoin-base/bridge';
import qs from 'qs';
import fetch from './fetch';
import storage from './storage';
import config from 'config';
import { formlize, searchToJson } from 'helper';
import memStorage from './memStorage';
import { getCurrentLangFromPath } from './lang';
import { renewalSession } from 'services/user';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import _ from 'lodash';
import sentry from '@kc/sentry';
import { KUCOIN_LANG_KEY } from 'src/codes';
import Report from './report';
import { mockData } from '@/mockData';
import { debounceReload, isCurProjectInXgray } from './xgray';

// open 请求不传c
// const openReg = /^(\/v1(\/account|\/user|\/api|\/market)?\/open)/;
const { siteCfg } = config;
const langByPath = getCurrentLangFromPath();
const isMockMode = window.sessionStorage.mockMode;

// 设备指纹埋点上报拦截器
fetch.interceptors.request.use(async (url, fetchConfig) => {
  const urlMatch = _.find(config.FINGERPRINT_URLS, (o) => {
    const [Url] = url.split('?');
    const pathRegExp = new RegExp(`${o.url}$`);
    return pathRegExp.test(Url);
  });

  try {
    if (urlMatch) {
      let token = await Report.logFingerprint(urlMatch.event);
      // 将token添加到header中
      if (Object.prototype.toString.call(token) === '[object Object]') {
        token = {
          TOKEN: token.token || '',
          TOKEN_SM: token.token_sm || '',
        };
      } else {
        token = { TOKEN: token };
      }

      if (token) {
        fetchConfig.headers = {
          ...fetchConfig.headers,
          ...token,
        };
      } else {
        sentry.captureEvent({
          message: `logFingerprint-null: ${token || 'token null'}`,
          level: 'fatal',
          tags: {
            fatal_type: 'error',
          },
        });
      }
    }
  } catch (error) {
    console.log('logFingerprint发生错误:', error);
    sentry.captureEvent({
      message: `logFingerprint-failed: ${error?.msg || error}`,
      level: 'fatal',
      tags: {
        fatal_type: 'error',
      },
    });
  }
  return [url, fetchConfig];
});

let xVersion = _XVERSION_; // 调试 x-version
const host = siteCfg['API_HOST.WEB'];
let connectRenewal = false;

// 根据灰度变化确定是否要进行页面刷新
function checkIfXgrayNeedReload(res) {
  const isCanceled = res.headers.get('X-GRAY-CANCELED');
  const canceledList = res.headers.get('X-GRAY-CANCELED-LIST') || '';
  const isInCanceledList = isCurProjectInXgray(canceledList);

  if (isCanceled === 'true' && isInCanceledList) {
    const isInApp = JsBridge.isApp();
    // app 内需要通知原生进行处理
    if (isInApp) {
      try {
        JsBridge.open(
          {
            type: 'func',
            params: {
              name: 'updatePackageVersion',
              enable: false,
            },
          },
          () => {
            debounceReload(`xgray canceled(in app): ${canceledList}`);
          },
        );
      } catch (e) {
        console.error('jsbrigde some error', e);
      }
    } else {
      debounceReload(`xgray canceled: ${canceledList}`);
    }
  }
  return res;
}

function checkStatus(response, url, options = {}) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status !== 401) {
    sentry.withScope((scope) => {
      scope.setFingerprint([options.method, url, String(response.status)]);
      scope.setLevel('error');
      scope.setTags({
        url: url.split('?')[0],
        requestError: 'statusError',
      });
      sentry.captureMessage(`${options.method} ${response.status} ${url}`, {
        extra: {
          request: options,
        },
      });
    });
  }
  window._KC_REPORT_?.logSelfDefined &&
    window._KC_REPORT_.logSelfDefined(`http-error-${response.status}`, response.statusText);

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

// 发布订阅器
const observer = {
  callbackList: [],
  subscribe(url, callback) {
    this.callbackList.push({ url, callback });
  },
  publish(data) {
    this.callbackList.map(({ callback }) => callback(data));
    this.callbackList = [];
  },
  checkExist(url) {
    return this.callbackList.some((i) => i.url === url);
  },
};

async function loginRenewal(url) {
  return new Promise(async (resolve) => {
    observer.subscribe(url, (success) => resolve(success));
    const renewalToken = memStorage.getItem('renewalToken');
    if (renewalToken) {
      try {
        if (connectRenewal) return;
        connectRenewal = true;
        const { success, data } = await renewalSession({ token: renewalToken });
        // 重连成功后会返回新的临时令牌和C参
        if (success) {
          setCsrf(data.c);

          // 设置现货 socket
          await workerSocket.setCsrf(data.c);
          workerSocket.connect({
            sessionPrivate: true,
          });
          // 设置合约 socket
          await futuresWorkerSocket.setCsrf(data.c);
          futuresWorkerSocket.connect({
            sessionPrivate: true,
          });

          memStorage.setItem('renewalToken', data.t);
        } else memStorage.setItem('renewalToken', null);
        observer.publish(success);
        connectRenewal = false;
      } catch (e) {
        memStorage.setItem('renewalToken', null);
        observer.publish(false);
        connectRenewal = false;
      }
    } else {
      observer.publish(false);
    }
  });
}

async function sessionRenewal(json, requestHost, options) {
  if (json.code === '401') {
    const url = requestHost.split('?')[0];
    // 重复的401请求直接放掉
    if (observer.checkExist(url)) {
      return { ...json, ignoreError: true };
    } else {
      const success = await loginRenewal(url);
      if (success) return request(requestHost, options);
    }
  }
  return json;
}

function checkError(json, url, options = {}) {
  if (typeof json.code === 'number') {
    json.code = `${json.code}`;
  }

  if (json.code >= 500 && json.code < 999) {
    window._KC_REPORT_?.logSelfDefined &&
      window._KC_REPORT_.logSelfDefined(
        `code-error-${json.code}`,
        json.msg || 'no msg in code error',
      );
  }

  if (!json.ignoreError && (typeof json.success === 'undefined' || json.success === false)) {
    if (json.code !== '401') {
      sentry.withScope((scope) => {
        scope.setFingerprint([options.method, url]);
        scope.setTags({
          url: url.split('?')[0],
          requestError: 'bizError',
        });
        sentry.captureMessage(url, {
          extra: {
            request: options,
            response: json,
          },
        });
      });
    }
    throw json;
  }

  return json;
}

function isDefaultHost(url) {
  return url.indexOf('/') === 0 && url.indexOf('//') !== 0 && url.indexOf('/_api') !== 0;
}
function isRobotHost(url) {
  return String(url).includes(siteCfg['API_HOST.ROBOT']);
}

function isFuturesHost(url) {
  return String(url).includes(siteCfg['API_HOST.FUTURES']);
}

function isAPI(url) {
  const isV2Api = false;
  // for (const key in v2ApiHosts) {
  //   if (url.indexOf(v2ApiHosts[key]) > -1) {
  //     isV2Api = true;
  //   }
  // }
  // TIPS: 合约融合改造，合约的接口需要加上 c 参数
  return isDefaultHost(url) || isV2Api || isFuturesHost(url);
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

if (process.env.NODE_ENV === 'development') {
  window.setMockMode = (status) => {
    window.sessionStorage.setItem('mockMode', status);
    window.location.reload();
  };
}

const mockFx = (url, method) => {
  if (isMockMode) {
    console.log('=====', url, method);
    const dataKey = `${url}-${method.toUpperCase()}`;
    const ret = mockData[dataKey];
    if (ret) {
      return new Promise((resolve) => {
        console.log(`====mock success ${dataKey}`, ret);
        return resolve(ret);
      });
    }
  }
  return false;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {Promise<Record<string, any>>}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
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

  const query = searchToJson(); // console.log('query', (route || {}).query);
  if (query) {
    const { _cms_ts, _cms_hash } = query;
    if (_cms_ts && _cms_hash) {
      if (url.indexOf('?') === -1) {
        url = `${url}?_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
      } else {
        url = `${url}&_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
      }
    }
  }
  const requestHost = isDefaultHost(url) ? `${host}${url}` : url;
  return fetch(requestHost, options)
    .then((res) => checkIfXgrayNeedReload(res))
    .then((res) => checkStatus(res, requestHost, options))
    .then(parseJSON)
    .then((json) => sessionRenewal(json, requestHost, options))
    .then((json) => checkError(json, requestHost, options))
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
    });
}

/**
 * Get.
 *
 * @param {string} url
 * @param {object} query
 */
export function pull(url, query = {}) {
  const isMock = mockFx(url, 'GET');
  if (isMock) {
    return isMock;
  }
  if (isAPI(url) || isRobotHost(url)) {
    query.c = memStorage.getItem('csrf') || undefined;
    query.lang = query.lang || langByPath || storage.getItem('lang', KUCOIN_LANG_KEY);
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
  });
}

/**
 * Post Fetch.
 *
 * @param {string} url
 * @param {object} data
 * @param {Boolean} disabledLang
 * @param {object} optionsConf
 */
export function postFetch(url, data = {}, disabledLang = false, isJson = false, optionsConf = {}) {
  let queryStr = '';
  if (isAPI(url) || isRobotHost(url)) {
    const query = {};

    query.c = memStorage.getItem('csrf') || undefined;

    if (!disabledLang) {
      query.lang = langByPath || storage.getItem('lang', KUCOIN_LANG_KEY);
    }

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  const options = {
    ...optionsConf,
    method: 'POST',
    body: isJson ? JSON.stringify(data) : formlize(data),
  };
  if (isJson) {
    options.headers = {
      'Content-Type': 'application/json',
      'X-Request-With': null,
      ...options.headers,
    };
  }
  return request(`${url}${queryStr}`, options);
}

/**
 * Post.
 *
 * @param {string} url
 * @param {object} data
 * @param {Boolean} disabledLang
 */
export function post(url, data = {}, disabledLang = false, isJson = false) {
  return postFetch(url, data, disabledLang, isJson);
}

/**
 * Post JSON
 *
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @param {Boolean} disabledLang
 */
export const postJson = (url, data = {}, options, disabledLang = false) => {
  return postFetch(url, data, disabledLang, true, options);
};

/**
 * Delete.
 *
 * @param {string} url
 * @param {object} query
 */
export function del(url, query = {}) {
  if (isAPI(url)) {
    query.c = memStorage.getItem('csrf') || undefined;
    query.lang = query.lang || langByPath || storage.getItem('lang', KUCOIN_LANG_KEY);
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
 * Delete JSON-Data Fetch.
 *
 * @param {string} url
 * @param {object} data
 * @param {Boolean} disabledLang
 * @param {object} optionsConf
 */
export function delPost(url, data = {}, disabledLang = false, optionsConf = {}) {
  let queryStr = '';
  if (isAPI(url) || isRobotHost(url)) {
    const query = {};

    query.c = memStorage.getItem('csrf') || undefined;

    if (!disabledLang) {
      query.lang = langByPath || storage.getItem('lang', KUCOIN_LANG_KEY);
    }

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  const options = {
    ...optionsConf,
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'X-Request-With': null,
      ...(optionsConf?.headers || {}),
    },
  };

  return request(`${url}${queryStr}`, options);
}

/**
 * put.
 *
 * @param {string} url
 * @param {object} data
 * @param {Boolean} disabledLang
 * @return {object} An object containing either "data" or "err"
 */
export function put(url, data = {}, disabledLang = false, isJson = false) {
  let queryStr = '';
  if (isAPI(url) || isRobotHost(url)) {
    const query = {};

    query.c = memStorage.getItem('csrf') || undefined;

    if (!disabledLang) {
      query.lang = langByPath || storage.getItem('lang', KUCOIN_LANG_KEY);
    }

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  const options = {
    method: 'PUT',
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
