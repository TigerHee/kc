/**
 * Owner: vijay.zhou@kupotech.com
 */
/** useType 枚举，创建 api 的接口入参 */
export const USE_TYPES = {
  BROKER: 'broker',
  API: 'api',
  OTHER: 'other',
};

/** 前端 tab 枚举 */
export const API_TABS = {
  BROKER: 'broker',
  API: 'api',
  LEAD_TRADE_API: 'leadTradeApi',
  OTHER: 'other',
};

/** tab 到 useType 的映射 */
export const TAB_2_USE_TYPE = {
  [API_TABS.BROKER]: USE_TYPES.BROKER,
  [API_TABS.OTHER]: USE_TYPES.OTHER,
  // LEAD_TRADE_API 和 API 本质上是一样的，但产品要求在业务上作区分
  // 后端不同意加字段做标识，而产品有意在以后对 API 管理的页面重新设计
  // 沟通后结论是在前端做区分，后续页面重构再梳理
  [API_TABS.API]: USE_TYPES.API,
  [API_TABS.LEAD_TRADE_API]: USE_TYPES.API,
};

// 创建 API， IP 最大个数限制
export const IP_LIMIT_COUNT = 50;
