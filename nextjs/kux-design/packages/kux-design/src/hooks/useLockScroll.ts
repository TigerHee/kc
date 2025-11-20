/**
 * Owner: larvide.peng@kupotech.com
 */

import { useEffect } from 'react';

/**
 * 锁定容器滚动
 * @param isOpen true 锁定滚动, false 解除锁定
 * @param container 指定锁定的容器, 默认为 scrollingElement
 */
export function useLockScroll(isOpen: boolean, container?: HTMLElement) {
  useEffect(() => {
    if (!isOpen) return
    const target: HTMLElement = container || document.scrollingElement as HTMLElement || document.body;
    const originalStyle = target.style.overflow;
    target.style.overflow = 'hidden';
    return () => {
      target.style.overflow = originalStyle;
    };
  }, [isOpen, container]);
}