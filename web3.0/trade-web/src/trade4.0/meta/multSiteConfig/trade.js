/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-10-14 14:00:30
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-04 20:51:22
 * @FilePath: /trade-web/src/trade4.0/meta/multSiteConfig/trade.js
 * @Description: 交易大厅多站点配置,  下面为 true 表示需要屏蔽或者隐藏
 */

import { KC_SITE, TH_SITE, TR_SITE } from 'src/trade4.0/utils/brand';

/**
 *  交易大厅
 */
export const TRADE_TOOLBAR_NEWS = 'TRADE_TOOLBAR_NEWS'; // 工具栏 News
export const TRADE_TOOLBAR_INFO = 'TRADE_TOOLBAR_INFO'; // 工具栏 交易信息
export const TRADE_TOOLBAR_TAX_LEVELINFO = 'TRADE_TOOLBAR_TAX_LEVELINFO'; // 工具栏 交易信息-交易费率level说明
export const TRADE_TOOLBAR_TUTORIAL = 'TRADE_TOOLBAR_TUTORIAL'; // 工具栏 教程
export const TRADE_TOOLBAR_SETTING_MARKETALERT = 'TRADE_TOOLBAR_SETTING_MARKETALERT'; // 设置 行情预警


// 多租户配置
export const TRADE_COMPLIANT_CONFIG = {
  [TR_SITE]: {
    [TRADE_TOOLBAR_NEWS]: true,
    [TRADE_TOOLBAR_INFO]: true,
    [TRADE_TOOLBAR_TAX_LEVELINFO]: true,
    [TRADE_TOOLBAR_TUTORIAL]: true,
    [TRADE_TOOLBAR_SETTING_MARKETALERT]: true,
  },
  [TH_SITE]: {
    [TRADE_TOOLBAR_NEWS]: true,
    [TRADE_TOOLBAR_INFO]: false,
    [TRADE_TOOLBAR_TAX_LEVELINFO]: true,
    [TRADE_TOOLBAR_TUTORIAL]: false,
    [TRADE_TOOLBAR_SETTING_MARKETALERT]: true,
  },
  [KC_SITE]: {
    [TRADE_TOOLBAR_NEWS]: false,
    [TRADE_TOOLBAR_INFO]: false,
    [TRADE_TOOLBAR_TAX_LEVELINFO]: false,
    [TRADE_TOOLBAR_TUTORIAL]: false,
    [TRADE_TOOLBAR_SETTING_MARKETALERT]: false,
  },
};
