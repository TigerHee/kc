import { getAppMeta, hybrid } from './hybrid';
import { BUILTIN_EVENT_NAMES, siteCfg, now, config } from './config';
import { eventBus, EventHub, innerEmit } from './event';
import { formatNumber, formatDateTime } from './format';
import { getCurrentLang, convertLangStyle, isRTL, setLang, isLangSupported } from './lang';
import {
  openLink,
  addLang2Path,
  buildURL,
  getBaseName,
  getPathnameWithoutLang,
} from './route';
import { globalObject, searchToJson, compareVersion, waitForINP, isDeepEqual, param, } from './utils';
import { escapeHtml, filterXssHTML } from './safe-html';
import { storage } from './storage';
import { isUseSSG, isInApp, isTMA, isSSR } from './env';
import { is } from './is';
import './types';

/**
 * export all types for external use
 */
export type * from './config';
export type * from './event';
export type * from './format';
export type * from './lang';
export type * from './route';
export type * from './safe-html';
export type * from './storage';
export type * from './utils';
export type * from './is';


/**
 * 暴露到 app 的工具方法
 */
const utils = {
  /**
   * 将查询查询字符串转换为json对象, **仅支持简单结构**
   */
  searchToJson,
  /**
   * 添加语言到路径
   */
  addLang2Path,
  /**
   * 构建 url, 包含了语言处理
   */
  buildURL,
  /**
   * 转换语言风格
   */
  convertLangStyle,
  /**
   * 判断语言是否支持
   */
  isLangSupported,
  /**
   * 比较版本号, 仅支持简单的三段版本号
   */
  compareVersion,
  /**
   * 等待 INP, 避免阻塞UI
   */
  waitForINP,
  /**
   * 深度比较对象
   */
  isDeepEqual,
  /**
   * 转义 html 字符串
   */
  escapeHtml,
  /**
   * 使用 html template tag 对 html 进行 xss 过滤
   */
  filterXssHTML,
  /**
   * 是否为 RTL 语言
   * @param lang 语言, 默认为当前语言, 若判断当前语言是否为 RTL 语言, 可直接使用 app.isRTL 属性
   */
  isRTL,
};

export const app = {
  ...eventBus,
  /**
   * 事件总线类
   */
  EventHub,
  /**
   * 金融数字格式化
   * 用法同 kux/mui
   * @see https://kux.sit.kucoin.net/#/kux5.0/intl
   */
  formatNumber,
  /**
   * 时间格式化
   * 用法同 kux/mui
   * @see https://kux.sit.kucoin.net/#/kux5.0/intl
   */
  formatDateTime,
  /**
   * 应用 url 参数获取
   */
  param,
  /**
   * 页面跳转(支持app url 跳转)
   */
  openLink,
  /**
   * 设置语言
   */
  setLang,
  /**
   * 工具方法
   */
  utils,
  /**
   * 类型检测的工具方法
   */
  is,
  /**
   * 配置基础信息
   */
  config,
  /**
   * 获取与服务器时间一致的时间戳
   */
  now,
  /**
   * 统一存储方法
   */
  storage,
  /** 预置事件名称 */
  BUILTIN_EVENT_NAMES,
  /**
   * 站点配置
   * * 请勿直接修改, 仅供读取
   * * 此处使用 getter, 避免 Object.freeze 导致其他地方无法篡改 siteCfg(why???, 目前gbiz 会篡改siteCfg) 
   */
  get siteCfg() {
    return siteCfg;
  },
  /**
   * 获取当前基础路径(如 /zh-hant, /ur-tk)
   */
  get basename() {
    return getBaseName();
  },
  /**
   * 获取当前路径(不包含语言)
   */
  get pathname() {
    return getPathnameWithoutLang();
  },
  /**
   * 全局对象, 用于 ssg 环境中 旧代码可快速兼容
   *  也可考虑后续用于模拟 window 对象
   *
   * 使用 getter, 避免 Object.freeze 导致全局对象异常
   */
  get global() {
    return globalObject;
  },
  /**
   * 获取当前语言, 为 underscore 风格
   */
  get lang() {
    return getCurrentLang();
  },
  /**
   * 是否为 RTL 语言, 使用 getter 动态计算
   */
  get isRTL() {
    return isRTL();
  },
  /** 混合应用SDK简化版 */
  hybrid,
  /**
   * 获取 app 相关元信息
   *  若不再 app 中, 则返回 {}
   */
  get appMeta() {
    return getAppMeta();
  },
  /**
   * 判断是否在 app 中
   */
  get isInApp() {
    return isInApp;
  },
  /**
   * 判断客户端页面渲染时，是否使用ssg 的html
   */
  get isUseSSG() {
    return isUseSSG;
  },
  /**
   * 是否运行在SSR环境中
   */
  get isSSR() {
    return isSSR;
  },
  /**
   * 是否在 TMA 中
   */
  get isTMA() {
    return isTMA();
  },
  /**
   * 扩展 app, 用于插件开发
   */
  extend(init: (cfg: { innerEmit: typeof innerEmit }, appInstance: any) => void) {
    init({ innerEmit }, app);
  },
};

export type IOriginalApp = typeof app;

declare global {
  interface IApp extends IOriginalApp {}

  const app: IApp;
  interface Global {
    app: IApp;
  }
}

// app 暴露到全局对象, 保证全局可用
if (!globalObject.app) {
  globalObject.app = app; 
} else {
  console.warn('[app-sdk]: app exists, skip global assignment');
}
