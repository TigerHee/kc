/**
 * Owner: borden@kupotech.com
 * Desc: 迁移G-BIZ externals/hooks/useRealInteraction.js
 */
import { useDispatch, useSelector } from 'dva';
import { useCallback, useEffect, useRef } from 'react';

// 此hooks通常用于页面初始化的弹窗前置判断，以提高SEO评分
// 用户发生过页面交互（鼠标移动、触屏移动）或页面停留超过指定秒数（默认10秒）。认定为真实用户而非SEO爬虫
const useRealInteraction = (props = {}) => {
  const timer = useRef(null);
  const dispatch = useDispatch();
  const { stayDuration = 10000 } = props;
  const moveCheck = useSelector(state => state.setting.moveCheck);

  const handleMove = useCallback(() => {
    // 页面有交互则把停留时长的检测去掉
    if (timer.current) {
      clearTimeout(timer.current);
    }
    dispatch({
      type: 'setting/update',
      payload: {
        moveCheck: true,
      },
    });
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
  }, [dispatch]);

  // 停留时长检测
  useEffect(() => {
    timer.current = setTimeout(() => {
      // 停留时长的检测则把页面交互检测去掉
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      dispatch({
        type: 'setting/update',
        payload: {
          timeCheck: true,
        },
      });
    }, stayDuration);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [stayDuration, handleMove]);

  // 页面交互检测（鼠标移动、触屏移动）
  useEffect(() => {
    if (!moveCheck) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
      };
    }
  }, [moveCheck, handleMove]);
};

export default useRealInteraction;
