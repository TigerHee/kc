/**
 * Owner: borden@kupotech.com
 */
// 超时重试拦截器
export const retryInterceptor = (err, axiosInstance) => {
  if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    const { config } = err;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) {
      err.msg = err.message;
      return Promise.reject(err);
    } else {
      config.__retryCount += 1;
      const backOff = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, config.retryDelay || 1);
      });
      return backOff.then(() => {
        const { baseURL: base, url } = config;
        if (url.indexOf(base) === 0) {
          config.url = url.substr(base.length);
        }
        return axiosInstance(config);
      });
    }
  } else {
    return Promise.reject(err);
  }
};

// 后端code拦截器，errorHandler
export const serverCodeInterceptor = (response) => {
  const { data } = response;
  if (data.code != null) {
    data.code = `${data.code}`;
  }
  if (data && data.success) {
    return Promise.resolve(data);
  } else {
    return Promise.reject(data);
  }
};

// http状态码拦截器
export const httpStatusInterceptor = (err) => {
  if (err && err.response) {
    if (err.response.data) {
      return serverCodeInterceptor(err.response);
    } else {
      const httpError = new Error();
      httpError.msg = err.statusText;
      httpError.response = err.response;
      return Promise.reject(httpError);
    }
  }
};
