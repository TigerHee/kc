/**
 * hybrid 相关的工具方法
 */
import { noop, compareVersion } from './utils';
import { config, BUILTIN_EVENT_NAMES } from './config';
import { isInApp } from './env';
import { eventBus } from './event';
import { is } from './is';

type IOptions = Record<string|number, any>;
type ICallback = (res: any) => void;

/**
 * 调用hybrid方法, 内部调用 type 为 func
 * @param funcName 方法名称
 * @param params 参数
 * @param callback 结果回调, 不传则返回 Promise
 */
function callHybrid(funcName: string, params?: IOptions | ICallback): Promise<any>
function callHybrid(funcName: string, params: IOptions, callback?: ICallback): void
function callHybrid(funcName: string, params?: IOptions | ICallback, callback?: ICallback) {
  if (!isInApp) return
  const JsBridge = config('jsBridge');

  if (is(params, 'function')) {
    callback = params as ICallback;
    params = {};
  } else {
    params = params || {};
  }

  const callNative = (cb: (res: any) => void) => {
    JsBridge!.open({
      type: 'func',
      params: { name: funcName, ...params }
    }, cb);
  }
  if (!callback) {
    return new Promise((resolve) => callNative(resolve))
  }
  callNative(callback);
}

/**
 * hybrid sdk 简化封装
 */
export const hybrid = {
  /**
   * 监听hybrid事件
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns
   */
  on(eventName: string, callback: ICallback) {
    if (!isInApp) return
    const JsBridge = config('jsBridge');
    JsBridge!.listenNativeEvent.on(eventName, callback);
  },
  /**
   * 取消监听hybrid事件
   * @param eventName 事件名称
   * @param callback 回调函数, 不传则清除所有监听
   * @returns
   */
  off(eventName: string, callback?: ICallback) {
    if (!isInApp) return
    const JsBridge = config('jsBridge');
    if (!callback) {
      JsBridge!.listenNativeEvent.clear(eventName);
      return;
    }
    JsBridge!.listenNativeEvent.off(eventName, callback);
  },
  /**
   * 调用hybrid方法, 内部调用 type 为 func
   * @param funcName 方法名称
   * @param params 参数
   * @param callback 结果回调, 不传则返回 Promise
   */
  call: callHybrid,
  /**
   * 配置hybrid特性, 内部调用 type 为 event
   * @param featureName 特性名称
   * @param options 配置参数
   * @param callback 结果回调, 默认为 noop, 兼容旧版App 可能报错的问题
   */
  config(featureName: string, options: IOptions = {}, callback: ICallback = noop) {
    if (!isInApp) return
    const JsBridge = config('jsBridge');
    JsBridge!.open({
      type: 'event',
      params: { name: featureName, ...options }
    }, callback);
  }
}

const FEATURE_VERSION_MAP = {
  // 支持H5注入登录的版本
  supportCookieLogin: '3.15.0',
  // 支持多海报分享的版本
  supportGallery: '3.45.0',
  // 支持使用系统浏览器打开链接的版本
  supportOpenInExternal: '3.50.0',
  // 支持app的设备指纹token
  supportAppToken: '3.66.0',
  /**
   * 新版分享
   */
  supportNewShare: '3.89.0',
  /** 支持获取用户信息 */
  supportGetUserInfo: '3.101.0'
} as const;

/**
 * app 版本信息 及 特性支持情况
 */
export type IAppMeta = {
  /** 客户端版本号 */
  version: string;
} & Record<keyof typeof FEATURE_VERSION_MAP, boolean>;


let appMeta: Partial<IAppMeta> = {};
let appVersion = ''

eventBus.on(BUILTIN_EVENT_NAMES.JSBRIDGE_READY, () => {
  // 进入页面时获取app版本, 避免在app中获取不到或者需要异步获取
  hybrid.call('getAppVersion', {}, ({ data }) => {
    appVersion = data
  });
});


/**
 * 获取 app 版本
 */
export function getAppMeta() {
  if (!isInApp) return appMeta
  if (appMeta.version !== appVersion) {
    appMeta = { version: appVersion }
    Object.keys(FEATURE_VERSION_MAP).forEach((key) => {
      // @ts-expect-error 更新元信息
      appMeta[key] = compareVersion(appVersion, FEATURE_VERSION_MAP[key]) >= 0
    })
  }
  return { ...appMeta } as IAppMeta;
}
