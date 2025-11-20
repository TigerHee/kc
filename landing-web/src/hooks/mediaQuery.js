/**
 * Owner: jesse.shao@kupotech.com
 */
import { useMediaQuery } from 'react-responsive';

/**
 * 鉴于现在响应式基本为三套设计图，所以以下hooks主要对mediaQuery判断逻辑进行通用化提取
 * 断点与推荐单位：与src/themes/mix.less 保持一致
 * 详见： 响应式页面开发规范 https://wiki.kupotech.com/pages/viewpage.action?pageId=20458759
 */
// PC大屏
export const useIsLarge = params => {
  return useMediaQuery(params || { minWidth: 1025 });
};

// Ipad中屏
export const useIsMiddle = params => {
  return useMediaQuery(params || { minWidth: 769, maxWidth: 1024 });
};

// Phone小屏
export const useIsSmall = params => {
  return useMediaQuery(params || { maxWidth: 768 });
};
