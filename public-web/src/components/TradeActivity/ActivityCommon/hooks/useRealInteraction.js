/**
 * Owner: terry@kupotech.com
 */
import { useCallback, useEffect, useState } from 'react';

// 用户发生过页面交互（滚动屏幕、触屏移动、点击页面）
const useRealInteraction = () => {
  const [moveCheck, setMoveCheck] = useState(false);

  const handleMove = useCallback(() => {
    setMoveCheck(true);
    window.removeEventListener('touchmove', handleMove);
  }, []);


  // 页面交互检测（鼠标移动、触屏移动）
  useEffect(() => {
    if (!moveCheck) {
      window.addEventListener('touchmove', handleMove);
    }

    return () => {
      window.removeEventListener('touchmove', handleMove);
    };
  }, [moveCheck, handleMove]);

  return {
    pass: moveCheck
  };
};

export default useRealInteraction;
