import React, { useRef, useEffect, useState, ReactNode } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx';

interface AnimatedContentProps {
  children: ReactNode;
  delay?: number; // 单位: 秒
  className?: string;
  style?: React.CSSProperties;
}

// 常量配置
const DISTANCE = -20;
const DURATION = 0.3;
const EASING = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'; // power3.out
const THRESHOLD = 0.1;

const AnimatedContent: React.FC<AnimatedContentProps> = ({ children, delay = 0, className = '', style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 设置初始状态
    setIsReady(true);

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 清除已有定时器避免冲突
            const timer = setTimeout(() => {
              setIsVisible(true);
            }, delay * 1000);

            // 存储定时器ID用于清理
            timeoutRef.current = timer;
          } else {
            // 元素离开视口时重置状态
            setIsVisible(false);
            // 清除未执行的延迟触发
            clearTimeout(timeoutRef.current);
          }
        });
      },
      { threshold: THRESHOLD }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [delay]);

  // 动画样式
  const animationStyles: React.CSSProperties = {
    willChange: 'transform, opacity',
    transition: `transform ${DURATION + delay}s ${EASING}, opacity ${DURATION + delay}s ${EASING}`,
    transform: isVisible ? 'translateY(0)' : `translateY(${DISTANCE}px)`,
    opacity: isVisible ? 1 : 0,
    ...style,
  };

  return (
    <div
      className={clsx([
        styles.animatedContentBox,
        // 在准备好之前保持隐藏状态，避免 SSR 闪现
        !isReady && styles.hidden,
        className,
      ])}
      ref={ref}
      style={isReady ? animationStyles : style}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
