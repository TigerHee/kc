/**
 * kux-design 组件库预设配置
 */

import  { type IJSBridge } from '@kux/app-sdk';
import { type ReactNode } from 'react';
export interface ILibConfig {
  /**
   * Kc App JsBridge(JsSDK) 对象, 在 App 环境下使用
   * * Kc App 环境下必须设置该值
   */
  jsBridge: IJSBridge;
  /**
   * Kc App TMA(Telegram) SDK 对象, 在 TMA 环境下使用
   * TMA 环境下才需要设置该对象, 否则设置为 falsy 值即可
   */
  tmaSDK?: any;
  /**
   * 获取 lottie 库对象, 注意: 返回的对象需要有 loadAnimation 方法
   * * 组件库中的 LottiePlayer 组件需要使用该方法获取 lottie 库对象
   * 在 3.0 项目中可以赋值为 () => System.import('lottie-web')
   */
  getLottie: () => Promise<any>,
  /**
   * 组件库预设的获取 okText 文案的方法, 此处使用函数形式, 以便于在不同环境下获取不同的文案
   * * 使用场景: tooltip, confirm 等组件的 okText 文案
   */
  getOkText: () => ReactNode;
  /**
   * 组件库预设的cancelText文案, 此处使用函数形式, 以便于在不同环境下获取不同的文案
   * * 使用场景: tooltip, confirm 等组件的 cancelText 文案
   */
  getCancelText: () => ReactNode;

  /**
   * 组件库预设的获取 tooltip 在移动端(对话框展示)的对话框标题文案, 此处使用函数形式, 以便于在不同环境下获取不同的文案
   * * 一般使用 “说明”
   */
  getTooltipTitle?: () => ReactNode;
}

// 预设配置变量
let presetConfig: Partial<ILibConfig> = {
  getOkText: () => 'OK',
  getCancelText: () => 'Cancel',
};

// setup 方法用于设置预设配置
export function setup (config: Partial<ILibConfig>) {
  presetConfig = {
    ...presetConfig,
    ...config,
  };
  const { jsBridge, tmaSDK } = config;
  if (jsBridge || tmaSDK) {
    const appConfig: Record<string, any> = {};
    if (jsBridge) {
      appConfig.jsBridge = jsBridge;
    }
    if (tmaSDK) {
      appConfig.tmaSDK = tmaSDK;
    }
    app.config(appConfig);
  }
};

/**
 * 获取组件库预设配置
 * @param key 组件库配置字段名称
 * @param evaluate 若果为 true, 则会执行 key 对应value 函数并返回函数的返回值
 */
export function getConfig<T extends keyof ILibConfig>(key: T, evaluate?: false): ILibConfig[T]
export function getConfig<T extends keyof ILibConfig>(key: T, evaluate: true): ReturnType<ILibConfig[T]>
  export function getConfig<T extends keyof ILibConfig>(key: T, evaluate?: boolean) {
  const val = presetConfig[key] as ILibConfig[T];
  if (evaluate && app.is(val, 'function')) {
    return val();
  }
  return val;
}