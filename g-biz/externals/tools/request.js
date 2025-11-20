/**
 * Owner: iron@kupotech.com
 */
import axios from 'axios';
import qs from 'query-string';
import each from 'lodash/each';
import i18n from '@tools/i18n';
import { getCsrf } from '@tools/csrf';
import storage from '@utils/storage';

const formlize = (obj) => {
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

if (process.env.NODE_ENV === 'production' && !window._WEB_RELATION_) {
  throw new Error('Web relation fetch failed, can not run remote apps!');
}

// 生产环境 api url, 包括跨域调用，old: http://localhost:2999/next-web/_api
const prodApiUrl = window.location.host.includes('localhost')
  ? '/_api'
  : `${window._WEB_RELATION_.KUCOIN_HOST}/_api`;

// 为了兼容老架构，这里 baseURL 的改动需要判断是否运行在 natasha 架构之下
const request = axios.create({
  baseURL: !window._natasha_version_ ? prodApiUrl : '/_api',
  withCredentials: true,
  timeout: 10000,
});

request.interceptors.request.use(function(config) {
  if (i18n && i18n.language) {
    config.params = {
      ...config.params,
      lang: i18n.language,
    };
  }

  const xversion = storage.getItem('GBIZ_XVERSION', {
    isPublic: true,
  });
  if (xversion) {
    config.params = {
      ...config.params,
      'x-version': xversion,
    };
  }

  const csrf = getCsrf();
  if (csrf) {
    config.params = {
      ...config.params,
      c: csrf,
    };
  }
  return config;
});

export const defaultInterceptor = (response) => {
  const res = response.data;
  if (res.success) {
    return Promise.resolve(res);
  }
  return Promise.reject(res);
};

export const defaultResponseInterceptorId = request.interceptors.response.use(
  defaultInterceptor,
  (err) => Promise.reject(err),
);

export const get = (url, params, options) =>
  request.get(url, {
    params,
    ...options,
  });

export const post = (url, data, isForm, options) => {
  let postData = data;
  if (isForm) {
    postData = qs.stringify(data);
  }
  const contentType = isForm ? 'application/x-www-form-urlencoded' : 'application/json';
  const _options = typeof options === 'object' ? options : {};

  const params = {
    headers: {
      'Content-Type': contentType,
      'X-App-Version': '3.93.0',
    },
    ..._options,
  };

  return request.post(url, postData, params);
};

export const upload = (url, data, otherProps = {}) => {
  return request({
    method: 'post',
    url,
    data: formlize(data),
    ...otherProps,
  });
};

export default request;
