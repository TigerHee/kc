import { useMemo, useEffect } from 'react';

let zIndex = 1000;

/**
 * 获取当前的z-index
 * 每次使用会递增, 使用完重置, 保证后面的蒙层总能在前面
 * @param visible 是否可见, 为 true 时才会递增 zIndex, false 时则返回当前 zIndex
 * @example 页面上有一个一直展示的popover, 此时再打开一个modal, modal 中再打开一个popover, 页面元素的 zIndex 会依次递增
 */
export function useZIndex(visible?: boolean) {
  const nextZIndex = useMemo(() => visible ? ++zIndex : zIndex, [visible]);

  useEffect(() => {
    if (!visible) return;
    return () => {
      zIndex -= 1;
    };
  }, [visible]);

  return nextZIndex;
}