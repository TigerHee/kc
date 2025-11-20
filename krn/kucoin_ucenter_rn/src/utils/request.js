/**
 * Owner: willen@kupotech.com
 */
import {AsyncStorage} from 'react-native';
import qs from 'qs';
import {setStorageRequest} from '@krn/ui/lib/components/DebugBar/Network/utils';
import {formlize, getNativeInfo} from 'utils/helper';

let csrf;

async function fetchMiddleware(res, options) {
  const storageObj = {
    id: Math.random() + Date.now() + '',
    url: res.url.split('?')[0],
    query: JSON.stringify(qs.parse(res.url.split('?')[1])),
    param: options?.body,
    status: res.status,
    date: res?.headers.map.date,
    method: options?.method,
  };
  if (res.status >= 200 && res.status < 300) {
    const json = await res.json();
    json.code = `${json.code}`;
    setStorageRequest({...storageObj, body: JSON.stringify(json)});
    if (typeof json.success === 'undefined' || json.success === false) {
      const {headers, statusText, url} = res;
      const resData = {headers: JSON.stringify(headers), statusText, url};

      throw {...json, resData, options};
    }
    return json;
  }
  setStorageRequest(storageObj);

  throw {
    msg: res.statusText || 'Network Error',
    res,
  };
}

export function setCsrf(c) {
  csrf = c;
}

// 代理请求
async function rewriteRequestUrl(url) {
  let fullUrl = url;
  if (url.indexOf('http') >= 0) return url;
  const {webApiHost} = await getNativeInfo();
  let BASE_URL = `https://${webApiHost}/_api`;
  // 合约请求不需要加_api
  if (url.indexOf('/_api_kumex') >= 0) BASE_URL = BASE_URL.replace('/_api', '');
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

export async function pull(url, query = {}) {
  const {lang} = await getNativeInfo();
  let queryStr = qs.stringify({lang, c: csrf, ...query});
  if (url.indexOf('?') === -1) queryStr = `?${queryStr}`;
  else queryStr = `&${queryStr}`;
  return request(`${url}${queryStr}`, {
    method: 'GET',
  });
}

export async function post(
  url,
  data = {},
  disabledLang = false,
  isJson = false,
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

  return request(`${url}${queryStr}`, options);
}
