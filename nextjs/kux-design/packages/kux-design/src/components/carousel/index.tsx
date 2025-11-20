/**
 * Owner: saiya.lee@kupotech.com
 * @description 轮播图组件
 */
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { flattenReactChildren } from '@/common'
import { ArrowLeftIcon, ArrowRightIcon } from '@kux/iconpack';
import { HStack, Stack } from '../stack'
import './style.scss'

export interface ICarouselProps {
  /**
   * 轮播元素
   */
  children: React.ReactNode
  /**
   * 同时可见的元素数量, 默认为 1
   */
  visibleCount?: number;
  /**
   * 每个元素之间的间距, 默认为 0
   */
  gap?: number;
  /**
   * 是否隐藏分页指示器
   */
  hideIndicators?: boolean;
  /**
   * 是否隐藏控制按钮
   */
  hideControls?: boolean;
  /**
   * 是否自动播放, 默认为 false
   */
  autoplay?: boolean;
  /**
   * 自动播放间隔时间, 单位为毫秒, 默认为 3000
   */
  autoplayInterval?: number;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

export function Carousel(props: ICarouselProps) {
  // 基础状态
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const childrenArray = useMemo(() => flattenReactChildren(props.children), [props.children]);
  const total = childrenArray.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<number>();
  const itemCount = props.visibleCount || 1;
  const totalPage = Math.ceil(total / itemCount);

  // 创建双倍的轮播项，包括原始项和复制项
  const doubleItems = useMemo(() => {
    return [...childrenArray, ...childrenArray];
  }, [childrenArray]);

  // 禁用/启用动画
  const toggleTransition = useCallback((container: HTMLElement, enable: boolean) => {
    if (enable) {
      requestAnimationFrame(() => {
        container.style.transition = '';
      });
    } else {
      container.style.transition = 'none';
      // 强制重排，确保样式立即生效
      container.getBoundingClientRect();
    }
  }, []);

  // 重置位置并继续翻页
  const resetPositionAndContinue = useCallback((container: HTMLElement, direction: 'prev' | 'next') => {
    // 禁用动画
    toggleTransition(container, false);
    
    // 计算相对位置
    const currentPosition = activeIndex % totalPage;
    
    if (direction === 'next') {
      // 从第二组重置到第一组的相同位置
      setActiveIndex(currentPosition);
      // 启用动画并移动到下一页
      requestAnimationFrame(() => {
        toggleTransition(container, true);
        requestAnimationFrame(() => {
          setActiveIndex(currentPosition + 1);
        });
      });
    } else {
      // 从第一组重置到第二组的相同位置
      setActiveIndex(totalPage + currentPosition);
      // 启用动画并移动到前一页
      requestAnimationFrame(() => {
        toggleTransition(container, true);
        requestAnimationFrame(() => {
          setActiveIndex(totalPage + currentPosition - 1);
        });
      });
    }
  }, [activeIndex, totalPage, toggleTransition]);

  // 处理动画结束
  const handleTransitionEnd = useCallback(() => {
    if (!isAnimating) return;
    setIsAnimating(false);
  }, [isAnimating]);

  // 前后翻页逻辑
  const onPaging = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isAnimating) return;
    
    const container = containerRef.current;
    if (!container) return;

    const target = e.currentTarget;
    const type = target.dataset.type;

    setIsAnimating(true);

    if (type === 'prev') {
      // 在第一组的开头，需要先重置到第二组
      if (activeIndex === 0) {
        resetPositionAndContinue(container, 'prev');
      } else {
        setActiveIndex(activeIndex - 1);
      }
    } else if (type === 'next') {
      // 在第二组的末尾，需要先重置到第一组
      if (activeIndex === totalPage * 2 - 1) {
        resetPositionAndContinue(container, 'next');
      } else {
        setActiveIndex(activeIndex + 1);
      }
    } else {
      const index = parseInt(type || '');
      if (!isNaN(index)) {
        const currentGroup = Math.floor(activeIndex / totalPage);
        setActiveIndex(currentGroup * totalPage + index);
      }
    }
  }, [activeIndex, totalPage, isAnimating, resetPositionAndContinue]);

  // 自动播放逻辑
  useEffect(() => {
    if (!props.autoplay || isPaused || isAnimating) {
      if (autoplayTimerRef.current) {
        window.clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = undefined;
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    autoplayTimerRef.current = window.setInterval(() => {
      // 在第二组的末尾，需要先重置到第一组
      if (activeIndex === totalPage * 2 - 1) {
        resetPositionAndContinue(container, 'next');
      } else {
        setActiveIndex(activeIndex + 1);
      }
    }, props.autoplayInterval || 3000);

    return () => {
      if (autoplayTimerRef.current) {
        window.clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = undefined;
      }
    };
  }, [props.autoplay, props.autoplayInterval, activeIndex, isPaused, isAnimating, totalPage, resetPositionAndContinue]);

  // 鼠标悬停处理
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // 处理轮播元素的偏移(触发动画)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const frameId = requestAnimationFrame(() => {
      const currentPage = activeIndex % totalPage;
      let offset;
      
      if (currentPage === totalPage - 1) {
        // 最后一页：从倒数第 itemCount 个元素开始显示
        offset = (total - itemCount) + (activeIndex >= totalPage ? total : 0);
      } else {
        // 其他页：正常计算偏移量
        offset = (currentPage * itemCount) + (activeIndex >= totalPage ? total : 0);
      }
      
      container.style.setProperty('--kux-carousel-offset', String(offset));
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeIndex, totalPage, itemCount, total]);

  // 处理轮播元素的样式
  const combinedStyle: React.CSSProperties = useMemo(() => ({
    ...props.style,
    '--kux-carousel-item-gap': props.gap ? `${props.gap}px` : 0,
    '--kux-carousel-item-visible': itemCount,
  }), [props.gap, itemCount, props.style]);

  const carouselClasses = useMemo(() => {
    const classes = ['kux-carousel'];
    if (props.className) classes.push(props.className);
    return classes.join(' ');
  }, [props.className]);

  // 计算实际显示的索引（用于指示器）
  const displayIndex = useMemo(() => {
    return activeIndex % totalPage;
  }, [activeIndex, totalPage]);

  return (
    <Stack
      direction='vertical'
      className={carouselClasses}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="kux-carousel-inner">
        <div className="kux-carousel-list">
          <div 
            className='kux-carousel-container' 
            ref={containerRef}
            onTransitionEnd={handleTransitionEnd}
          >
            {doubleItems.map((child, index) => (
              <div
                key={index}
                className={`kux-carousel-item ${index === activeIndex ? 'active' : ''}`}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
        {!props.hideControls && (
          <CarouselControls
            onPaging={onPaging}
            currentIndex={displayIndex}
            total={totalPage}
            disabled={isAnimating}
          />
        )}
      </div>

      {!props.hideIndicators && (
        <CarouselIndicators
          onPaging={onPaging}
          currentIndex={displayIndex}
          total={totalPage}
          disabled={isAnimating}
        />
      )}
    </Stack>
  );
}

interface ICarouselControlsProps {
  onPaging: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentIndex: number;
  total: number;
  disabled?: boolean;
}

function CarouselControls(props: ICarouselControlsProps) {
  return (
    <>
      <button
        onClick={props.onPaging}
        data-type="prev"
        className="kux-carousel-control is-prev"
        aria-label="previous page"
        disabled={props.disabled}
      >
        <ArrowLeftIcon size={20} rtl />
      </button>
      <button
        onClick={props.onPaging}
        data-type="next"
        className="kux-carousel-control is-next"
        aria-label="next page"
        disabled={props.disabled}
      >
        <ArrowRightIcon size={20} rtl />
      </button>
    </>
  );
}

interface ICarouselIndicatorsProps {
  total: number;
  currentIndex: number;
  onPaging: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
}

function CarouselIndicators(props: ICarouselIndicatorsProps) {
  const items = Array.from({ length: props.total }, (_, i) => i);
  return (
    <HStack className="kux-carousel-indicators">
      {items.map((item) => (
        <button
          key={item}
          className={`kux-carousel-indicator ${item === props.currentIndex ? 'active' : ''}`}
          onClick={props.onPaging}
          data-type={item}
          aria-label={`jump to ${item + 1} page`}
          disabled={props.disabled}
        />
      ))}
    </HStack>
  );
}
