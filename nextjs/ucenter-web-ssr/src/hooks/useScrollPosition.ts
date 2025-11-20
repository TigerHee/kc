import { useEffect, useState } from 'react';

/**
 * 检测页面滚动位置的自定义hook
 * @param threshold 触发显示的滚动阈值（像素）
 * @returns 是否超过阈值
 */
const useScrollPosition = (threshold: number = 1500): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollY >= threshold);
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初始检查
    handleScroll();

    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isVisible;
};

export default useScrollPosition;
