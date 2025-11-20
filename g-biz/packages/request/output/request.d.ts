import { AxiosResponse } from 'axios';
import { RequestInterceptor, ResponseInterceptor, Response, CreateHttpClientConfig, RequestConfig } from './types';
declare class HttpClient {
    private instance;
    private requestInterceptors;
    private responseInterceptors;
    private config;
    private sentry;
    static create(config: CreateHttpClientConfig): HttpClient;
    constructor(config: CreateHttpClientConfig);
    private reportInfo;
    private registerRequestInterceptors;
    private registerResponseInterceptors;
    private initInterceptors;
    useRequestInterceptor(requestInterceptor: RequestInterceptor): void;
    useResponseInterceptor(responseInterceptor: ResponseInterceptor): void;
    ejectRequestInterceptorByName(name: string): boolean;
    ejectResponseInterceptorByName(name: string): boolean;
    getAllInterceptors(): {
        request: {
            name: string;
            priority: number | undefined;
        }[];
        response: {
            name: string;
            priority: number | undefined;
            description: string | undefined;
        }[];
    };
    refreshCsrfToken(token: string): void;
    private withRetry;
    private handleCancelConfig;
    private handleCancelResponse;
    get<R = any, T = any>(path: string, params?: T, config?: RequestConfig): Promise<Response<R>> & {
        cancel?: (reason: any) => void;
    };
    getRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig): Promise<AxiosResponse<Response<R>, any>> & {
        cancel?: (reason: any) => void;
    };
    pull<R = any, T = any>(path: string, params?: T, config?: RequestConfig): Promise<Response<R>> & {
        cancel?: (reason: any) => void;
    };
    pullRaw<R = any, T = any>(path: string, params?: T, config?: RequestConfig): Promise<AxiosResponse<Response<R>, any>> & {
        cancel?: (reason: any) => void;
    };
    post<R = any, T = any>(path: string, data?: T, config?: RequestConfig): Promise<Response<R>> & {
        cancel?: (reason: any) => void;
    };
    postRaw<R = any, T = any>(path: string, data?: T, config?: RequestConfig): Promise<AxiosResponse<Response<R>, any>> & {
        cancel?: (reason: any) => void;
    };
    put<R = any, T = any>(path: string, data?: T, config?: RequestConfig): Promise<Response<R>> & {
        cancel?: (reason: any) => void;
    };
    putRaw<R = any, T = any>(path: string, data?: T, config?: RequestConfig): Promise<AxiosResponse<Response<R>, any>> & {
        cancel?: (reason: any) => void;
    };
    delete<R = any>(path: string, config?: RequestConfig): Promise<Response<R>> & {
        cancel?: (reason: any) => void;
    };
    deleteRaw<R = any>(path: string, config?: RequestConfig): Promise<AxiosResponse<Response<R>, any>> & {
        cancel?: (reason: any) => void;
    };
}
export default HttpClient;
