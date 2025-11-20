/**
 * 客户端环境判断
 * 使用 globalObject._useSSG;
 */
import { config } from './config';
import { globalObject } from './utils';

/**
 * 是否有使用 SSG
 */
export const isUseSSG = !!globalObject._useSSG;

/**
 * 是否为运行在 SSR 环境中
 */
export const isSSR = typeof window === 'undefined';

/**
 * 判断是否在 app 中
 */
export const isInApp: boolean = globalObject.navigator?.userAgent?.indexOf?.('KuCoin') > -1;

export const isTMA = () => {
  return !!config('tmaSDK');
}