/*
 * @owner: borden@kupotech.com
 */
import { bootConfig } from 'kc-next/boot';

export const DEFAULT_OPTIONS: any = {
  // 默认的错误重试次数
  retryCount: 3,
  // 默认的错误重试间隔, 大于节流时间，才不会被节流拦截(10s)
  retryInterval: 10 * 1000,
  // 默认的节流时间(8s)
  throttleWait: 8 * 1000,
  // 默认在节流开始前执行调用
  throttleLeading: true,
  // 默认不在节流结束后执行调用
  throttleTrailing: false,
};

// 默认的数据保鲜时间
export const DEFAULT_STALE_TIME: any = 5 * 60 * 1000; // 5mins

// 获取当前站点
export const getBrandSite: any = (): any => bootConfig._BRAND_SITE_ || '';

// 独立站点
export const STAND_SITE: any = ['KC', 'TH', 'TR', 'CL'];
