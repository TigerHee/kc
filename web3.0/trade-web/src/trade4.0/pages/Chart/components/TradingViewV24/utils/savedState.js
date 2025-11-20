/*
 * @Owner: elliott.su@kupotech.com
 */
import storage from '@/pages/Chart/utils/index';

// 需要单独存储在服务器的key
export const TRADINGVIEW_USER_SETTING_CHART = 'savedChartData';

const TRADINGVIEW_THEME = 'tradingview.current_theme.name';
/**
 * @description: 是否需要复写自定义样式
 * @param {string} theme 最新样式
 */
export function needApplyOverrides(theme) {
  const lastTheme = storage.getItem(TRADINGVIEW_THEME);
  if (lastTheme) {
    return lastTheme !== theme;
  }
  return true;
}

/**
 * @description: 单独设置tv主题
 * @param {string} theme 最新主题
 */
export function setTvTheme(theme) {
  return storage.setItem(TRADINGVIEW_THEME, theme);
}

/**
 * @description: 获取指标及画线数据
 */
export function getStudyDrawData() {
  return storage.getItem(TRADINGVIEW_USER_SETTING_CHART);
}

/**
 * @description: 设置指标及画线数据
 * @param {string} state tv K线状态
 */
export function setStudyDrawData(state) {
  return storage.setItem(TRADINGVIEW_USER_SETTING_CHART, state);
}
