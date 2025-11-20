/**
 * 公共配置
 */
import { is } from './is'
import { globalObject } from './utils'
import { innerEmit } from './event'

export interface IJSBridge {
  open: (params: { type: string, params: any }, callback?: (res: any) => void) => void;
  listenNativeEvent: {
    on: (eventName: string, callback: (data: any) => void) => void;
    off: (eventName: string, callback: (data: any) => void) => void;
    clear: (eventName: string) => void;
  }
}

/**
 * 内置事件名称
 */
export const BUILTIN_EVENT_NAMES = {
  /**
   * 多语言加载事件
   */
  LOCALE_LOADED: 'app:locale-loaded',
  /**
   * 多语言变化事件
   * * 立即触发
   */
  LANG_CHANGED: 'app:lang-changed',
  /**
   * 用户信息变化事件
   */
  USER_CHANGED: 'app:user-changed',
  /**
   * 用户信息加载事件
   * * 立即触发, 用于初始化相关操作
   * * 针对非立即需要的操作, 可监听 USER_CHANGED 事件
   */
  USER_LOADED: 'app:user-loaded',
  /**
   * 语言key缺失事件
   */
  LANG_KEY_MISSING: 'app:lang-key-missing',
  /**
   * 请求事件, 可用于统计
   */
  BEFORE_FETCH: 'app:before-fetch',
  /**
   * 请求失败事件, response.ok 为 false 时触发
   */
  FETCH_FAILED: 'app:fetch-failed',
  /**
   * 请求报错事件, 请求处理函数内部报错(非!response.ok)时触发
   */
  FETCH_ERROR: 'app:fetch-error',
  /**
   * JSBridge 初始化完成事件
   */
  JSBRIDGE_READY: 'app:jsbridge-ready',
} as const

/**
 * 内置事件名称
 */
export type BUILTIN_EVENT_NAMES = typeof BUILTIN_EVENT_NAMES[keyof typeof BUILTIN_EVENT_NAMES]


export const siteCfg = (function() {
  const cfg = globalObject._WEB_RELATION_ || {}
  if (process.env.NODE_ENV === 'development') cfg.KUMEX_GATE_WAY = '/_api_kumex'
  cfg._NEW_KUCOIN_HOST_COM = cfg.MAINSITE_HOST_COM || cfg.MAINSITE_HOST || ''
  return cfg as Record<string, any>
})()

export interface IAppConfig {
  /**
   * 与服务器的时间差, 值为服务器时间减去本地时间
   * * 实际计算需考虑服务器响应时间, 算法: Math.floor(服务器时间 - 本地时间 + (请求开始时间 - 请求响应时间) / 2))
   * * 设置后通过 app.now() 即可获取与服务器时间一致的时间戳
   */
  timeDiff: number
  /**
   * 前端界面展示使用的时区, 默认 UTC(0 时区)
   * * 会影响 app.formatDateTime 使用的时区默认值
   */
  timeZone: string
  /**
   * 备用语言, 当页面内容区不支持用户语言时的备用语言
   * * 部分需要翻译、地区相关接口可能会使用该语言
   */
  fallbackLang?: string
  /**
   * TMA(Telegram) SDK 对象
   * * 仅在 TMA 环境下设置该对象(也用于在应用中判断是否在 TMA 环境中)
   */
  tmaSDK?: any

  /**
   * JsBridge 对象
   * * 仅在 App 环境下设置该对象
   */
  jsBridge?: IJSBridge
}

const appCfg: IAppConfig = {
  // 默认时间差为 0, 即认为本地时间与服务器时间一致
  timeDiff: 0,
  // 默认使用 UTC 时区, 即 0 时区
  timeZone: 'UTC',
}

export function config(): IAppConfig
export function config<T extends keyof IAppConfig>(key: T): IAppConfig[T]
export function config<T extends keyof IAppConfig>(key: T, val: IAppConfig[T]): void
export function config(cfg: Partial<IAppConfig>): void
export function config(key?: any, val?: any) {
  const argLen = arguments.length
  if (argLen === 0) {
    return {...appCfg }
  }
  if (argLen === 1 && is(key, 'string')) {
    // @ts-expect-error key should be a valid key
    return appCfg[key]
  }

  const cfg: Partial<IAppConfig> = is(key, 'object') ? key :  { [key]: val };
  if (cfg.jsBridge) {
    innerEmit(BUILTIN_EVENT_NAMES.JSBRIDGE_READY, cfg.jsBridge)
  }
  Object.assign(appCfg, cfg)
}

/**
 * 获取与服务器一致的时间戳
 * 
 * @returns 当前时间戳
 */
export function now() {
  return Date.now() + appCfg.timeDiff
}