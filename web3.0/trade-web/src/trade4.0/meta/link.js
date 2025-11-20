/**
 * Owner: odan.ou@kupotech.com
 */
// 一些链接相关的配置

import { addLangToPath } from 'utils/lang';
import { siteCfg } from 'config';

const { MAINSITE_HOST } = siteCfg;

/**
 * 获取多语言链接，默认情况下默认语言为 en_US
 * @param {Record<string, string>} conf
 * @param {string} [defLang]
 */
export const getLangLink = (conf, defLang = 'en_US') => (lang) => {
  const res = conf?.[lang] || conf?.[defLang];
  return typeof res === 'function' ? res() : res;
};

// 手续费跳转链接
export const CallAuctionFAQLink = {
  zh_HK: () => addLangToPath(`${MAINSITE_HOST}/news/zh-hk-introducing-kucoins-call-auction-mechanism-for-new-trading-pairs`),
  en_US: () => addLangToPath(`${MAINSITE_HOST}/news/introducing-kucoins-call-auction-mechanism-for-new-trading-pairs`),
};

/**
 * 获取集合竞价FAQ链接
 */
export const getCallAuctionFAQLink = getLangLink(CallAuctionFAQLink);

/**
 * 杠杆借贷利率落地页
 */
export const getMarginDataUrl = () => addLangToPath(`${MAINSITE_HOST}/margin-data/loan-rates`);

/**
 * 全仓杠杆风险限额落地页
 */
export const getCrossRiskLimitUrl = () => addLangToPath(`${MAINSITE_HOST}/margin-data/cross-risk-limit`);

/**
 * 逐仓杠杆风险限额落地页
 */
export const getIsolatedRiskLimitUrl = () =>
  addLangToPath(`${MAINSITE_HOST}/margin-data/isolated-risk-limit`);

/**
 * 现货||杠杆 API url
 */
export const getSpotAndMarginAPIUrl = (isSpot) =>
  addLangToPath(
    `${MAINSITE_HOST}${
      isSpot
        ? '/docs/rest/spot-trading/market-data/introduction'
        : '/docs/rest/margin-trading/market-data'
    }`,
  );

/**
 * 新手必看：槓桿交易新手指引
 */
export const getMarginGuideLink = () => addLangToPath(`${MAINSITE_HOST}/support/900005034163`);
