/**
 * 滚动相关的工具函数
 */

const defaultOptions: ScrollIntoViewOptions = { behavior: 'smooth' };

/**
 * 将元素滚动到视口内
 * @param selector 元素选择器或元素
 * @param options 
 * @returns 
 */
export const scrollIntoView = (selector: string | HTMLElement, options = defaultOptions) => {
  if (!selector) return;
  const element = app.is(selector, 'string') ? document.querySelector(selector) : selector;
  if (!element) return;
  // 在弹窗中调用时window被锁了导致不生效，因此放到raf中
  requestAnimationFrame(() => {
    element.scrollIntoView(options);
  });
}

export type IScrollOffset = number | { top?: number; start?: number };

/**
 * 获取元素的滚动父元素
 * @param el 
 * @returns 
 */
export function getScrollableParent(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflow = style.overflow + style.overflowY + style.overflowX;
    const hasScroll = /(auto|scroll|overlay)/.test(overflow);
    const canScroll =
      parent.scrollHeight > parent.clientHeight ||
      parent.scrollWidth > parent.clientWidth;

    if (hasScroll && canScroll) return parent;
    parent = parent.parentElement;
  }
  return null;
}


export interface IAnimateScrollXYOptions {
  /**
   * 水平滚动到的位置, 不传则不滚动
   */
  toX?: number | undefined,
  /**
   * 垂直滚动到的位置, 不传则不滚动
   */
  toY?: number | undefined,
  /**
   * 滚动动画时长, 单位毫秒, 默认300ms
   */
  duration?: number
}

/**
 * 动画滚动, 支持水平和垂直同时滚动
 * @param container 需要滚动的容器
 * @param options
 */
export function animateScrollXY(container: HTMLElement, options: IAnimateScrollXYOptions) {
  const { toX, toY, duration = 300 } = options;

  const fromX = container.scrollLeft;
  const fromY = container.scrollTop;

  const deltaX = toX !== undefined ? toX - fromX : 0;
  const deltaY = toY !== undefined ? toY - fromY : 0;

  if (duration <= 0) {
    if (toX !== undefined) container.scrollLeft = toX;
    if (toY !== undefined) container.scrollTop = toY;
    return;
  }

  const startTime = performance.now();

  function animate(time: number) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    if (toX !== undefined) {
      container.scrollLeft = fromX + deltaX * ease;
    }
    if (toY !== undefined) {
      container.scrollTop = fromY + deltaY * ease;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

