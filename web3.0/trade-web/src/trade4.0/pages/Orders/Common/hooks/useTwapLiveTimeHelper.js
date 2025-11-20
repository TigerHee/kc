/**
 * Owner: harry.lai@kupotech.com
 */
import { useRef, useEffect, useCallback, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useSelector } from 'dva';
import { dividedBy } from 'src/utils/operation';
import { TWAP_PROCESS_STATUS } from '../OrderConfig';
import { convertSecondsToHMS } from '../presenter/time-util';

export const LIVE_TIME_SCENE = {
  orderTwap: 'orderTwap',
  orderTwapHistory: 'orderTwapHistory',
};

const LIVE_FREQUENCY = 1000;
const MS_UNIT = 1000;

export const useTwapLiveTimeHelper = (seconds, status, scene) => {
  const twapFetchTime = useSelector((state) => state.orderTwap.fetchTime);
  const twapHistoryFetchTime = useSelector((state) => state.orderTwapHistory.fetchTime);
  const [currentSeconds, setCurrentSeconds] = useState(seconds);

  const timerRef = useRef(null);

  const timerCallback = useMemoizedFn(() => {
    if (status !== TWAP_PROCESS_STATUS.PENDING) {
      clear();
      return;
    }
    const fetchTime =
      scene === LIVE_TIME_SCENE.orderTwapHistory ? twapHistoryFetchTime : twapFetchTime;
    const calcDiffSeconds = Math.floor(dividedBy(new Date().getTime() - fetchTime)(MS_UNIT));

    setCurrentSeconds(calcDiffSeconds + seconds);
  });

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    timerCallback();
    timerRef.current = setInterval(timerCallback, LIVE_FREQUENCY);
    return clear;
  }, []);

  return {
    currentSeconds,
    formatHMSList: convertSecondsToHMS(currentSeconds).map((i) => `${i}`),
  };
};
