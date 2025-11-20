/**
 * Owner: larvide.peng@kupotech.com
 */
import { createSingletonListener } from '@/common';

/**
 * 响应式屏幕尺寸类型
 * - sm: 小屏幕 (小于等于 768px)
 * - md: 中屏幕 (大于 768px 且小于等于 1200px)
 * - lg: 大屏幕 (大于 1200px 且小于等于 1440px)
 * - xl: 超大屏幕 (大于 1440px)
 */
export type IViewportSize =  'sm' | 'md' | 'lg' | 'xl';

const SIZE_KEYS = ['sm', 'md', 'lg', 'xl'] as const;

/**
 * 比较两个屏幕尺寸类型的大小
 * * 返回值小于 0: a < b
 * * 返回值等于 0: a === b
 * * 返回值大于 0: a > b
 */
export function compareViewportSize(a: IViewportSize, b: IViewportSize): number {
  return SIZE_KEYS.indexOf(a) - SIZE_KEYS.indexOf(b);
}

const VIEW_SIZE_BREAKPOINTS: { type: IViewportSize, width: number }[] = [
  { type: 'sm', width: 768 },
  { type: 'md', width: 1200 },
  { type: 'lg', width: 1440 },
  { type: 'xl', width: Infinity },
]

function getWindowSize() {
  // 未取到 app.global.innerWidth 时，默认使用 0, 兼容 SSR 模式下的服务端渲染; 此时会认为屏幕尺寸为 sm
  const width = app.global.innerWidth || 0;
  const item = VIEW_SIZE_BREAKPOINTS.find(item => width <= item.width)!;
  return item.type;
}

const subscribeWindowSize = (onUpdate: () => void) => {
  // 兼容旧浏览器在 dom 未加载完成时 viewport 为 980 的情况
  setTimeout(() => {
    onUpdate();
  }, 100);
  window.addEventListener('resize', onUpdate);
  return () => {
    window.removeEventListener('resize', onUpdate);
  };
};

const responsiveListener = createSingletonListener(subscribeWindowSize, getWindowSize);

/**
 * 获取当前屏幕尺寸类型
 * - sm: 小屏幕 (小于等于 768px)
 * - md: 中屏幕 (大于 768px 且小于等于 1200px)
 * - lg: 大屏幕 (大于 1200px 且小于等于 1440px)
 * - xl: 超大屏幕 (大于 1440px)
 */
export const useResponsive = responsiveListener.useValue;
