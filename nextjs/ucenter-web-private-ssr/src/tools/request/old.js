/**
 * Owner: willen@kupotech.com
 */
/**
 * request库
 * runtime: next/browser
 */
import JsBridge from 'gbiz-next/bridge';
import fetch from './fetch';
import { config } from 'config/base';
import { setCsrf as gbizSetCsrf } from 'gbiz-next/request';
import { FINGERPRINT_URLS } from 'config/base';
import { replace, toLower } from 'lodash-es';
import { pathToRegexp } from 'path-to-regexp';
import qs from 'query-string';
import { getReport } from 'gbiz-next/report';
import { getCurrentLangFromPath } from 'tools/i18n';
import formlize from 'utils/formlize';
import { trackRequest } from 'utils/ga';
import storage from 'utils/storage';
import memStorage from 'tools/memStorage';
import { searchToJson } from '@/helper';
import { IS_SERVER_ENV } from 'kc-next/env';

// 检查当前项目是否在灰度列表中，支持 curProjectName 为数组
const isCurProjectInXgray = (xgray = '', curProjectName) => {
  const projects = Array.isArray(curProjectName) ? curProjectName : [curProjectName];
  return projects.some((project) => xgray && xgray.toLowerCase().includes(project.toLowerCase()));
};

const checkIfXgrayNeedReload = (res, curProjectName) => {
  const isCanceled = res.headers.get('X-GRAY-CANCELED');
  const canceledList = res.headers.get('X-GRAY-CANCELED-LIST') || '';
  const isInCanceledList = isCurProjectInXgray(canceledList, curProjectName);

  if (isCanceled === 'true' && isInCanceledList) {
    // app 内需要通知原生进行处理
    if (JsBridge.isApp()) {
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
};

const { v2ApiHosts } = config;
const host = v2ApiHosts.WEB;

// const SERVICE_ERROR_CODE_REG = /^5\d{2}$/;
// open 请求不传c
// const openReg = /^(\/v1(\/account|\/user|\/api|\/market)?\/open)/;
const langByPath = getCurrentLangFromPath();

export const bindOldFetchInterceptors = () => {
  // 设备指纹埋点上报拦截器
  fetch.interceptors.request.use(async (url, fetchConfig) => {
    const urlMatch = FINGERPRINT_URLS.find((o) => {
      const [Url] = url.split('?');
      const path = replace(Url, host, '');
      const pathRegExp = pathToRegexp(o.url);
      let isMatch = pathRegExp.test(path) || (o.isGatewayOauth && path.includes(o.url));

      if (isMatch && o.method) {
        isMatch = toLower(o.method) === toLower(fetchConfig.method);
      }
      return isMatch;
    });

    if (!urlMatch) {
      return [url, fetchConfig];
    }

    const Report = await getReport();

    if (Report) {
      const token = await Report.logFingerprint(urlMatch.event);

      //token重新取值
      let tokenObj = {};
      if (Object.prototype.toString.call(token) === '[object Object]') {
        tokenObj = {
          token_sm: token?.token_sm,
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
};

let xVersion = ''; // 调试 x-version

async function checkStatus(response, url, options = {}) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const Report = await getReport();

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
  return (
    url.indexOf('/') === 0 &&
    url.indexOf('//') !== 0 &&
    url.indexOf('/_api_kumex') !== 0 &&
    url.indexOf('/_pxapi') !== 0 &&
    url.indexOf('/_api') !== 0
  );
}

function isAPI(url) {
  let isV2Api = false;
  // zendesk接口不需要语言参数
  if (url.startsWith('/zendesk')) {
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
  gbizSetCsrf(value);
}

export function setXVersion(value = '') {
  try {
    xVersion = value;
    storage.setItem('_x_version', value);
    localStorage.GBIZ_XVERSION = JSON.stringify(value);
    // 主站、澳洲、欧洲：
    localStorage.setItem('!_KC__x_version', value);
    localStorage.setItem('!_AU__x_version', value);
    localStorage.setItem('!_EU__x_version', value);
    // 泰国：
    localStorage.setItem('!_TH__x_version', value);
    // 土耳其：
    localStorage.setItem('!_TR__x_version', value);
  } catch (error) {}
}

// runtime: browser
if (!IS_SERVER_ENV) {
  window.setXVersion = setXVersion;
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
    if (json?.code === '401') {
      const url = requestHost.split('?')[0];
      // 若通过App 接口获取到用户并未登陆, 此时无需刷新
      const shouldRefresh = await shouldRefreshSession();
      if (!shouldRefresh) return json;
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
async function shouldRefreshSession() {
  const supportUserInfo = await isSupportUserInfo();
  // 旧版本的 App, fallbak处理, 需要刷新
  if (!supportUserInfo) return true;
  return new Promise((resolve) => {
    JsBridge.open(
      {
        type: 'func',
        params: { name: 'getUserInfo' },
      },
      (result) => {
        // 仅当成功调用 getUserInfo 且用户未登录时, 才无需刷新 session; 其他情况都需要刷新
        return resolve(!(result && result.code && result.data && !result.data.uid));
      },
    );
  });
}
let isSupportUserInfoCache = null;
// 支持获取用户信息的App版本
const SUPPORT_USER_INFO_VERSION = '3.101.0';
async function isSupportUserInfo() {
  if (isSupportUserInfoCache === null) {
    isSupportUserInfoCache = await new Promise((resolve) => {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'getAppVersion' },
        },
        ({ data: version }) => {
          // 简单的版本比较, 仅支持 三段式纯数字的版本号
          const isSupport =
            String(version).localeCompare(SUPPORT_USER_INFO_VERSION, undefined, {
              numeric: true,
              sensitivity: 'base',
            }) >= 0;
          resolve(!!version && isSupport);
        },
      );
    });
  }
  return isSupportUserInfoCache;
}

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

  const query = searchToJson();
  const { _cms_ts, _cms_hash } = query || {};

  if (_cms_ts && _cms_hash) {
    if (_cms_ts && _cms_hash) {
      if (url.indexOf('?') === -1) {
        url = `${url}?_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
      } else {
        url = `${url}&_cms_ts=${_cms_ts}&_cms_hash=${_cms_hash}`;
      }
    }
  }

  const requestHost = isDefaultHost(url)
    ? `${
      IS_SERVER_ENV && process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}${host}`
        : host
    }${url}`
    : url;

  try {
    const beginTime = +Date.now();
    const response = await fetch(requestHost, options);
    trackRequest(requestHost, +Date.now() - beginTime);
    await checkIfXgrayNeedReload(response, ['ucenter-web-private-ssr']);
    await checkStatus(response, url, options);
    const json = await parseJSON(response);
    const json_new = await sessionInAppRenewal(json, requestHost, options);
    await checkError(json_new, url, options);
    return json_new;
  } catch (e) {
    console.error('request error:', e, url, requestHost);
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
    query.lang = query.lang || langByPath || storage.getItem('lang');
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
 * @param {object} headers
 * @return {object} An object containing either "data" or "err"
 */
export function postV2({ url, data = {}, disabledLang = false, isJson = false, headers = {} }) {
  let queryStr = '';
  if (isAPI(url)) {
    const query = {};

    query.c = memStorage.getItem('csrf') || undefined;

    if (!disabledLang) {
      query.lang = langByPath || storage.getItem('lang');
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
      ...headers,
      'Content-Type': 'application/json',
      'X-Request-With': null,
    };
  } else {
    options.headers = headers;
  }
  return request(`${url}${queryStr}`, options);
}
export function post(url, data = {}, disabledLang = false, isJson = false, headers = {}) {
  return postV2({ url, data, disabledLang, isJson, headers });
}

/**
 * Delete.
 *
 * @param {string} url
 * @param {object} query
 * @return {object} An object containing either "data" or "err"
 */
export function del(url, query = {}, options = {}) {
  if (isAPI(url)) {
    query.c = memStorage.getItem('csrf') || undefined;
    query.lang = query.lang || langByPath || storage.getItem('lang');
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
    ...options,
  });
}

/**
 * Post Json
 *
 * @param {string} url
 * @param {object} data
 * @param {boolean} disabledLang
 * @return {Promise<any>}
 */
export const postJson = (url, data = {}, disabledLang = false) => {
  return post(url, data, disabledLang, true);
};

export const requestForApi = (opt) => {
  const { url, method, body, meta = {}, ...options } = opt;

  const { isJson, disabledLang } = meta;
  // 必须要有 return, 否则返回的就不是 promise
  if (method === 'GET') {
    // url 里面已经包含了 query 内容
    return pull(url, {}, options);
  } else if (method === 'POST') {
    return postV2({ url, data: body, disabledLang, isJson });
  } else if (method === 'DELETE') {
    return del(url);
  }
};
