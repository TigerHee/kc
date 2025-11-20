import { useState, useEffect, type RefObject } from 'react';
import { createSingletonListener, IntersectionObserverManager } from '@/common';

// 是否是触摸设备, 兼容ssg
const isTouchDevice =  !!app.global.navigator && (app.global.navigator.maxTouchPoints > 0 || ('ontouchstart' in app.global));

// 记录当前页面是否在滚动, 保证滚动期间新增的事件监听可以立即获取到最新的状态
let isPageScrolling = false
function getIsScrolling(): boolean {
  return isPageScrolling
}

const subscribePageScrolling = (onUpdate: () => void) => {
  let tid: number;
  const onScrolling = () => {
    isPageScrolling = true;
    onUpdate();
    clearTimeout(tid);
    // @ts-expect-error setTimeout returns a number
    tid = setTimeout(() => {
      isPageScrolling = false;
      onUpdate();
    }, 150);
  }
  window.addEventListener('scroll', onScrolling, { passive: true });
  return () => {
    clearTimeout(tid as any);
    isPageScrolling = false;
    window.removeEventListener('scroll', onScrolling);
  }
}

/**
 * 页面是否在滚动的监听器
 */
const isPageScrollingListener = createSingletonListener(subscribePageScrolling, getIsScrolling);


/**
 * 检测元素是否应该播放动画
 * * 滚动中或者不在视窗内时，不播放动画; 若不支持 IntersectionObserver 则只使用滚动监听
 * @param elRef 动画元素(或者动画的所在的容器元素)的 ref
 * @param checkTouchOnly 是否仅在触摸设备上进行检测, 若为true, PC 上本hook始终返回 true
 * @returns 是否应该播放动画
 */
export function useShouldAnimate(elRef: RefObject<HTMLElement>, checkTouchOnly: boolean = true): boolean {
  // 仅在触摸设备上检测时，且当前设备不是触摸设备时，直接返回 true
  const shouldCheck = !checkTouchOnly || isTouchDevice;
  const [canAnimate, setCanAnimate] = useState<boolean>(() => {
    return shouldCheck ? !isPageScrollingListener.get() : true;
  });

  useEffect(() => {
    const dom = elRef.current;
    if (!dom || !shouldCheck) return;
    let isScrolling = isPageScrollingListener.get();
    // 不支持 IntersectionObserver 时，则认为始终可见
    let isIntersecting = !IntersectionObserverManager.isSupported || false;

    const updateCanAnimate = () => {
      setCanAnimate(!isScrolling && isIntersecting);
    }
    const cleanupScrollListener = isPageScrollingListener.subscribe(() => {
      isScrolling = isPageScrollingListener.get();
      updateCanAnimate();
    });

    // 如果不支持 IntersectionObserver，则只使用滚动监听, 返回滚动监听的清理函数
    if (!IntersectionObserverManager.isSupported) {
      return cleanupScrollListener;
    }

    const cleanupIntersectionListener = IntersectionObserverManager.shared.observe(dom, (isIntersected) => {
      isIntersecting = isIntersected;
      updateCanAnimate();
    })

    return () => {
      cleanupScrollListener();
      cleanupIntersectionListener();
    }
  }, [shouldCheck, elRef]);

  return canAnimate;
}
