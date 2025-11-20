/**
 * Owner: borden@kupotech.com
 */
import axios from 'axios';
import { formlize } from 'helper';
import { DEFAULT_LANG } from 'config';
import { KUCOIN_LANG_KEY } from 'src/codes';
import storage from '../storage';
import { retryInterceptor, serverCodeInterceptor, httpStatusInterceptor } from './interceptors';

// TODO: 生产环境请求的host修改
const baseURL = _GATE_WAY_;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000, // 客户端超时时间，若请求超过这个时间会根据配置的超时重试次数和超时重试间隔尝试重新请求
  retry: 5, // 客户端超时重试次数
  retryDelay: 1000, // 客户端超时重试间隔
});
const interceptorComposer = (...fns) => (err) => {
  let result;
  for (let i = 0; i < fns.length; i++) {
    result = fns[i](err, axiosInstance);
    if (result instanceof Promise) {
      break;
    }
  }
  return result;
};

// 设置请求拦截器
// TODO: 根据业务设置请求拦截器
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = storage.getItem('csrfToken');
  const lang = storage.getItem('lang', KUCOIN_LANG_KEY) || DEFAULT_LANG;
  config.params = {
    ...config.params,
    lang,
  };
  if (csrfToken) {
    config.params = {
      ...config.params,
      c: csrfToken,
    };
  }
  return config;
});

// 设置响应拦截器
axiosInstance.interceptors.response.use(
  serverCodeInterceptor,
  interceptorComposer(httpStatusInterceptor, retryInterceptor),
);

export const postForm = (url, data, cfg = {}) => {
  // const query = {};
  // query.lang = storage.getItem('lang', KUCOIN_LANG_KEY) || DEFAULT_LANG;
  // let queryStr = qs.stringify(query);
  // if (url.indexOf('?') === -1) {
  //   queryStr = `?${queryStr}`;
  // } else {
  //   queryStr = `&${queryStr}`;
  // }
  return axiosInstance.post(url, data, {
    transformRequest: formlize,
    ...cfg,
  });
};

export const post = postForm;

export const postJson = (url, data, cfg = {}) => {
  // const query = {};
  // query.lang = storage.getItem('lang', KUCOIN_LANG_KEY) || DEFAULT_LANG;
  // let queryStr = qs.stringify(query);
  // if (url.indexOf('?') === -1) {
  //   queryStr = `?${queryStr}`;
  // } else {
  //   queryStr = `&${queryStr}`;
  // }
  return axiosInstance.post(url, data, {
    ...cfg,
  });
};

export const pull = (url, params, cfg = {}) => {
  return axiosInstance.get(url, {
    params,
    ...cfg,
  });
};

export default axiosInstance;
