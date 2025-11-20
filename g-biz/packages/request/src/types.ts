import {
  InternalAxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  AxiosRequestConfig,
} from 'axios';

export enum RuntimeEnvironment {
  /** 浏览器环境 */
  BROWSER = 1,
  SSR = 2,
  APP = 3,
  WEBWORKER = 4,
  RN = 5,
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
  /** 额外的请求拦截器 */
  requestInterceptors?: RequestInterceptor[];
  /** 额外的响应拦截器 */
  responseInterceptors?: ResponseInterceptor[];
  /** 禁用内置的拦截器，默认false */
  disablePresetInterceptors?: boolean;
  /** 运行环境 */
  environment: RuntimeEnvironment;
  projectName: string;
  xSite: string;
  /** @kucoin-base/storage */
  kcStorage?: Storage;
  kcSessionStorage?: Storage;
  JsBridge?: any;
  sentry?: any;
  /** 指定哪些url需要采集设备指纹 */
  fingerPrintUrlList?: FingerPrintUrl[];
  /** 上报库 */
  reporter?: any;
  /** 动态加载kc-report */
  getReporter?: () => Promise<any>;
  csrfToken?: string;
  /** 当前页面的语言 */
  langByPath?: string;
  /** 直接指定x-version，不指定则从 storage 获取 */
  xVersion?: string;
  // 其他配置
  // [key: string]: any;
}

export type Response<T = any> = {
  success: boolean;
  code: string;
  msg: string;
  retry: boolean;
} & T;

export type AxiosInterceptor<T> = {
  /** 拦截器名称，可以按照name移除 */
  name: string;
  description?: string;
  /**
   * 拦截器优先级，数字越大越先执行，默认：1
   * 默认情况下，axios请求拦截器先注册的后执行，响应拦截器先注册的先执行
   * 这里提供统一的逻辑：优先级大的先执行，优先级相同的先注册的先执行
   * */
  priority?: number;
  onFulfilled?: (value: T) => T | Promise<T>;
  onRejected?: (error: any) => any;
  /** 执行条件 */
  runWhen?: (config: T) => boolean;
};

export interface EncryptedConfig {
  /** 是否开启，缺省情况根据配置决定 */
  enable?: boolean;
  /**
     * 如果手动处理字段加解密，不自动添加加密头(避免接口同时在加密列表自动添加Content-Encrypted: 0冲突的情况)
     * 也可以不要该配置，请求库在识别到手动添加加密头(Content-Encrypted: 1)则不再自动添加Content-Encrypted头
     ** /
    noAddEncryptedHeader?: boolean;
    /** 如果配置了该字段，按照配置自动加解密，忽略加密接口列表 */
  fieldsConfig?: {
    /** 加密字段, a.b.c */
    encryptedFields?: string[];
    /** 解密字段 */
    decryptedFields?: string[];
  };
}

/**
 * 请求维度的其他配置
 */
export interface RequestExtraConfig {
  // encryptedConfig?: EncryptedConfig;
  /** 使用指定的拦截器名称，如果不传表示默认，传空数组表示禁用拦截器 */
  useInterceptors?: {
    request?: string[];
    response?: string[];
  };
  /** 禁用的拦截器名称，如果同时同时存在 useInterceptors 和 disableInterceptors，则 disableInterceptors 优先 */
  disableInterceptors?: {
    request?: string[];
    response?: string[];
  };
  /** 是否禁用csrfToken, 默认false */
  disableCsrfToken?: boolean;
  /** 是否禁用自动添加语言参数, 默认false */
  disableLang?: boolean;
  /** 需要重试的次数，默认不重试 */
  retry?: number;
  /** 请求是否可以取消，设置true会在返回的Promise中增加cancel方法(如果请求已经发出，不一定能取消成功) */
  cancelable?: boolean;
  [key: string]: any;
}

export type RequestConfigWithExtra = InternalAxiosRequestConfig & RequestExtraConfig;

export type RequestInterceptorObject = AxiosInterceptor<RequestConfigWithExtra>;

export type RequestInterceptor =
  | RequestInterceptorObject
  | ((config: CreateHttpClientConfig) => RequestInterceptorObject);

export type ResponseType = AxiosResponse & { config: RequestConfigWithExtra };

export type ResponseInterceptorObject = AxiosInterceptor<ResponseType>;

export type ResponseInterceptor =
  | ResponseInterceptorObject
  | ((config: CreateHttpClientConfig) => ResponseInterceptorObject);

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
