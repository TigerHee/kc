import { useRef, useMemo, useEffect, useCallback, type HTMLAttributes, type ReactNode } from 'react';
import { StickyContext, MIN_BASE_Z_INDEX, DEFAULT_BASE_Z_INDEX, type IStickyItemHandle } from './context';
import { clx } from '@/common';
import './style.scss';

export * from './sticky-item';

export interface IStickyContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * sticky 元素距离视口顶部的偏移量, 默认 0
   */
  offsetTop?: number;
  /**
   * 分组默认的 sticky 模式, 默认为 replace
   */
  defaultMode?: 'replace' | 'stack' | 'none';
  /**
   * 容器内部所有当前处于 sticky 状态下的元素的高度总和变化的事件
   * @param height 容器内部所有当前处于 sticky 状态下的元素的高度总和
   */
  onStickyItemsHeightChange?: (height: number) => void;
  /**
   * sticky 元素的基础 z-index, 默认为 200
   * * `replace` 模式下, sticky 元素的 z-index 会在此基础上递减 -1
   * * `stack` 模式下, sticky 元素的 z-index 会在此基础上递增+1
   */
  baseZIndex?: number;
}

export function StickyContainer(
  {children, offsetTop = 0, baseZIndex, onStickyItemsHeightChange, defaultMode = 'replace', className, ...rest}: IStickyContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<IStickyItemHandle[]>([]);

  // 使用 ref 缓存 配置, 避免对hooks 产生太多依赖
  const optionsRef = useRef({
    fixedOffsetTop: offsetTop,
    defaultMode,
    stickyItemsHeight: 0,
    onStickyItemsHeightChange,
    lastCanSticky: false,
  });
  optionsRef.current.onStickyItemsHeightChange = onStickyItemsHeightChange;

  const scheduleUpdate = useCallback(() => {
    const $container = containerRef.current;
      if (!$container) return;
      const rect = $container.getBoundingClientRect();
      const options = optionsRef.current;
      const fixedOffsetTop = options.fixedOffsetTop;
      
      // 是否容器是否与视口顶部交叉
      const canSticky = !(rect.top > fixedOffsetTop || rect.bottom < fixedOffsetTop);
      // 如果上次的状态和当前状态不一致, 触发更新
      if (!canSticky) {
        if (optionsRef.current.lastCanSticky !== canSticky) {
          $container.classList.toggle('can-sticky', false);
          itemsRef.current.forEach(item => item.update(canSticky, 0, 0, 0, 0));
          optionsRef.current.lastCanSticky = canSticky;
        }
        return;
      }
      optionsRef.current.lastCanSticky = canSticky;
      let accHeight = fixedOffsetTop;
      const stickyItemsHeight = options.stickyItemsHeight;
      // 延迟设置启用 sticky, 避免边缘场景(第一个刚进入触发sticky的范围的滚动事件)下 内容抖动的问题
      if (stickyItemsHeight) {
        $container.classList.toggle('can-sticky', true);
      }

      // 计算需要修正的偏移量
      //  容器底部距离视口顶部的距离不够展示已有的sticky元素的时候, 需要整体向上修正
      let correctionOffset = rect.bottom - (fixedOffsetTop + stickyItemsHeight);
      // 修正量大于0 表示剩余空间足够, 无需修正
      if (correctionOffset > 0) correctionOffset = 0;
      const offsetTopOfItems = itemsRef.current.map(item => item.el.getBoundingClientRect().top);
      itemsRef.current.forEach((item, index) => {
        accHeight += item.update(canSticky, offsetTopOfItems[index]!, accHeight + correctionOffset, offsetTopOfItems[index + 1], index);
      });
  }, []);

  // 更新 stickyItemsHeight 的高度
  const updateStickyItemsHeight = useCallback((height: number) => {
    const nextHeight = optionsRef.current.stickyItemsHeight + height;
    optionsRef.current.stickyItemsHeight = nextHeight;
    // 延迟触发更新事件, 避免导致卡顿
    setTimeout(() => {
      optionsRef.current.onStickyItemsHeightChange?.(nextHeight);
    }, 0);
    return () => {
      const newHeight = optionsRef.current.stickyItemsHeight - height;
      optionsRef.current.stickyItemsHeight = newHeight;
      // 延迟触发更新事件, 避免导致卡顿
      setTimeout(() => {
        optionsRef.current.onStickyItemsHeightChange?.(newHeight);
      }, 0);
    }
  }, []);

  // 更新 optionsRef 的值
  useEffect(() => {
    optionsRef.current.fixedOffsetTop = offsetTop;
    optionsRef.current.defaultMode = defaultMode;
    scheduleUpdate();
  }, [offsetTop, defaultMode, scheduleUpdate]);

  // 注册 sticky item
  const register = useCallback((item: IStickyItemHandle) => {
    itemsRef.current.push(item);
    // 对元素进行排序, 保证按元素在视口的顺序先后调用
    itemsRef.current = sortStickyItemsByRect(itemsRef.current);
    scheduleUpdate();

    return () => {
      itemsRef.current = itemsRef.current.filter(i => i !== item);
      scheduleUpdate();
    };
  }, [scheduleUpdate]);

  useEffect(() => {
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    }
  }, [scheduleUpdate]);

  const fixedBaseZIndex = useMemo(() => fixBaseZIndex(baseZIndex), [baseZIndex]);

  return (
    <StickyContext.Provider
      value={{
        register,
        baseZIndex: fixedBaseZIndex,
        updateStickyItemsHeight,
        fixedOffsetTop: offsetTop,
        mode: defaultMode,
      }}
    >
      <div
        {...rest}
        ref={containerRef}
        className={clx('kux-sticky-container', className)}
        data-mode={defaultMode}
      >
        {children}
      </div>
    </StickyContext.Provider>
  );
}

function fixBaseZIndex(baseZIndex?: number) {
  if (app.is(baseZIndex,'undefined')) return DEFAULT_BASE_Z_INDEX;
  return Math.max(Number(baseZIndex) || 0, MIN_BASE_Z_INDEX); 
}

/**
 * 对元素按照其在视口中的位置进行排序
 */
function sortStickyItemsByRect(items: IStickyItemHandle[]) {
  return items.sort((a, b) => {
    const rectA = a.el.getBoundingClientRect();
    const rectB = b.el.getBoundingClientRect();
    return rectA.top - rectB.top;
  });
}
