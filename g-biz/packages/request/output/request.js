import axios from 'axios';
import { encryptRequest, addCsrfToken, addLang, addXVersion, deviceFinger, } from './interceptors/request';
import { checkXGray, checkBizCode, decryptResponse } from './interceptors/response';
const PRESET_REQUEST_INTERCEPTORS = [
    addCsrfToken,
    addLang,
    addXVersion,
    encryptRequest,
    deviceFinger,
];
const PRESET_RESPONSE_INTERCEPTORS = [
    checkXGray,
    decryptResponse,
    checkBizCode,
];
class HttpClient {
    instance;
    requestInterceptors = new Map();
    responseInterceptors = new Map();
    config;
    sentry;
    static create(config) {
        return new HttpClient(config);
    }
    constructor(config) {
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
        const createHttpClientConfig = Object.keys(config)
            .filter((v) => axiosConfigKeys.includes(v))
            .reduce((acc, key) => {
            acc[key] = config[key];
            return acc;
        }, {});
        this.instance = axios.create(createHttpClientConfig);
        this.initInterceptors();
    }
    reportInfo(message, level = 'error', tags, extra) {
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
        }
        catch (e) {
            console.error(`[http-client] sentry report error,  ${e}`);
        }
    }
    registerRequestInterceptors(interceptors) {
        this.requestInterceptors.clear();
        this.instance.interceptors.request.clear();
        const sortedInterceptorList = interceptors
            .map((v) => (typeof v === 'function' ? v(this.config) : v))
            .sort((v1, v2) => (v1.priority ?? 1) - (v2.priority ?? 1));
        sortedInterceptorList.forEach((v) => {
            if (this.requestInterceptors.has(v.name)) {
                return;
            }
            const id = this.instance.interceptors.request.use(v.onFulfilled, v.onRejected, {
                runWhen: (config) => {
                    const useInterceptors = config.useInterceptors?.request;
                    const disableCurrentInterceptor = config.disableInterceptors?.request?.includes(v.name);
                    if (disableCurrentInterceptor) {
                        return false;
                    }
                    if (!useInterceptors) {
                        return typeof v.runWhen === 'function' ? v.runWhen(config) : true;
                    }
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
    registerResponseInterceptors(interceptors) {
        this.responseInterceptors.clear();
        this.instance.interceptors.response.clear();
        const sortedInterceptorList = interceptors
            .map((v) => (typeof v === 'function' ? v(this.config) : v))
            .sort((v1, v2) => (v2.priority ?? 1) - (v1.priority ?? 1));
        sortedInterceptorList.forEach((v) => {
            if (this.responseInterceptors.has(v.name)) {
                return;
            }
            const id = this.instance.interceptors.response.use((response) => {
                if (typeof v.onFulfilled !== 'function') {
                    return response;
                }
                const config = response.config;
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
            }, (e) => {
                if (e.config?.__retry__ || typeof v.onRejected !== 'function') {
                    return Promise.reject(e);
                }
                return v.onRejected(e);
            });
            this.responseInterceptors.set(v.name, { interceptor: v, id });
        });
    }
    initInterceptors() {
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
    useRequestInterceptor(requestInterceptor) {
        const requestInterceptors = Array.from(this.requestInterceptors.values()).map((v) => v.interceptor);
        requestInterceptors.push(requestInterceptor);
        this.registerRequestInterceptors(requestInterceptors);
    }
    useResponseInterceptor(responseInterceptor) {
        const responseInterceptors = Array.from(this.responseInterceptors.values()).map((v) => v.interceptor);
        responseInterceptors.push(responseInterceptor);
        this.registerResponseInterceptors(responseInterceptors);
    }
    ejectRequestInterceptorByName(name) {
        const interceptor = this.requestInterceptors.get(name);
        if (!interceptor || typeof interceptor.id !== 'number') {
            return false;
        }
        this.instance.interceptors.request.eject(interceptor.id);
        this.requestInterceptors.delete(name);
        return true;
    }
    ejectResponseInterceptorByName(name) {
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
    refreshCsrfToken(token) {
        this.config.csrfToken = token;
    }
    async withRetry(request, retryTimes = 0, current = 0) {
        try {
            const response = await request();
            if (!response.config.__retry__) {
                return response;
            }
            delete response.config.__retry__;
            return this.withRetry(request, retryTimes, current + 1);
        }
        catch (e) {
            const config = e.config;
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
    handleCancelConfig(config) {
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
    handleCancelResponse(response, controller) {
        if (!controller) {
            return response;
        }
        Object.defineProperty(response, 'cancel', {
            value: (reason) => {
                controller.abort(reason);
            },
        });
        return response;
    }
    get(path, params, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.get(path, { params, ...requestConfig }), config?.retry).then((v) => v.data);
        return this.handleCancelResponse(response, controller);
    }
    getRaw(path, params, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.get(path, {
            params,
            ...requestConfig,
        }), config?.retry);
        return this.handleCancelResponse(response, controller);
    }
    pull(path, params, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.get(path, { params, ...requestConfig }), config?.retry).then((v) => v.data);
        return this.handleCancelResponse(response, controller);
    }
    pullRaw(path, params, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.get(path, {
            params,
            ...requestConfig,
        }), config?.retry);
        return this.handleCancelResponse(response, controller);
    }
    post(path, data, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.post(path, data, requestConfig), config?.retry).then((v) => v.data);
        return this.handleCancelResponse(response, controller);
    }
    postRaw(path, data, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.post(path, data, requestConfig), config?.retry);
        return this.handleCancelResponse(response, controller);
    }
    put(path, data, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.put(path, data, requestConfig), config?.retry).then((v) => v.data);
        return this.handleCancelResponse(response, controller);
    }
    putRaw(path, data, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.put(path, data, requestConfig), config?.retry);
        return this.handleCancelResponse(response, controller);
    }
    delete(path, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.delete(path, requestConfig), config?.retry).then((v) => v.data);
        return this.handleCancelResponse(response, controller);
    }
    deleteRaw(path, config) {
        const { config: requestConfig, controller } = this.handleCancelConfig(config);
        const response = this.withRetry(() => this.instance.delete(path, requestConfig), config?.retry);
        return this.handleCancelResponse(response, controller);
    }
}
export default HttpClient;
