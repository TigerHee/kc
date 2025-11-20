/**
 * Owner: iron@kupotech.com
 */
import qs from 'query-string';
import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';
import { formlize } from './utils';

const PROD_API_URL = `${window._WEB_RELATION_.KUCOIN_HOST}/_api`;
const DEV_API_URL = 'http://localhost:2999/next-web/_api';

class Http {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: __env__ === 'development' ? DEV_API_URL : PROD_API_URL,
      withCredentials: true,
    });
    this.extraParams = {};
  }

  addParams = (params) => {
    if (!isPlainObject(params)) {
      throw new Error('Expect params to be object!');
    }
    this.extraParams = {
      ...this.extraParams,
      ...params,
    };
  };

  setHost = (host) => {
    this.axiosInstance.defaults.baseURL = host;
  };

  request = (method, config = {}) => {
    return new Promise((resolve, reject) => {
      this.axiosInstance({
        method,
        ...config,
        params: {
          ...config.params,
          ...this.extraParams,
        },
      })
        .then((response) => {
          if (+response.data.code !== 200) {
            reject(response.data);
            return;
          }
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  get = (url, params) => {
    return this.request('get', { url, params });
  };

  post = (url, data, isForm) => {
    let formData = data;
    let config = {};
    if (isForm) {
      config = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      };
      formData = qs.stringify(data);
    }
    return this.request('post', { url, data: formData, ...config });
  };

  upload = (url, data) => {
    return this.request('post', { url, data: formlize(data) });
  };
}
// 创建新的实例
Http.create = (() => {
  const instances = {};

  return (key = 'http') => {
    if (typeof key !== 'string') {
      throw new Error('Expect key to be a string!');
    }
    if (!instances[key]) {
      instances[key] = new Http();
      return instances[key];
    }

    return instances[key];
  };
})();

export default Http;
