import qs from 'qs';
import {AsyncStorage} from 'react-native';
import {setStorageRequest} from '@krn/ui/lib/components/DebugBar/Network/utils';

import {API_HOST_CONFIGS} from 'config/index';
import {formlize, getNativeInfo} from 'utils/helper';

let csrf;

const DEFAULT_TOAST = 'Network Error';

async function fetchMiddleware(res, options) {
  res = res || {};
  options = options || {};
  const storageObj = {
    id: Math.random() + Date.now() + '',
    url: res.url?.split?.('?')?.[0],
    query: JSON.stringify(qs.parse(res.url?.split?.('?')?.[1])),
    param: options.body,
    status: res.status,
    date: res.headers?.map?.date,
    method: options.method,
  };
  if (res.status >= 200 && res.status < 300) {
    const json = await res.json();
    json.code = `${json.code}`;
    setStorageRequest({...storageObj, body: JSON.stringify(json)});
    if (typeof json.success === 'undefined' || json.success === false) {
      throw json;
    }
    return json;
  }

  setStorageRequest(storageObj);
  throw {
    msg: res.statusText || DEFAULT_TOAST,
    success: false,
    httpStatus: res.status,
  };
}

export function setCsrf(c) {
  csrf = c;
}

// 代理请求
async function rewriteRequestUrl(url) {
  let fullUrl = url;
  if (url.indexOf('http') >= 0) return url;
  const NATIVE_INFO = await getNativeInfo();
  if (Object.values(API_HOST_CONFIGS).some(host => url.indexOf(host) === 0)) {
    return `https://${NATIVE_INFO.webApiHost}${url}`;
  }

  let BASE_URL = `https://${NATIVE_INFO.webApiHost}/_api`;
  fullUrl = `${BASE_URL}${fullUrl}`;
  return fullUrl;
}

export default async function request(url, options = {}) {
  options.mode = options.mode || 'cors';
  options.credentials = options.credentials || 'include';
  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  };
  // 优先从本地取
  let xversion = await AsyncStorage.getItem('DEBUG_X_VERSION');
  // 本地取不到从app取
  if (!xversion) xversion = (await getNativeInfo())?.xversion;
  if (xversion) {
    if (url.indexOf('?') === -1) url = `${url}?x-version=${xversion}`;
    else url = `${url}&x-version=${xversion}`;
  }

  return fetch(await rewriteRequestUrl(url), options).then(res =>
    fetchMiddleware(res, options),
  );
}

export async function pull(url, query = {}, overrideHeaders = {}) {
  const {lang} = await getNativeInfo();
  let queryStr =
    qs.stringify({lang, c: csrf, ...query}, {addQueryPrefix: true}) || '';
  return request(`${url}${queryStr}`, {
    method: 'GET',
    headers: overrideHeaders,
  });
}

export async function post(
  url,
  data = {},
  disabledLang = false,
  isJson = false,
  overrideHeaders,
) {
  let queryStr;
  const query = {
    c: csrf,
  };
  if (!disabledLang) {
    const {lang} = await getNativeInfo();
    query.lang = lang || undefined;
  }

  queryStr = qs.stringify(query);
  if (url.indexOf('?') === -1) {
    queryStr = `?${queryStr}`;
  } else {
    queryStr = `&${queryStr}`;
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
  if (overrideHeaders) {
    options.headers = {
      ...(options.headers || {}),
      ...(overrideHeaders || {}),
    };
  }

  return request(`${url}${queryStr}`, options);
}

/**
 * Post Json
 *
 * @param {string} url
 * @param {object} data
 * @param {boolean} disabledLang
 */
export const postJson = (
  url,
  data = {},
  disabledLang = false,
  overrideHeaders,
) => {
  return post(url, data, disabledLang, true, overrideHeaders);
};

export const deleteRequest = async (url, query = {}, overrideHeaders = {}) => {
  const {lang} = await getNativeInfo();
  let queryStr =
    qs.stringify({lang, c: csrf, ...query}, {addQueryPrefix: true}) || '';
  return request(`${url}${queryStr}`, {
    method: 'DELETE',
    headers: overrideHeaders,
  });
};
