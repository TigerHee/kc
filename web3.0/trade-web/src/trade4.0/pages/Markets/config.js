/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-05 15:07:20
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-18 20:32:53
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/config.js
 * @Description:
 */
import { createContext } from 'react';
// wrapper context
export const WrapperContext = createContext('');

// 组件名称
export const name = 'markets';
// resize 宽高
export const eventName = `screen_${name}_change`;

export const scrollEvent = 'recent-trade-scroll';
export const scollToLast = 'scroll-to-last';

export const maxSize = 100;

// 15s socket失败后
export const recentTradeLoop = 15 * 1000;

// =============== model相关 ===============
