/**
 * Owner: willen@kupotech.com
 */
/**
 * 针对fetch封装请求拦截器, 暂时只有请求拦截
 * TODO: 响应拦截器
 */
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

const interceptors_req = [];

const _fetch = async (url, config) => {
  for (const fn of interceptors_req) {
    [url, config] = await fn(url, config); // eslint-disable-line
  }
  return fetch(url, config);
};

_fetch.interceptors = {
  request: {
    use(callback) {
      if (_.isFunction(callback)) {
        interceptors_req.push(callback);
      }
    },
  },
};

export default _fetch;
