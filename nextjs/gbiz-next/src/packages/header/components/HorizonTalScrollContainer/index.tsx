import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import clsx from 'clsx';
import useLang from 'hooks/useLang';
import { useResponsive } from '@kux/design';
import { ArrowRightIcon, ArrowLeftIcon } from '@kux/iconpack';
import styles from './styles.module.scss';

interface HorizontalScrollContainerProps {
  children: ReactNode;
  scrollStep?: number;
  scrollDisable?: boolean;
  [key: string]: any;
}

const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  scrollStep = 160,
  scrollDisable = false,
  className,
  ...domProps
}) => {
  const { isRTL } = useLang();
  const rv = useResponsive();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // 上次的左右箭头可见性（用于仅在变化时 setState）
  const lastLeftVisibleRef = useRef<boolean>(false);
  const lastRightVisibleRef = useRef<boolean>(false);
  const scrollerRef = useRef<HTMLElement | null>(null);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    if (!hasOverflow) {
      if (lastLeftVisibleRef.current || lastRightVisibleRef.current) {
        lastLeftVisibleRef.current = false;
        lastRightVisibleRef.current = false;
        setShowLeftArrow(false);
        setShowRightArrow(false);
      }
      return;
    }

    const dirMultiplier = isRTL ? -1 : 1;
    const normalizedLeft = el.scrollLeft * dirMultiplier;
    const maxLeft = el.scrollWidth - el.clientWidth;

    const atStart = normalizedLeft <= 1;
    const atEnd = normalizedLeft >= maxLeft - 1;

    const nextLeftVisible = !atStart;
    const nextRightVisible = !atEnd;

    if (nextLeftVisible !== lastLeftVisibleRef.current) {
      lastLeftVisibleRef.current = nextLeftVisible;
      setShowLeftArrow(nextLeftVisible);
    }
    if (nextRightVisible !== lastRightVisibleRef.current) {
      lastRightVisibleRef.current = nextRightVisible;
      setShowRightArrow(nextRightVisible);
    }
  }, [isRTL]);

  const scrollContainer = useCallback(
    (direction: 'left' | 'right') => {
      const el = scrollerRef.current;
      if (!el) return;
      const step = direction === 'right' ? scrollStep : -scrollStep;
      const delta = isRTL ? -step : step;
      try {
        el.scrollBy({ left: delta, behavior: 'smooth' });
      } catch (_) {
        // 浏览器不支持 smooth 时的兜底
        el.scrollLeft += delta;
      }
      // 轻微延时后刷新箭头状态，避免边界抖动
      window.requestAnimationFrame(updateArrows);
    },
    [isRTL, scrollStep, updateArrows]
  );

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  useEffect(() => {
    const id = window.requestAnimationFrame(updateArrows);
    return () => window.cancelAnimationFrame(id);
  }, [children, updateArrows]);

  return (
    <div className={clsx(styles.scrollWrapper, scrollDisable && styles.disableScroll, className)} {...domProps}>
      {showLeftArrow && (
        <div className={clsx([styles.scrollButton, styles.flexStart])} onClick={() => scrollContainer('left')}>
          <div className={clsx([styles.iconBox])}>
            <ArrowLeftIcon className={styles.arrowIcon} size={rv === 'sm' ? 16 : 20} color="var(--kux-text)" />
          </div>
          <div className={clsx([styles.opacityPlaceholder, styles.left])} />
        </div>
      )}

      <nav className={styles.scrollInner} ref={scrollerRef}>
        {children}
      </nav>

      {showRightArrow && (
        <div className={clsx(styles.scrollButton, styles.flexEnd)} onClick={() => scrollContainer('right')}>
          <div className={clsx([styles.opacityPlaceholder, styles.right])} />
          <div className={styles.iconBox}>
            <ArrowRightIcon className={styles.arrowIcon} size={rv === 'sm' ? 16 : 20} color="var(--kux-text)" />
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollContainer;
