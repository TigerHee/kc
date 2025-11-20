import { InternalAxiosRequestConfig, AxiosResponse, CreateAxiosDefaults, AxiosRequestConfig } from 'axios';
export declare enum RuntimeEnvironment {
    BROWSER = 1,
    SSR = 2,
    APP = 3,
    WEBWORKER = 4,
    RN = 5
}
interface Storage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export interface FingerPrintUrl {
    url: string;
    event?: string;
    method?: string;
}
export interface CreateHttpClientConfig extends CreateAxiosDefaults {
    requestInterceptors?: RequestInterceptor[];
    responseInterceptors?: ResponseInterceptor[];
    disablePresetInterceptors?: boolean;
    environment: RuntimeEnvironment;
    projectName: string;
    xSite: string;
    kcStorage?: Storage;
    kcSessionStorage?: Storage;
    JsBridge?: any;
    sentry?: any;
    fingerPrintUrlList?: FingerPrintUrl[];
    reporter?: any;
    getReporter?: () => Promise<any>;
    csrfToken?: string;
    langByPath?: string;
    xVersion?: string;
}
export type Response<T = any> = {
    success: boolean;
    code: string;
    msg: string;
    retry: boolean;
} & T;
export type AxiosInterceptor<T> = {
    name: string;
    description?: string;
    priority?: number;
    onFulfilled?: (value: T) => T | Promise<T>;
    onRejected?: (error: any) => any;
    runWhen?: (config: T) => boolean;
};
export interface EncryptedConfig {
    enable?: boolean;
    fieldsConfig?: {
        encryptedFields?: string[];
        decryptedFields?: string[];
    };
}
export interface RequestExtraConfig {
    useInterceptors?: {
        request?: string[];
        response?: string[];
    };
    disableInterceptors?: {
        request?: string[];
        response?: string[];
    };
    disableCsrfToken?: boolean;
    disableLang?: boolean;
    retry?: number;
    cancelable?: boolean;
    [key: string]: any;
}
export type RequestConfigWithExtra = InternalAxiosRequestConfig & RequestExtraConfig;
export type RequestInterceptorObject = AxiosInterceptor<RequestConfigWithExtra>;
export type RequestInterceptor = RequestInterceptorObject | ((config: CreateHttpClientConfig) => RequestInterceptorObject);
export type ResponseType = AxiosResponse & {
    config: RequestConfigWithExtra;
};
export type ResponseInterceptorObject = AxiosInterceptor<ResponseType>;
export type ResponseInterceptor = ResponseInterceptorObject | ((config: CreateHttpClientConfig) => ResponseInterceptorObject);
export type RequestConfig = Omit<AxiosRequestConfig, 'params'> & RequestExtraConfig;
export interface EnhancedAxios {
    new (config: CreateHttpClientConfig): EnhancedAxios;
    ejectRequestInterceptorByName(name: string): boolean;
    ejectResponseInterceptorByName(name: string): boolean;
    useRequestInterceptor(requestInterceptor: RequestInterceptor): number;
    useResponseInterceptor(responseInterceptor: ResponseInterceptor): number;
    get<R = any, T = any>(path: string, params?: T, config?: RequestConfig): Promise<R>;
    pull<R = any, T = any>(path: string, params?: T, config?: RequestConfig): Promise<R>;
    post<R = any, T = any>(path: string, data?: T, config?: AxiosRequestConfig): Promise<R>;
    refreshCsrfToken(token: string): void;
}
export {};
