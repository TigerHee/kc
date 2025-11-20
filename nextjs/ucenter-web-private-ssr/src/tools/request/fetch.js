/**
 * Owner: hanx.wei@kupotech.com
 */
/**
 * 针对fetch封装请求拦截器和响应拦截器
 */
import { isFunction } from 'lodash-es';
const interceptors_req = [];
const interceptors_res = [];

const _fetch = async (url, config) => {
  for (const fn of interceptors_req) {
    [url, config] = await fn(url, config);
  }

  return new Promise((resolve, reject) => {
    fetch(url, config)
      .then((res) => {
        interceptors_res.forEach((func) => {
          res = func(res);
        });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

_fetch.interceptors = {
  request: {
    use(callback) {
      if (isFunction(callback)) {
        interceptors_req.push(callback);
      }
    },
  },
  response: {
    use(callback) {
      if (isFunction(callback)) {
        interceptors_res.push(callback);
      }
    },
  },
};

export default _fetch;
