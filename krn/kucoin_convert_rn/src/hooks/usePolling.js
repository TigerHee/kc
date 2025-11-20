/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useEffect, useState, useRef, useCallback} from 'react';
import {MAX_QUOTE_LOOP_COUNT} from 'components/Convert/config';

/**
 * 接口轮巡
 * api - 后端接口
 * loopCounts - 轮巡次数，0 为无限次
 * intervalCounts - 几秒一轮巡
 * onPollingEnd - 轮巡结束
 */
const usePolling = ({
  api,
  loopCounts = MAX_QUOTE_LOOP_COUNT,
  intervalCounts = 5,
  onPollingEnd,
} = {}) => {
  const [countdownCounter, setCountdownCounter] = useState();
  const [loopCounter, setLoopCounter] = useState();
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef();
  const pollingRef = useRef(false);

  /**
   * 倒计时函数
   * @param {*} seconds s
   * @returns Promise
   */
  const countdown = seconds => {
    return new Promise(resolve => {
      let counter = seconds;
      setCountdownCounter(counter);
      // console.log(counter);
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        counter--;
        setCountdownCounter(counter);
        // console.log(counter);

        if (counter <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          resolve();
        }
      }, 1000);
    });
  };

  /**
   * 取消轮巡
   */
  const cancelPolling = useCallback(() => {
    pollingRef.current = false;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCountdownCounter();
    setLoopCounter();
  }, []);

  /**
   * 定时任务函数
   * 启动之前先取消
   */
  const startPolling = useCallback(
    async params => {
      cancelPolling();

      pollingRef.current = true;

      let count = 0;
      let status = '';
      setLoopCounter(count);

      while ((count < loopCounts || !loopCounts) && pollingRef.current) {
        try {
          setLoading(true);
          // console.log('---- Ray loopCount ----', count);
          await api(params);
          setLoading(false);

          await countdown(intervalCounts);

          count++;
          setLoopCounter(count);
        } catch (error) {
          console.log('请求失败，终止轮询', error);
          status = 'ERROR';
          break;
        }
      }

      // console.log('轮询结束');
      // console.log('---- Ray loopEndCount ----', count);

      cancelPolling();
      onPollingEnd && onPollingEnd(status);
    },
    [api, cancelPolling, intervalCounts, loopCounts, onPollingEnd],
  );

  useEffect(() => {
    return () => cancelPolling();
  }, [cancelPolling]);

  return {
    countdownCounter,
    loopCounter,
    loading,
    startPolling,
    cancelPolling,
    isPolling: pollingRef.current,
  };
};

export default usePolling;
