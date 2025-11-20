/**
 * Owner: victor.ren@kupotech.com
 */
/**
 * request库
 * runtime: next/browser
 */
import qs from 'qs';
import storage, { kucoinv2Storage } from 'tools/storage';
import config from 'config';
import each from 'lodash-es/each';
import isObject from 'lodash-es/isObject';
import { getCurrentLang } from 'kc-next/i18n';
// import memoryStorage from 'tools/storage/memStorage';
import { getReport } from 'tools/report';
import { getCsrf as getToolsCsr, setCsrf as setToolsCsrf } from 'tools/csrf';
import axiosFetch from './fetch';
import cacheUtil from 'tools/cache';
import { rewriteOrigin } from 'kc-next/utils';
import { generateCacheKey } from 'kc-next/lru-cache';
import { checkIfXgrayNeedReload } from 'packages/common-base/xgray/src';
import { getNextSSRStore } from 'tools/asyncLocalStorage';

let _x_version = '';

const setXVersion = (xversion: string) => {
  _x_version = xversion;
  storage.setItem('_x_version', xversion);
};

export const initClientXVersion = () => {
  if (typeof window !== 'undefined') {
    // 客户端注入setXVersion
    // @ts-ignore
    window.setXVersion = setXVersion;
  }
};
const formlize = (obj: any) => {
  if (obj instanceof FormData) {
    return obj;
  }
  const form = new FormData();
  each(obj, (value, key) => {
    if (typeof value !== 'undefined') {
      form.append(key, value);
    }
  });
  return form;
};

// open 请求不传c
// const openReg = /^(\/v1(\/account|\/user|\/api|\/market)?\/open)/;

async function checkStatus(response, url, options = {}) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const Report = await getReport();
  Report?.logSelfDefined(`http-error-${response.status}`, response.statusText);

  const error = {
    msg: response.statusText,
    response,
  };
  throw error;
}

// 类型增强的JSON解析
function parseJSON(response) {
  if (typeof response.data === 'object') {
    return response.data;
  }
  try {
    return JSON.parse(response.data);
  } catch (e: any) {
    throw new Error(`Failed to parse response JSON: ${e.message}`);
  }
}

async function checkError(json, url, options = {}) {
  if (typeof json.code === 'number') {
    json.code = `${json.code}`;
  }

  if (json.code >= 500 && json.code < 999) {
    const Report = await getReport();
    Report?.logSelfDefined(`code-error-${json.code}`, json.msg || 'no msg in code error');
  }

  if (typeof json.success === 'undefined' || json.success === false) {
    throw json;
  }

  return json;
}

function isUsingDefaultHost(url) {
  return (
    url.indexOf('/') === 0 && url.indexOf('//') !== 0 && url.indexOf('/_api') !== 0 && url.indexOf('/_api_robot') !== 0 && url.indexOf('/_pxapi') !== 0
  );
}

function isAPI(url) {
  let isV2Api = false;
  const { v2ApiHosts } = config;

  Object.keys(v2ApiHosts).forEach(key => {
    // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
    if (url.indexOf(v2ApiHosts[key]) > -1) {
      isV2Api = true;
    }
  });

  return isUsingDefaultHost(url) || isV2Api;
}

// 简单的url校验
function isValidUrl(str) {
  const pattern = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[^\s]*)?$/i;
  return pattern.test(str);
}

export function setCsrf(value = '') {
  if (typeof window !== 'undefined') {
    setToolsCsrf(value);
  }
}

const isServer = typeof window === 'undefined';

async function request(url: string, options: any) {
  const method = (options.method || 'GET').toUpperCase();
  const enableCache =
    isServer && method === 'GET' && options.cache && process.env.NEXT_PUBLIC_API_CACHE && process.env.KC_CDN_SITE_TYPE;
  let queryKey = url;
  if (options.params) {
    queryKey += `?${new URLSearchParams(options.params).toString()}`;
  }

  const cacheKey = isServer ? generateCacheKey(queryKey, process.env.KC_CDN_SITE_TYPE || '') : '';

  if (enableCache) {
    const cached = cacheUtil.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  const { v2ApiHosts } = config;

  // 就是/api
  const WEB_API_PREFIX = v2ApiHosts.WEB;

  // server端要带上协议和host(NEXT_PUBLIC_API_URL),
  // 服务端不用带上
  let baseURL =
    isServer && process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}${WEB_API_PREFIX}`
      : WEB_API_PREFIX;

  // 如果传了baseURL, 并且不是一个完整URL（比如是/api_robot, 而不是https://test.com/api这种)，
  // 就不用WEB_API_PREFIX，直接使用 NEXT_PUBLIC_API_URL(服务端) 或者 空(客户端)
  if (options.baseURL && !isValidUrl(options.baseURL)) {
    baseURL =
      isServer && process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}${options.baseURL}`
        : options.baseURL;
    options.baseURL = '';
  }

  let requestUrl = '';
  // 对于合约这种baseURL是KUMEX_GATE_WAY的场景
  // options.baseURL是完整url
  const isFullUrl = isValidUrl(options.baseURL || '');

  if (isFullUrl) {
    // 如果baseUrl是完整URL，那么直接和url拼起来
    requestUrl = `${options.baseURL}${url}`;
    options.baseURL = '';
  } else {
    // 如果不带/api这种前缀, 就带上baseUrl（server端会带上host）,绝大部分请求都是isUsingDefaultHost
    requestUrl = isUsingDefaultHost(url) ? `${baseURL}${url}` : url;
  }

  options.mode = options.mode || 'cors';
  options.credentials = options.credentials || 'include';

  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (isServer && process.env.KC_CDN_SITE_TYPE) {
    options.headers['x-kc-cdn-site-type'] = process.env.KC_CDN_SITE_TYPE;
    options.headers['x-site'] = process.env.KC_CDN_SITE_TYPE;
  }

  // 设置xversion 服务端使用
  const store = getNextSSRStore();
  const xVersion = isServer ? store.headers?.['_x_version'] : storage.getItem('_x_version');

  if (xVersion) {
    const params = { ['x-version']: xVersion };
    if (options.params) {
      options.params = { ...options.params, ...params };
    } else {
      options.params = params;
    }
  }

  // 网关取的顺序
  // kc-client-real-ip
  // true-client-ip
  // cf-connecting-ip
  // X-Real-IP
  // x-forwarded-for
  if (isServer && store.headers?.['kc-client-real-ip'] && store.headers?.['kc-client-real-ip'] !== 'undefined') {
    options.headers['kc-client-real-ip'] = store.headers?.['kc-client-real-ip'];
  }
  if (isServer && store.headers?.['true-client-ip'] && store.headers?.['true-client-ip'] !== 'undefined') {
    options.headers['true-client-ip'] = store.headers?.['true-client-ip'];
  }
  if (isServer && store.headers?.['cf-connecting-ip'] && store.headers?.['cf-connecting-ip'] !== 'undefined') {
    options.headers['cf-connecting-ip'] = store.headers?.['cf-connecting-ip'];
  }
  if (isServer && store.headers?.['x-real-ip'] && store.headers?.['x-real-ip'] !== 'undefined') {
    options.headers['x-real-ip'] = store.headers?.['x-real-ip'];
  }
  if (isServer && store.headers?.['x-forwarded-for'] && store.headers?.['x-forwarded-for'] !== 'undefined') {
    options.headers['x-forwarded-for'] = store.headers?.['x-forwarded-for'];
  }

  try {
    const agent = rewriteOrigin(baseURL);
    if (agent) {
      options.httpsAgent = agent;
    }
    const response = await axiosFetch(requestUrl, options);
    // 检查是否在灰度中需要重新加载
    checkIfXgrayNeedReload(response, process.env.NEXT_PUBLIC_APP_NAME);
    await checkStatus(response, url, options);
    const json = parseJSON(response);
    await checkError(json, url, options);
    if (enableCache) {
      cacheUtil.set(cacheKey, json);
    }
    return json;
  } catch (e: any) {
    if (typeof e === 'object') {
      e._req_host = requestUrl;

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
export function pull(url: string, query: { [key: string]: any } = {}, options = {}) {
  if (isAPI(url)) {
    const currentLang = getCurrentLang();
    query.c = typeof window !== 'undefined' ? getToolsCsr() : undefined;
    query.lang = query.lang || currentLang || kucoinv2Storage.getItem('lang');
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
export function post(url: string, data = {}, disabledLang = false, isJson = false, headers = {}) {
  let queryStr = '';
  const langByPath = getCurrentLang();
  if (isAPI(url)) {
    const query: { [key: string]: any } = {};

    query.c = typeof window !== 'undefined' ? getToolsCsr() : undefined;

    if (!disabledLang) {
      query.lang = langByPath || kucoinv2Storage.getItem('lang');
    }

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  const options: { [key: string]: any } = {
    method: 'POST',
    headers,
    data: isJson ? data : formlize(data),
  };
  if (isJson) {
    options.headers = {
      'Content-Type': 'application/json',
      'X-Request-With': null,
      ...headers,
    };
  }
  // 如果指定是表单
  if (options.headers && options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    options.data = qs.stringify(data);
  }
  return request(`${url}${queryStr}`, options);
}

/**
 * Post Json
 *
 * @param {string} url
 * @param {object} data
 * @param {boolean} disabledLang
 * @return {Promise<any>}
 */
export function postJson(url: string, data: any = {}, disabledLang = false) {
  return post(url, data, disabledLang, true);
}

/**
 * Delete.
 *
 * @param {string} url
 * @param {object} query
 * @return {object} An object containing either "data" or "err"
 */
export function del(url: string, query: { [key: string]: any } = {}) {
  const langByPath = getCurrentLang();
  if (isAPI(url)) {
    query.c = typeof window !== 'undefined' ? getToolsCsr() : undefined;
    query.lang = query.lang || langByPath || kucoinv2Storage.getItem('lang');
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
 * put.
 *
 * @param {string} url
 * @param {object} data
 * @param {Boolean} disabledLang
 * @return {object} An object containing either "data" or "err"
 */
export function put(url, data = {}, disabledLang = false, isJson = false) {
  let queryStr = '';
  const langByPath = getCurrentLang();
  if (isAPI(url)) {
    const query: { [key: string]: any } = {};

    query.c = typeof window !== 'undefined' ? getToolsCsr() : undefined;

    if (!disabledLang) {
      query.lang = langByPath || kucoinv2Storage.getItem('lang');
    }

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  const options: { [key: string]: any } = {
    method: 'PUT',
    data: isJson ? data : formlize(data),
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
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export const requestForApi = <D extends {}>(opt: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: D;
  headers?: Record<string, any>;
  meta?: Record<string, any>;
}) => {
  const { url, method, body, meta = {}, headers = {}, ...options } = opt;

  const { isJson, disabledLang } = meta;
  // 必须要有 return, 否则返回的就不是 promise
  if (method === 'GET') {
    // url 里面已经包含了 query 内容
    return pull(url, {}, options);
  } else if (method === 'POST') {
    return post(url, body, disabledLang, isJson ?? headers['Content-Type'] === 'application/json', headers);
  } else if (method === 'DELETE') {
    return del(url);
  }
};

export const upload = (url: string, { data, ...otherProps }) => {
  let queryStr = '';
  const langByPath = getCurrentLang();
  if (isAPI(url)) {
    const query: { [key: string]: any } = {};

    query.c = typeof window !== 'undefined' ? getToolsCsr() : undefined;

    query.lang = langByPath || kucoinv2Storage.getItem('lang');

    queryStr = qs.stringify(query);
    if (url.indexOf('?') === -1) {
      queryStr = `?${queryStr}`;
    } else {
      queryStr = `&${queryStr}`;
    }
  }
  return request(`${url}${queryStr}`, { method: 'POST', data: formlize(data), ...otherProps });
};

export default request;
