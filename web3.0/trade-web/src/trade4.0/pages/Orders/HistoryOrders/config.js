/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 16:40:35
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-29 16:52:06
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/OrderHistory/config.js
 * @Description:
 */
import { createContext } from 'react';
// wrapper context
export const WrapperContext = createContext('');

// 组件名称
export const name = 'historyOrders';

export const eventName = `screen_${name}_change`;

export const chartConfig = {
  zoomMin: 5,
  zoomMax: 100,
  zoomDefault: 50,
  zoomSpeed: 0.1,
};
// =============== model相关 ===============
