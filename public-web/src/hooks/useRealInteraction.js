/**
 * Owner: willen@kupotech.com
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// 此hooks通常用于页面初始化的弹窗前置判断，以提高SEO评分
// 用户发生过页面交互（鼠标移动、触屏移动）且页面停留超过指定秒数（默认10秒）。认定为真实用户而非SEO爬虫
const useRealInteraction = (props = {}) => {
  const { stayDuration = 10000 } = props;
  const timer = useRef(null);
  const [timeCheck, setTimeCheck] = useState(false);
  const [moveCheck, setMoveCheck] = useState(false);

  const handleMove = useCallback(() => {
    // 页面有交互则把停留时长的检测去掉
    timer.current && clearTimeout(timer.current);
    setMoveCheck(true);
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
  }, [timer.current]);

  // 停留时长检测
  useEffect(() => {
    timer.current = setTimeout(() => {
      // 停留时长的检测则把页面交互检测去掉
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      setTimeCheck(true);
    }, stayDuration);
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [stayDuration]);

  // 页面交互检测（鼠标移动、触屏移动）
  useEffect(() => {
    if (!moveCheck) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [moveCheck]);

  return {
    // 满足其一即可
    pass: moveCheck || timeCheck,
    // 满足条件的类型，此字段通用埋点会用
    passType: moveCheck ? 'moveCheck' : timeCheck ? 'timeCheck' : '',
  };
};

export default useRealInteraction;
