/*
 * owner: Clyne@kupotech.com
 */
import { createContext } from 'react';
// wrapper context
export const WrapperContext = createContext('');

// 组件名称
export const name = 'depth';

export const eventName = `screen_${name}_change`;

export const theme = (currentTheme, colors) => {
  return {
    scaleColor: colors.text40, // 刻度颜色 text40
    bgColor: colors.overlay, // 背景色
    gridColor: colors.cover16, // 网格线条色
    asksStyle: {
      // 面积图样式asks
      fill: currentTheme === 'light' ? '#FEEEEE' : '#291919',
      stroke: colors.secondary,
      strokeWidth: 2,
    },
    bidsStyle: {
      // 面积图样式bids
      fill: currentTheme === 'light' ? '#E6F8F4' : '#10231E',
      stroke: colors.primary,
      strokeWidth: 2,
    },
  };
};

export const chartConfig = {
  zoomMin: 5,
  zoomMax: 100,
  zoomDefault: 50,
  zoomSpeed: 0.1,
};
// =============== model相关 ===============

// 组件dva models
export { namespace } from '@/pages/Orderbook/config';
