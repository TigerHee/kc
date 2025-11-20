/**
 * Owner: jesse.shao@kupotech.com
 */
import { _t } from 'src/utils/lang';
import { KUMEX_HOST, TRADE_HOST } from 'utils/siteConfig';

// 券奖励枚举 优惠券奖励
export const COMMON_COUPON_TYPES = [
  {
    // 杠杆券
    couponType: 0,
    name: () => _t('newcomerGuide.scrollPrize4.name'),
    fullName: () => _t('newcomerGuide.scrollPrize4.name'),
    appUrl: () => `/lever/trade`,
    pcUrl: () => `${TRADE_HOST}/margin/BTC-USDT`,
    h5Url: () => '',
  },
  {
    // 合约券
    couponType: 1,
    name: () => _t('taskCenterBasic.prize3'),
    fullName: () => _t('taskCenter.coupon.contract.fullName'),
    appUrl: () => `/kumex/trade`,
    pcUrl: () => `${KUMEX_HOST}/trade/XBTUSDTM`,
    h5Url: () => `${KUMEX_HOST}/brawl/XBTUSDTM`,
  },
  {
    // 机器人券
    couponType: 2,
    name: () => _t('newcomerGuide.scrollPrize2.name'),
    fullName: () => _t('newcomerGuide.scrollPrize2.name'),
  },
];

// 体验金
export const COMMON_EX_GOLD_TYPES = [
  {
    // 杠杆券
    couponType: 0,
    name: () => '杠杆体验金',
  },
  {
    // 合约券
    couponType: 1,
    name: () => _t('common.futuresTrailFund'),
  },
];
// 字典keys
export const COMMON_DICTIONARY_KEYS = {
  ADVANCED_CHALLENGE_HOT: 'ADVANCED_CHALLENGE_HOT',
};
