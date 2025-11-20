/**
 * Owner: mike@kupotech.com
 */

import { useRef, useCallback, useEffect } from 'react';
import { countDownSeconds } from 'Bot/config';
import useStateRef from '@/hooks/common/useStateRef';

const maxTriggerTimes = 500;
// 倒计时 定时循环器, 由外部触发
export default (triggerCallbackRef, isActive) => {
  const dataRef = useStateRef({ isActive });
  // 记录刷新次数
  const maxTriggerTimesRef = useRef(0);
  // 定时器
  const startCountDownTickerRef = useRef();
  // 记录callback
  const startCountDownTickerCallbackRef = useRef();
  startCountDownTickerCallbackRef.current = useCallback((...rest) => {
    if (maxTriggerTimesRef.current > maxTriggerTimes || !dataRef.current.isActive) return;
    if (startCountDownTickerRef.current) {
      clearTimeout(startCountDownTickerRef.current);
    }
    startCountDownTickerRef.current = setTimeout(() => {
      triggerCallbackRef.current && triggerCallbackRef.current(...rest);
      maxTriggerTimesRef.current += 1;
    }, countDownSeconds);
  }, []);

  const stopTicker = useCallback(() => {
    startCountDownTickerRef.current && clearTimeout(startCountDownTickerRef.current);
  }, []);

  // 用于记录过去的值，方便判断
  const oldIsActiveRef = useRef(isActive);
  // 状态控制
  useEffect(() => {
    if (!isActive) {
      stopTicker();
    } else {
      // isActive由false => true 需要主动触发一次
      oldIsActiveRef.current === false &&
        isActive === true &&
        startCountDownTickerCallbackRef.current();
    }
    // 设置最新值
    oldIsActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    // 清除定时器
    return () => {
      stopTicker();
    };
  }, []);

  return startCountDownTickerCallbackRef;
};
