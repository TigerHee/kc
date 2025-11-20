/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description FixedContainer component
 */
import { useRef, useEffect, type ReactNode } from 'react';
import './style.scss'

export interface IFixedContainerProps {
  children: ReactNode
  /**
   * 容器高度变化时的回调函数
   * @param height - 当前容器高度
   * @param prevHeight - 上一次容器高度
   */
  onHeightChange?: (height: number, prevHeight: number) => void
}

/**
 * FixedContainer component
 */
export function FixedContainer(props: IFixedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const onHeightChange = useRef(props.onHeightChange);
  onHeightChange.current = props.onHeightChange;

  useEffect(() => {
    const container = containerRef.current;
    const root = rootRef.current;
    if (!container || !root) return;

    // 此处未使用性能相对更好的 ResizeObserver, 是因为在某些情况下(猜测应该是ssg中),
    // 会出现问题: ResizeObserver loop completed with undelivered notifications
   
    let height = 0;
    let rafId: number;
    let isContentFixed = false;
    const updateHeight = () => {
      // 使用 requestAnimationFrame 来优化性能
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // 获取容器的高度, getBoundingClientRect 会更精准, .clientHeight 可能存在1px 内的偏差
        const nextHeight = container.getBoundingClientRect().height;
        if (nextHeight === height) return;
        // 有高度时(避免初始时的 0 高度), 将容器设置为固定定位
        if (nextHeight && !isContentFixed) {
          isContentFixed = true;
          // 延迟设置固定定位类名, 确保root高度已生效
          setTimeout(() => {
            container.classList.add('is-content-fixed');
          }, 100);
        }
        root.style.height = `${nextHeight}px`;
        onHeightChange.current?.(nextHeight, height);
        height = nextHeight;
      });
    };

    // 初始高度获取
    setTimeout(updateHeight, 50);

    const mutationObserver = new MutationObserver(updateHeight);
    // 此处监听容器的子元素变化和属性变化, 保证可以即使地响应内容变化导致的尺寸变化
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener('resize', updateHeight);

    return () => {
      mutationObserver.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div className='kux-fixed-container' ref={rootRef} >
      <div
        ref={containerRef}
        className='kux-fixed-container_content'
      >
        {props.children}
      </div>
    </div>
  );
};

