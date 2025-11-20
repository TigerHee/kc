import React, { useRef, useEffect, useState, ReactNode } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx';

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  delay?: number; // 单位: 秒
  className?: string;
  style?: React.CSSProperties;
}

// 常量配置
const DISTANCE = 50;
const DURATION = 1.3;
const EASING = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'; // power3.out
const THRESHOLD = 0.1;

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  delay = 0,
  className = '',
  distance = DISTANCE,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 设置初始状态
    setIsReady(true);

    // 创建 Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 添加延迟
            setTimeout(() => {
              setIsVisible(true);
            }, delay * 1000);
            // 一次性触发，观察完成后断开连接
            observerRef.current?.disconnect();
          }
        });
      },
      {
        threshold: THRESHOLD,
        rootMargin: '0px',
      }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [delay]);

  // 动画样式
  const animationStyles: React.CSSProperties = {
    willChange: 'transform, opacity',
    transition: `transform ${DURATION}s ${EASING}, opacity ${DURATION}s ${EASING}`,
    transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
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
