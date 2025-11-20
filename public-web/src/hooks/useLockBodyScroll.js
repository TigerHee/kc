/*
 * @Date: 2024-06-26 16:22:28
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 18:06:18
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import { useEffect, useRef } from 'react';

const useLockBodyScroll = (isOpen) => {
  const originalStyleRef = useRef({
    overflow: '',
  });

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const positionStyle = window.getComputedStyle(document.body).position;
    if (isOpen) {
      originalStyleRef.current = {
        overflow: originalStyle,
        position: positionStyle,
      };

      setTimeout(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'relative';
      }, 0);
    } else {
      const { position } = originalStyleRef.current;
      document.body.style.overflow = '';
      document.body.style.position = position;
    }

    return () => {
      const { position } = originalStyleRef.current;
      document.body.style.overflow = '';
      document.body.style.position = position;
    };
  }, [isOpen]);
};

export default useLockBodyScroll;
