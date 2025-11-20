/**
 * Owner: odan.ou@kupotech.com
 */
// 一些链接相关的配置

import { addLangToPath, getLangLink } from 'utils/lang';
import { siteCfg } from 'config';

const { MAINSITE_HOST } = siteCfg;

// 手续费跳转链接
export const CallAuctionFAQLink = {
  zh_HK: () => addLangToPath(`${MAINSITE_HOST}/news/zh-hk-introducing-kucoins-call-auction-mechanism-for-new-trading-pairs`),
  en_US: () => addLangToPath(`${MAINSITE_HOST}/news/introducing-kucoins-call-auction-mechanism-for-new-trading-pairs`),
};

/**
 * 获取集合竞价FAQ链接
 */
export const getCallAuctionFAQLink = getLangLink(CallAuctionFAQLink);
