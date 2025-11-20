import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import axiosRetry from 'axios-retry';
import { getNextSSRStore } from 'tools/asyncLocalStorage';

// 网络错误代码常量
const NETWORK_ERROR_CODES = [
  'ECONNRESET',
  'ENOTFOUND',
  'ESOCKETTIMEDOUT',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'EPIPE',
  'EAI_AGAIN',
] as const;

// 创建 axios 实例
const axiosInstance = axios.create();

// 配置重试机制
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    // 处理网络错误：socket 被挂起、请求未到达服务端或连接未建立
    const isNetworkError =
      !error.response &&
      error.code &&
      NETWORK_ERROR_CODES.includes(error.code as any);
    
    const isSocketHangUp = error.message?.includes('socket hang up');
    
    return isNetworkError || isSocketHangUp;
  },
});

// 请求拦截器：SSR 时注入 Cookie
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 仅在服务端环境下处理 Cookie 注入
    if (typeof window === 'undefined') {
      const store = getNextSSRStore();
      if (store?.cookies && Object.keys(store.cookies).length > 0) {
        const cookieHeader = Object.entries(store.cookies)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('; ');
        config.headers.set('Cookie', cookieHeader);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 定义自定义 fetch 接口类型
interface CustomFetch {
  (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  interceptors: typeof axiosInstance.interceptors;
}

// 封装请求函数
const request = async (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.request({ url, ...config });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`请求失败: ${errorMessage}`);
    }
    throw error;
  }
};

// 创建自定义 fetch 实例
const customFetch = request as CustomFetch;
customFetch.interceptors = axiosInstance.interceptors;

export default customFetch;
