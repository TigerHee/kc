import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults, AxiosError } from 'axios';
import {
  encryptRequest,
  addCsrfToken,
  addLang,
  addXVersion,
  // addXSite,
  deviceFinger,
} from './interceptors/request';
import { checkXGray, checkBizCode, decryptResponse } from './interceptors/response';
import {
  RequestInterceptorObject,
  RequestInterceptor,
  ResponseInterceptorObject,
  ResponseInterceptor,
  Response,
  CreateHttpClientConfig,
  RequestConfig,
  RequestConfigWithExtra,
} from './types';
/**
 * 预置请求拦截器
 * 请求加密可能会对 body整体加密，放在最后执行，优先级为 0，其他的顺序随意
 */
const PRESET_REQUEST_INTERCEPTORS: RequestInterceptor[] = [
  addCsrfToken,
  addLang,
  addXVersion,
  // addXSite,
  encryptRequest,
  deviceFinger,
];

/**
 * 预置响应拦截器
 * 响应拦截器执行顺序：
 * 灰度检查(优先级 1000) -> 响应解密(优先级999) -> app session自动刷新(优先级100) -> 业务状态码检查(优先级1)
 */
const PRESET_RESPONSE_INTERCEPTORS: ResponseInterceptor[] = [
  checkXGray,
  decryptResponse,
  checkBizCode,
];

class HttpClient {
  private instance: AxiosInstance;
  private requestInterceptors = new Map<
    string,
    { interceptor: RequestInterceptorObject; id: number }
  >();
  private responseInterceptors = new Map<
    string,
    { interceptor: ResponseInterceptorObject; id: number }
  >();
  private config: CreateHttpClientConfig;
  private sentry: any;

  static create(config: CreateHttpClientConfig) {
    return new HttpClient(config);
  }

  constructor(config: CreateHttpClientConfig) {
    this.config = config;
    this.sentry = config.sentry;
    const axiosConfigKeys = [
      'url',
      'method',
      'baseURL',
      'allowAbsoluteUrls',
      'transformRequest',
      'transformResponse',
      'headers',
      'params',
      'paramsSerializer',
      'data',
      'timeout',
      'timeoutErrorMessage',
      'withCredentials',
      'adapter',
      'auth',
      'responseType',
      'responseEncoding',
      'xsrfCookieName',
      'xsrfHeaderName',
      'onUploadProgress',
      'onDownloadProgress',
      'maxContentLength',
      'validateStatus',
      'maxBodyLength',
      'maxRedirects',
      'maxRate',
      'beforeRedirect',
      'socketPath',
      'transport',
      'httpAgent',
      'httpsAgent',
      'proxy',
      'cancelToken',
      'decompress',
      'transitional',
      'signal',
      'insecureHTTPParser',
      'env',
      'formSerializer',
      'family',
      'lookup',
      'withXSRFToken',
      'fetchOptions',
    ];
    // axios每次请求都会将创始化的config merge 进去，这里只传入axios自己的配置
    const createHttpClientConfig = Object.keys(config)
      .filter((v) => axiosConfigKeys.includes(v))
      .reduce((acc, key) => {
        acc[key as keyof CreateAxiosDefaults] = config[key as keyof typeof config];
        return acc;
      }, {} as CreateAxiosDefaults);

    // 创建axios实例，并设置默认配置
    this.instance = axios.create(createHttpClientConfig);
    this.initInterceptors();
  }

  private reportInfo(
    message: string,
    level: 'info' | 'warn' | 'error' = 'error',
    tags?: any,
    extra?: any,
  ) {
    if (!this.sentry) {
      return;
    }
    try {
      this.sentry.captureEvent({
        message,
        level,
        tags: {
          ...tags,
        },
        fingerprint: '网络请求库',
        extra,
      });
    } catch (e) {
      console.error(`[http-client] sentry report error,  ${e}`);
    }
  }

  /**
   * 请求拦截器排序、注册
   * @param interceptors
   */
  private registerRequestInterceptors(interceptors: RequestInterceptor[]) {
    this.requestInterceptors.clear();
    this.instance.interceptors.request.clear();
    // 请求拦截器先注册的后执行
    const sortedInterceptorList = interceptors
      .map((v) => (typeof v === 'function' ? v(this.config) : v))
      .sort((v1, v2) => (v1.priority ?? 1) - (v2.priority ?? 1));
    sortedInterceptorList.forEach((v) => {
      if (this.requestInterceptors.has(v.name)) {
        return;
      }
      const id = this.instance.interceptors.request.use(v.onFulfilled, v.onRejected, {
        runWhen: (config: RequestConfigWithExtra) => {
          const useInterceptors = config.useInterceptors?.request;
          const disableCurrentInterceptor = config.disableInterceptors?.request?.includes(v.name);
          if (disableCurrentInterceptor) {
            return false;
          }
          // 请求未指定使用拦截器，使用默认
          if (!useInterceptors) {
            return typeof v.runWhen === 'function' ? v.runWhen(config) : true;
          }
          // 空数组禁用全部拦截器
          if (useInterceptors.length === 0) {
            return false;
          }
          if (useInterceptors.includes(v.name)) {
            return typeof v.runWhen === 'function' ? v.runWhen(config) : true;
          }
          return false;
        },
      });
      this.requestInterceptors.set(v.name, { interceptor: v, id });
    });
  }

  /**
   * 响应拦截器排序、注册
   * @param interceptors
   */
  private registerResponseInterceptors(interceptors: ResponseInterceptor[]) {
    this.responseInterceptors.clear();
    this.instance.interceptors.response.clear();
    const sortedInterceptorList = interceptors
      .map((v) => (typeof v === 'function' ? v(this.config) : v))
      .sort((v1, v2) => (v2.priority ?? 1) - (v1.priority ?? 1));
    // 响应拦截器先注册的先执行
    sortedInterceptorList.forEach((v) => {
      if (this.responseInterceptors.has(v.name)) {
        return;
      }
      const id = this.instance.interceptors.response.use(
        (response) => {
          if (typeof v.onFulfilled !== 'function') {
            return response;
          }
          const config = response.config as RequestConfigWithExtra;
          const useInterceptors = config.useInterceptors?.response;
          const disableCurrentInterceptor = config.disableInterceptors?.response?.includes(v.name);
          if (disableCurrentInterceptor) {
            return response;
          }
          if (!useInterceptors) {
            return v.onFulfilled(response);
          }
          if (useInterceptors.length === 0) {
            return response;
          }
          if (useInterceptors.includes(v.name)) {
            return v.onFulfilled(response);
          }
          return response;
        },
        (e) => {
          // 内部拦截器重试不走后面拦截器的reject逻辑
          if (e.config?.__retry__ || typeof v.onRejected !== 'function') {
            return Promise.reject(e);
          }
          return v.onRejected(e);
        },
      );
      this.responseInterceptors.set(v.name, { interceptor: v, id });
    });
  }

  private initInterceptors() {
    const allRequestInterceptors = [];
    const allResponseInterceptors = [];
    const { requestInterceptors, responseInterceptors, disablePresetInterceptors } = this.config;
    if (!disablePresetInterceptors) {
      allRequestInterceptors.push(...PRESET_REQUEST_INTERCEPTORS);
      allResponseInterceptors.push(...PRESET_RESPONSE_INTERCEPTORS);
    }
    if (Array.isArray(requestInterceptors)) {
      allRequestInterceptors.push(...requestInterceptors);
    }
    if (Array.isArray(responseInterceptors)) {
      allResponseInterceptors.push(...responseInterceptors);
    }
    this.registerRequestInterceptors(allRequestInterceptors);
    this.registerResponseInterceptors(allResponseInterceptors);
  }

  /**
   * 注册请求拦截器
   * @param requestInterceptor
   */
  useRequestInterceptor(requestInterceptor: RequestInterceptor) {
    const requestInterceptors = Array.from(this.requestInterceptors.values()).map(
      (v) => v.interceptor,
    );
    requestInterceptors.push(requestInterceptor);
    this.registerRequestInterceptors(requestInterceptors);
  }
  /**
   * 注册响应拦截器
   * @param responseInterceptor
   */
  useResponseInterceptor(responseInterceptor: ResponseInterceptor) {
    const responseInterceptors = Array.from(this.responseInterceptors.values()).map(
      (v) => v.interceptor,
    );
    responseInterceptors.push(responseInterceptor);
    this.registerResponseInterceptors(responseInterceptors);
  }
  /**
   * 根据名称移除请求拦截器
   */

  ejectRequestInterceptorByName(name: string) {
    const interceptor = this.requestInterceptors.get(name);
    if (!interceptor || typeof interceptor.id !== 'number') {
      return false;
    }
    this.instance.interceptors.request.eject(interceptor.id);
    this.requestInterceptors.delete(name);
    return true;
  }

  /**
   * 根据名称移除响应拦截器
   */
  ejectResponseInterceptorByName(name: string) {
    const interceptor = this.responseInterceptors.get(name);
    if (!interceptor || typeof interceptor.id !== 'number') {
      return false;
    }
    this.instance.interceptors.response.eject(interceptor.id);
    this.responseInterceptors.delete(name);
    return true;
  }

  getAllInterceptors() {
    return {
      request: [...this.requestInterceptors.values()].map((v) => ({
        name: v.interceptor.name,
        priority: v.interceptor.priority,
      })),
      response: [...this.responseInterceptors.values()].map((v) => ({
        name: v.interceptor.name,
        priority: v.interceptor.priority,
        description: v.interceptor.description,
      })),
    };
  }

  /**
   * 刷新csrfToken
   * @param token
   */
  refreshCsrfToken(token: string) {
    this.config.csrfToken = token;
  }

  private async withRetry<T extends AxiosResponse>(
    request: () => Promise<T>,
    retryTimes = 0,
    current = 0,
  ): ReturnType<typeof request> {
    try {
      const response = await request();
      // @ts-ignore __retry__属性为拦截器内部添加，如解密失败， app 401刷新等重新请求的场景
      if (!response.config.__retry__) {
        return response;
      }
      // @ts-ignore
      delete response.config.__retry__;
      return this.withRetry(request, retryTimes, current + 1);
    } catch (e) {
      const config: RequestConfig | undefined = (e as AxiosError).config;
      if (config) {
        if (config.__retry__ || retryTimes > 0) {
          const retrySource = retryTimes > 0 ? '请求失败重试' : '拦截器内部重试';
          this.reportInfo('请求重试', 'info', {
            url: config.url,
            method: config.method,
            retrySource,
            totalRetryTimes: retryTimes,
            currentRetryTimes: current,
          });
        }
        if (config.__retry__) {
          delete config.__retry__;
          return this.withRetry(request, retryTimes, current + 1);
        }
      }

      if (typeof retryTimes !== 'number') {
        throw e;
      }
      if (current >= retryTimes) {
        throw e;
      }
      return this.withRetry(request, retryTimes, current + 1);
    }
  }

  private handleCancelConfig(config?: RequestConfig) {
    if (config?.cancelable && !config.signal && AbortController) {
      delete config.cancelable;
      const controller = new AbortController();
      config.signal = controller.signal;
      return {
        config,
        controller,
      };
    }
    return { config };
  }
  private handleCancelResponse<T extends object>(
    response: T,
    controller?: AbortController,
  ): T & { cancel?: (reason: any) => void } {
    if (!controller) {
      return response;
    }
    Object.defineProperty(response, 'cancel', {
      value: (reason?: any) => {
        controller.abort(reason);
      },
    });
    return response;
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns 响应数据(不包含 header，状态码等)
   */
  get<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.get<Response<R>>(path, { params, ...requestConfig }),
      config?.retry,
    ).then((v) => v.data);
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns 返回完整响应(包含 header，状态码等)
   */
  getRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () =>
        this.instance.get<Response<R>>(path, {
          params,
          ...requestConfig,
        }),
      config?.retry,
    );
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns
   */
  pull<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.get<Response<R>>(path, { params, ...requestConfig }),
      config?.retry,
    ).then((v) => v.data);
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns
   */
  pullRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () =>
        this.instance.get<Response<R>>(path, {
          params,
          ...requestConfig,
        }),
      config?.retry,
    );
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起POST请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  post<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.post<Response<R>>(path, data, requestConfig),
      config?.retry,
    ).then((v) => v.data);
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起POST请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  postRaw<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.post<Response<R>>(path, data, requestConfig),
      config?.retry,
    );
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起PUT请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  put<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.put<Response<R>>(path, data, requestConfig),
      config?.retry,
    ).then((v) => v.data);

    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起PUT请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  putRaw<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.put<Response<R>>(path, data, requestConfig),
      config?.retry,
    );
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起DELETE请求
   * @param path 请求路径
   * @param config 请求其他配置
   * @returns
   */

  delete<R = any>(path: string, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.delete<Response<R>>(path, requestConfig),
      config?.retry,
    ).then((v) => v.data);

    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起DELETE请求
   * @param path 请求路径
   * @param config 请求其他配置
   * @returns
   */

  deleteRaw<R = any>(path: string, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.delete<Response<R>>(path, requestConfig),
      config?.retry,
    );
    return this.handleCancelResponse(response, controller);
  }
}

export default HttpClient;
