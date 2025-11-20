/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-10-14 14:00:30
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-28 11:52:49
 * @FilePath: /trade-web/src/trade4.0/meta/multSiteConfig/trade.js
 * @Description: 交易大厅-现货 多站点配置,  下面为 true 表示需要屏蔽或者隐藏
 */

import { KC_SITE, TH_SITE, TR_SITE } from 'src/trade4.0/utils/brand';

/**
 *  交易大厅-现货
 */
export const TRADE_SPOT_AUCTION = 'TRADE_SPOT_AUCTION'; // 现货 集合竞价

// 多租户配置
export const SPOT_COMPLIANT_CONFIG = {
  [TR_SITE]: {
    [TRADE_SPOT_AUCTION]: true,
  },
  [TH_SITE]: {
    [TRADE_SPOT_AUCTION]: true,
  },
  [KC_SITE]: {
    [TRADE_SPOT_AUCTION]: false,
  },
};
