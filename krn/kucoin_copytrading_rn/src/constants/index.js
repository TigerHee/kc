export * from './enhance-colors';

export * from './router-name-map';

export * from './queryKeys';

export * from './businessType';

export * from './date';

export const DEFAULT_PAGINATION_PARAM = {
  pageSize: 10,
  currentPage: 0,
};

/** 通用 轮训刷新间隔10s */
export const COMMON_REFRESH_INTERVAL = 10 * 1000; // 10s

/** 跟单主页 当前列表 轮训刷新间隔10s */
export const CURRENT_LIST_REFRESH_INTERVAL = 10 * 1000; // 10s

/** 跟单主页 当前列表高频 轮训刷新间隔 5s */
export const CURRENT_LIST_HIGH_FREQ_REFRESH_INTERVAL = 5 * 1000; // 5s

/**部分场景高频 轮训刷新间隔 3s */
export const HIGH_FREQ_REFRESH_INTERVAL = 3 * 1000; // 3s

export const mediumHitSlop = {top: 10, bottom: 10, left: 10, right: 10};

export const largeHitSlop = {top: 20, bottom: 20, left: 20, right: 20};

/** 协议签署场景类型常量 */
export const AGREEMENT_SCENE_TYPE = {
  LEAD_TRADE: 'leadTrade',
  COPY_TRADE: 'copyTrade',
};
