/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-04-26 14:19:02
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-28 12:00:24
 * @FilePath: /trade-web/src/trade4.0/meta/multiTenantSetting.js
 * @Description:
 */
import { FUTURES_COMPLIANT_CONFIG } from '@/meta/multSiteConfig/futures';
import { TRADE_COMPLIANT_CONFIG } from '@/meta/multSiteConfig/trade';
import { SPOT_COMPLIANT_CONFIG } from '@/meta/multSiteConfig/spot';
import { KC_SITE, TH_SITE, TR_SITE } from '@/utils/brand';

// 交易类型枚举
export const SPOT = 'TRADE';
export const MARGIN = 'MARGIN_TRADE';
export const FUTURES = 'FUTURES';
export const ISOLATED = 'MARGIN_ISOLATED_TRADE';
export const STRATEGY = 'STRATEGY';

let isDisplayBotStrategyCached;
let isDisplayFuturesCached = window.localStorage.getItem('DISPLAY_FUTURES_CACHED') || undefined;
let isDisplayMarginCached;
let isDisplayFeeInfoCached;
let isDisplaVideoTutorialCached;
let isDisplayAuctionCached;

// 是否在交易大厅，开启机器人策略交易功能
export const isDisplayBotStrategy = () => {
  if (typeof isDisplayBotStrategyCached !== 'undefined') {
    return isDisplayBotStrategyCached;
  } else {
    if (window._BRAND_SITE_ === 'TR' || window._BRAND_SITE_ === 'TH') {
      isDisplayBotStrategyCached = false;
      return false;
    }
    isDisplayBotStrategyCached = true;
    return true;
  }
};

// 是否在交易大厅，开启合约交易功能
export const isDisplayFutures = () => {
  if (typeof isDisplayFuturesCached !== 'undefined') {
    if (isDisplayFuturesCached === 'true') {
      return true;
    }
    if (isDisplayFuturesCached === 'false') {
      return false;
    }
    return isDisplayFuturesCached;
  } else {
    if (window._BRAND_SITE_ === 'TR' || window._BRAND_SITE_ === 'TH') {
      isDisplayFuturesCached = false;
      return false;
    }
    isDisplayFuturesCached = true;
    return true;
  }
};

// 是否在交易大厅，开启杠杆交易功能
export const isDisplayMargin = () => {
  if (typeof isDisplayMarginCached !== 'undefined') {
    return isDisplayMarginCached;
  } else {
    if (window._BRAND_SITE_ === 'TR' || window._BRAND_SITE_ === 'TH') {
      isDisplayMarginCached = false;
      return false;
    }

    isDisplayMarginCached = true;
    return true;
  }
};

// 是否在交易大厅，展示现货手续费优惠
export const isDisplayFeeInfo = () => {
  if (typeof isDisplayFeeInfoCached !== 'undefined') {
    return isDisplayFeeInfoCached;
  } else {
    if (window._BRAND_SITE_ === 'TR' || window._BRAND_SITE_ === 'TH') {
      isDisplayFeeInfoCached = false;
      return false;
    }
    isDisplayFeeInfoCached = true;
    return true;
  }
};

// 是否在交易大厅，展示视频教程
export const isDisplayVideoTutorial = () => {
  if (typeof isDisplaVideoTutorialCached !== 'undefined') {
    return isDisplaVideoTutorialCached;
  } else {
    if (window._BRAND_SITE_ === 'TR' || window._BRAND_SITE_ === 'TH') {
      isDisplaVideoTutorialCached = false;
      return false;
    }
    isDisplaVideoTutorialCached = true;
    return true;
  }
};

// 是否在交易大厅，使用集合竞价功能
export const isDisplayAuction = () => {
  if (typeof isDisplayAuctionCached !== 'undefined') {
    return isDisplayAuctionCached;
  } else {
    if (window._BRAND_SITE_ === 'TR' || window._BRAND_SITE_ === 'TH') {
      isDisplayAuctionCached = false;
      return false;
    }
    isDisplayAuctionCached = true;
    return true;
  }
};

/**
 *  多租户配置，用于配置不同站点的模块开关逻辑
 **/
export const COMPLIANT_CONFIG = {
  [TR_SITE]: {
    ...FUTURES_COMPLIANT_CONFIG[TR_SITE],
    ...TRADE_COMPLIANT_CONFIG[TR_SITE],
    ...SPOT_COMPLIANT_CONFIG[TR_SITE],
  },
  [TH_SITE]: {
    ...FUTURES_COMPLIANT_CONFIG[TH_SITE],
    ...TRADE_COMPLIANT_CONFIG[TH_SITE],
    ...SPOT_COMPLIANT_CONFIG[TH_SITE],
  },
  [KC_SITE]: {
    ...FUTURES_COMPLIANT_CONFIG[KC_SITE],
    ...TRADE_COMPLIANT_CONFIG[KC_SITE],
    ...SPOT_COMPLIANT_CONFIG[KC_SITE],
  },
};

// 收拢展业中台的spm配置
export const COMPLIANT_BOX_SPM_CONFIG = {
  HideNews: 'kcWeb.B5trading.tradeZoneFunctionArea.2',
};
