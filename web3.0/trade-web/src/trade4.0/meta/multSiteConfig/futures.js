/**
 * Owner: clyne@kupotech.com
 * 统一管理多租户的配置
 */

import { KC_SITE, TH_SITE, TR_SITE } from 'src/trade4.0/utils/brand';

// 体验金 or 抵扣券
export const FUTURES_TRIAL_COUPONS = 'FUTURES_TRIAL_COUPONS';
// 稳定套利
export const FUTURES_RATE_PROFIT = 'FUTURES_RATE_PROFIT';
// 通知提示
export const FUTURES_NOTICE_SETTING = 'FUTURES_NOTICE_SETTING';
// 分享屏蔽
export const FUTURES_SHARE = 'FUTURES_SHARE';
/**
 * 合约PNL税收展示控制配置
 */
export const FUTURES_PNL_TAX = 'FUTURES_PNL_TAX';
export const DISABLED_CONTRACT_RATE_PROFIT = 'DISABLED_CONTRACT_RATE_PROFIT';
// 合约运营阵地泰国站屏蔽
export const FUTURES_TH_PERKS = 'FUTURES_TH_PERKS';

// 多租户配置
export const FUTURES_COMPLIANT_CONFIG = {
  [TR_SITE]: {},
  [TH_SITE]: {
    [FUTURES_PNL_TAX]: true,
    [DISABLED_CONTRACT_RATE_PROFIT]: true,
    [FUTURES_TH_PERKS]: true,
    [FUTURES_TRIAL_COUPONS]: true,
    [FUTURES_RATE_PROFIT]: true,
    [FUTURES_NOTICE_SETTING]: true,
    [FUTURES_SHARE]: true,
  },
  [KC_SITE]: {
    [FUTURES_PNL_TAX]: true,
  },
};

// 这个地方不能用参数变量，只能写死，spm 改动需要知会配置方
const SPM_PREFIX = 'kcWeb.B5futures';

// SPM ID 统一控制（注意这里有埋点上报，可以直接用埋点 id）
// 运营阵地入口
const FUTURES_PERKS_SPM = `${SPM_PREFIX}.futuresPerks.1`;
// 稳定套利入口
const FUTURES_RATE_PROFIT_SPM = `${SPM_PREFIX}.futuresRateProfit.1`;

export const FUTURES_COMPLIANT_SPM = {
  FUTURES_PERKS_SPM,
  FUTURES_RATE_PROFIT_SPM,
};
