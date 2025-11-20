import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { IS_SERVER_ENV } from 'kc-next/env';
import { buildUrl } from './swagger';
import requestInterceptorInfos from './interceptors/request';
import responseInterceptorsInfos from './interceptors/response';
import {
  RequestInterceptorObject,
  RequestInterceptor,
  ResponseInterceptorObject,
  ResponseInterceptor,
  Response,
  CreateHttpClientConfig,
  RequestConfig,
  RequestConfigWithExtra,
  RuntimeEnvironment,
} from './types';

class HttpClient {
  private instance!: AxiosInstance;
  private requestInterceptors = new Map<string, { interceptor: RequestInterceptorObject; id: number }>();
  private responseInterceptors = new Map<string, { interceptor: ResponseInterceptorObject; id: number }>();
  private config: CreateHttpClientConfig;
  private sentry: any;
  private autoRetry: boolean;

  static create(config: CreateHttpClientConfig) {
    return new HttpClient(config);
  }

  constructor(config: CreateHttpClientConfig) {
    this.config = config;
    const { environment, autoRetry = true } = this.config;
    this.autoRetry = environment === RuntimeEnvironment.SSR && autoRetry;
    this.sentry = config.sentry;
    this.initInstance(config);
    this.initInterceptors();
  }

  private initInstance(config: CreateHttpClientConfig) {
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
      .filter(v => axiosConfigKeys.includes(v))
      .reduce((acc, key) => {
        acc[key as keyof CreateAxiosDefaults] = config[key as keyof typeof config];
        return acc;
      }, {} as CreateAxiosDefaults);
    // 创建axios实例，并设置默认配置
    this.instance = axios.create(createHttpClientConfig);
  }

  private reportInfo(message: string, level: 'info' | 'warn' | 'error' = 'error', tags?: any, extra?: any) {
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

  private applyRetryInterceptor() {
    axiosRetry(this.instance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: error => {
        // 处理socket 被挂起,请求未到达服务端或连接未建立
        const isNetworkError =
          !error.response &&
          error.code &&
          [
            'ECONNRESET',
            'ENOTFOUND',
            'ESOCKETTIMEDOUT',
            'ETIMEDOUT',
            'ECONNREFUSED',
            'EHOSTUNREACH',
            'EPIPE',
            'EAI_AGAIN',
          ].includes(error.code);
        return isNetworkError || error.message.includes('socket hang up');
      },
    });
  }

  /**
   * 请求拦截器排序、注册
   * @param interceptors
   */
  private registerRequestInterceptors(interceptors: RequestInterceptor[]) {
    if (this.autoRetry) {
      this.requestInterceptors.forEach(v => this.instance.interceptors.request.eject(v.id));
    } else {
      this.instance.interceptors.request.clear();
    }
    this.requestInterceptors.clear();
    const { disableRequestPresetInterceptors } = this.config;
    // 请求拦截器先注册的后执行
    const sortedInterceptorList = interceptors
      .map(v => (typeof v === 'function' ? v(this.config) : v))
      .filter(v => !v.supportEnvironment || v.supportEnvironment.includes(this.config.environment))
      .sort((v1, v2) => (v1.priority ?? 1) - (v2.priority ?? 1));
    sortedInterceptorList.forEach(v => {
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
   * 请求拦截器排序、注册
   * @param interceptors
   */
  private registerResponseInterceptors(interceptors: ResponseInterceptor[]) {
    if (this.autoRetry) {
      this.responseInterceptors.forEach(v => this.instance.interceptors.response.eject(v.id));
    } else {
      this.instance.interceptors.response.clear();
    }
    this.responseInterceptors.clear();
    const sortedInterceptorList = interceptors
      .map(v => (typeof v === 'function' ? v(this.config) : v))
      .filter(v => !v.supportEnvironment || v.supportEnvironment.includes(this.config.environment))
      .sort((v1, v2) => (v2.priority ?? 1) - (v1.priority ?? 1));
    // 响应拦截器先注册的先执行
    sortedInterceptorList.forEach(v => {
      if (this.responseInterceptors.has(v.name)) {
        return;
      }
      const id = this.instance.interceptors.response.use(
        response => {
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
        e => {
          // 内部拦截器重试不走后面拦截器的reject逻辑
          if (e.config?.__retry__ || typeof v.onRejected !== 'function') {
            return Promise.reject(e);
          }
          return v.onRejected(e);
        }
      );
      this.responseInterceptors.set(v.name, { interceptor: v, id });
    });
  }

  private initInterceptors() {
    const allRequestInterceptors: RequestInterceptor[] = [];
    const allResponseInterceptors: ResponseInterceptor[] = [];
    const {
      environment,
      requestInterceptors,
      responseInterceptors,
      disablePresetInterceptors,
      disableRequestPresetInterceptors,
      disableResponsePresetInterceptors,
    } = this.config;
    /**
     * 预置请求拦截器
     * 请求加密可能会对 body整体加密，放在最后执行，优先级为 0，其他的顺序随意
     */
    const presetRequestInterceptors = requestInterceptorInfos
      .map(v => (typeof v === 'function' ? v(this.config) : v))
      .filter(v => {
        if (v.presetEnvironment && !v.presetEnvironment.includes(environment)) {
          return false;
        }
        return !disableRequestPresetInterceptors || !disableRequestPresetInterceptors.includes(v.name);
      });
    /**
     * 预置响应拦截器
     * 响应拦截器执行顺序：
     * 灰度检查(优先级 1000) -> 响应解密(优先级999) -> app session自动刷新(优先级100) -> 业务状态码检查(优先级1)
     */
    const presetResponseInterceptors = responseInterceptorsInfos
      .map(v => (typeof v === 'function' ? v(this.config) : v))
      .filter(v => {
        if (v.presetEnvironment && !v.presetEnvironment.includes(environment)) {
          return false;
        }
        return !disableResponsePresetInterceptors || !disableResponsePresetInterceptors.includes(v.name);
      });
    if (!disablePresetInterceptors) {
      allRequestInterceptors.push(...presetRequestInterceptors);
      allResponseInterceptors.push(...presetResponseInterceptors);
    }
    if (Array.isArray(requestInterceptors)) {
      allRequestInterceptors.push(...requestInterceptors);
    }
    if (Array.isArray(responseInterceptors)) {
      allResponseInterceptors.push(...responseInterceptors);
    }
    if (this.autoRetry) {
      this.applyRetryInterceptor();
    }

    this.registerRequestInterceptors(allRequestInterceptors);
    this.registerResponseInterceptors(allResponseInterceptors);
  }

  /**
   * 注册请求拦截器
   * @param requestInterceptor
   */
  useRequestInterceptor(requestInterceptor: RequestInterceptor) {
    const requestInterceptors = Array.from(this.requestInterceptors.values()).map(v => v.interceptor);
    requestInterceptors.push(requestInterceptor);
    this.registerRequestInterceptors(requestInterceptors);
  }
  /**
   * 注册响应拦截器
   * @param responseInterceptor
   */
  useResponseInterceptor(responseInterceptor: ResponseInterceptor) {
    const responseInterceptors = Array.from(this.responseInterceptors.values()).map(v => v.interceptor);
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
      request: Array.from(this.requestInterceptors.values()).map(v => ({
        name: v.interceptor.name,
        priority: v.interceptor.priority,
        description: v.interceptor.description,
      })),
      response: Array.from(this.responseInterceptors.values()).map(v => ({
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
    current = 0
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
      // 请求未完成，页面跳转，Client closed the connection before a request was made. Possibly the SSL certificate was rejected”，这种客户端请求没有响应(目前在ios出现)
      // 这种情况e可能为空，当e为空时，无需toast提示
      if (!e) {
        throw e;
      }
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

      if (this.autoRetry || typeof retryTimes !== 'number' || current >= retryTimes) {
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

  private handleSwaggerConfig(config: RequestConfig = {}) {
    // swagger 会有querySerializer，需要处理
    if (config.querySerializer) {
      config.url = buildUrl({
        path: config.path,
        params: config.params,
        url: config.url,
        querySerializer: config.querySerializer,
      });
      config.params = undefined;
    }
  }

  private handleCancelResponse<T extends object>(
    response: T,
    controller?: AbortController
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

  private async getCacheData(path: string, config?: RequestConfig, params?: any) {
    const enableCache =
      IS_SERVER_ENV && config?.cache && process.env.NEXT_PUBLIC_API_CACHE && process.env.KC_CDN_SITE_TYPE;
    if (!enableCache) {
      return {
        enableCache,
      };
    }
    const { cache, generateCacheKey } = await import('./cache');
    let queryKey = path;
    if (params) {
      queryKey += `?${new URLSearchParams(params).toString()}`;
    }
    const cacheKey = generateCacheKey(queryKey, process.env.KC_CDN_SITE_TYPE || '');
    const cached = cache.get(cacheKey);
    return {
      enableCache,
      cached,
      setCache: (data: any) => cache.set(cacheKey, data),
    };
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns 响应数据(不包含 header，状态码等)
   */
  async get<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { enableCache, cached, setCache } = await this.getCacheData(path, config, params);
    if (cached) {
      return cached as Response<R>;
    }
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    this.handleSwaggerConfig(requestConfig);
    const response = this.withRetry(
      () => this.instance.get<Response<R>>(path, { params, ...requestConfig }),
      config?.retry
    ).then(v => {
      if (enableCache) {
        setCache?.(v.data);
      }
      return v.data;
    });
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns 返回完整响应(包含 header，状态码等)
   */
  async getRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () =>
        this.instance.get<Response<R>>(path, {
          params,
          ...requestConfig,
        }),
      config?.retry
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
  async pull<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { enableCache, cached, setCache } = await this.getCacheData(path, config, params);
    if (cached) {
      return cached as Response<R>;
    }
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    this.handleSwaggerConfig(requestConfig);
    const response = this.withRetry(
      () => this.instance.get<Response<R>>(path, { params, ...requestConfig }),
      config?.retry
    ).then(v => {
      if (enableCache) {
        setCache?.(v.data);
      }
      return v.data;
    });
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起GET请求
   * @param path 请求路径
   * @param params 请求query参数
   * @param config 请求其他配置
   * @returns
   */
  async pullRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    this.handleSwaggerConfig(requestConfig);
    const response = this.withRetry(
      () =>
        this.instance.get<Response<R>>(path, {
          params,
          ...requestConfig,
        }),
      config?.retry
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
  async post<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () => this.instance.post<Response<R>>(path, data, requestConfig),
      config?.retry
    ).then(v => v.data);
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起POST请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  async postRaw<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(() => this.instance.post<Response<R>>(path, data, requestConfig), config?.retry);
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起PUT请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  async put<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    this.handleSwaggerConfig(requestConfig);
    const response = this.withRetry(
      () => this.instance.put<Response<R>>(path, data, requestConfig),
      config?.retry
    ).then(v => v.data);

    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起PUT请求
   * @param path 请求路径
   * @param data 请求数据
   * @param config 请求其他配置
   * @returns
   */
  async putRaw<R = any, T = any>(path: string, data?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    this.handleSwaggerConfig(requestConfig);
    const response = this.withRetry(() => this.instance.put<Response<R>>(path, data, requestConfig), config?.retry);
    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起DELETE请求
   * @param path 请求路径
   * @param config 请求其他配置
   * @returns
   */

  async delete<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () =>
        this.instance.delete<Response<R>>(path, {
          params,
          ...requestConfig,
        }),
      config?.retry
    ).then(v => v.data);

    return this.handleCancelResponse(response, controller);
  }

  /**
   * 发起DELETE请求
   * @param path 请求路径
   * @param config 请求其他配置
   * @returns
   */

  async deleteRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig) {
    const { config: requestConfig, controller } = this.handleCancelConfig(config);
    const response = this.withRetry(
      () =>
        this.instance.delete<Response<R>>(path, {
          params,
          ...requestConfig,
        }),
      config?.retry
    );
    return this.handleCancelResponse(response, controller);
  }
}

export default HttpClient;
