/*
 * @Owner: Clyne@kupotech.com
 */
import { createContext } from 'react';

import { KC_SITE, TH_SITE } from '@/utils/brand';

import { futuresPositionNameSpace } from '../config';

// wrapper context
export const WrapperContext = createContext('');
// breakpoint
export const breakPoints = [280, 580, 768, 1024, 1280];
// namespace
export const namespace = futuresPositionNameSpace;
// name
export const name = 'FuturesPosition';
// sell
export const SELL = 'sell';
// long
export const LONG = 'long';
// isolated
export const ISOLATED = 'ISOLATED';
// Cross
export const CROSS = 'CROSS';

export const BRAND_POSITION_LINK = {
  [TH_SITE]: {
    avgU: `/support/10521279141903 `, // u本位 平均入场价格
    avgCoin: `/support/10521279141903`, // 币本位 平均入场价格
    markPriceU: `/support/10493427007887`, // u本位 标记价格
    isolatedLIQ: `/support/10395232768399`, // 逐仓强平价
    crossLIQ: `/support/10521260525071`, // 全仓强平价
    crossRisk: `/support/10395220418831`, // 全仓风险率
  },
  [KC_SITE]: {
    avgU: `/support/26685254904601`, // u本位 平均入场价格
    avgCoin: `/support/26693238981785`, // 币本位 平均入场价格
    markPriceU: `/support/26684973273625`, // u本位 标记价格
    isolatedLIQ: `/support/26694703491737`, // 逐仓强平价
    crossLIQ: `/support/35084431335065`, // 全仓强平价
    crossRisk: `/support/35233217061785`, // 全仓风险率
  },
};
