import { useRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { clx } from '@/common';
import { type IStickyMode, type IStickyItemHandle, MIN_BASE_Z_INDEX, useStickyContext } from './context';

export interface IStickyItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * sticky 元素的模式, 默认使用容器的模式
   */
  mode?: IStickyMode
}


export function StickyItem({ mode, children, className, ...rest}: IStickyItemProps) {
  const context = useStickyContext();
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  // 使用 ref 缓存 fixedOffsetTop 避免不必要的重新渲染
  const contextInfoRef = useRef({
    fixedOffsetTop: context?.fixedOffsetTop || 0,
    isSticky,
    baseZIndex: context?.baseZIndex || MIN_BASE_Z_INDEX,
  });

  contextInfoRef.current.baseZIndex = context?.baseZIndex || MIN_BASE_Z_INDEX;
  contextInfoRef.current.fixedOffsetTop = context?.fixedOffsetTop || 0;
  contextInfoRef.current.isSticky = isSticky;


  // 为空 或者 'none' 时不使用 sticky

  useEffect(() => {
    const $content = contentRef.current;
    const $contentWrapper = contentWrapperRef.current;
    const effectedMode = mode || context?.mode;
    // 各种无法处理sticky 的场景
    if (!context || !$contentWrapper || !$content
      // 无需 sticky 的模式
      || effectedMode === 'none' || !effectedMode
      || !context.register) {
      if(contextInfoRef.current.isSticky) setIsSticky(false);
      return;
    }
    // 注册
    const update: IStickyItemHandle['update'] = (canSticky, currentOffsetTop, offsetTop, nextOffsetTop, index) => {
      if (!canSticky) {
        setIsSticky(false);
        return 0;
      }
      if (currentOffsetTop <= offsetTop) {
        const contentHeight = $content.getBoundingClientRect().height;

        let newOffsetTop = offsetTop;
        // replace 模式下, 下一个元素已经与当前元素交叉, 需要修正当前元素的高度, 推走当前元素
        if (effectedMode === 'replace' && !app.is(nextOffsetTop, 'undefined')) {
          const diff = nextOffsetTop - (offsetTop + contentHeight);
          if (diff < 0) {
            newOffsetTop = offsetTop + diff;
            // 偏移量已经大于内容高度了, 即元素无需 sticky
            if (diff + contentHeight < 0) {
              if(contextInfoRef.current.isSticky) setIsSticky(false);
              return 0;
            }
          }
        }
        $contentWrapper.style.setProperty('height', `${contentHeight}px`);
        if(!contextInfoRef.current.isSticky) setIsSticky(true);
        $content.style.setProperty('top', `${newOffsetTop}px`);
        $content.style.setProperty('width', `${$contentWrapper.offsetWidth}px`);
        // replace 模式降低 z-index, stack 模式提升 z-index, 保证 stack 模式的元素始终在上在上面
        $content.style.setProperty('z-index', `${contextInfoRef.current.baseZIndex + (effectedMode === 'replace' ? -index : index)}`);
        // replace 模式不占用 offsetTop 高度
        return effectedMode === 'replace' ? 0 : contentHeight;
      } else {
        setIsSticky(false);
      }
      return 0;
    };

    const handle: IStickyItemHandle = {
      el: $contentWrapper,
      update,
    }

    return context.register(handle);

  }, [context?.mode, context?.register, mode]);

  useEffect(() => {
    const $item = contentWrapperRef.current;
    const $content = contentRef.current;
    const updateStickyItemsHeight = context?.updateStickyItemsHeight;
    if (!isSticky || !$item || !$content || !updateStickyItemsHeight) return;
    const removeHeight = updateStickyItemsHeight($content.getBoundingClientRect().height);

    return () => {
      $content.style.removeProperty('top');
      $content.style.removeProperty('z-index');
      $item.style.removeProperty('height');
      $content.style.removeProperty('width');
      removeHeight();
    }
  }, [isSticky, context?.updateStickyItemsHeight])

  return (
    <div className={clx('kux-sticky-item', className)} {...rest} ref={contentWrapperRef}>
      <div className={clx('kux-sticky-content', {'is-sticky': isSticky })} ref={contentRef}>
        {children}
      </div>
    </div>
  )

}
