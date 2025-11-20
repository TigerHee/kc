/**
 * Owner: borden@kupotech.com
 */
/**
 * 针对fetch封装请求拦截器, 暂时只有请求拦截
 * TODO: 响应拦截器
 */
import 'isomorphic-fetch';
import _ from 'lodash';

const interceptors_req = [];

const _fetch = async (url, config) => {
  for (const fn of interceptors_req) {
    [url, config] = await fn(url, config);
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
