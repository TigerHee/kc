/*
 * owner: Clyne@kupotech.com
 */
import { createContext } from 'react';
// wrapper context
export const WrapperContext = createContext('');

// 组件名称
export const name = 'recentTrade';

export const blockid = 'recentTrades';

export const scrollEvent = 'recent-trade-scroll';
export const scollToLast = 'scroll-to-last';

export const maxSize = 100;

// 15s socket失败后
export const recentTradeLoop = 15 * 1000;

// =============== model相关 ===============

// 组件dva models
export const namespace = '$recentTrade';

// 买卖的枚举值
export const SELL = 'sell';
export const BUY = 'buy';

export const defaultState = {
  // 基础币种 用于展示amount，total
  baseCurrency: '',
  // 计价单位 用于展示price
  quoteCurrency: '',
  // 数量精度
  amountPrecision: '',
  // 价格精度
  precision: '',
  // 数据
  data: {},
};
