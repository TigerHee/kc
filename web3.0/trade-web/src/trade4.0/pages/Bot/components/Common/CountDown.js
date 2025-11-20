/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect, useRef } from 'react';
import { nuclearCaclRunTime, getLang } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';

export const useCountDown = ({
  onTicker,
  nextTime,
  type = 'difference',
  onBingGo,
  isOnBingGoOnce = true,
}) => {
  const ticker = useRef(null);
  const onBingGoRef = useRef(0);
  const [span, setSpan] = useState({
    day: 0,
    hour: 0,
    minite: 0,
    sec: 0,
  });
  nextTime = +nextTime;
  const reduce = (nextTim) => {
    if (!nextTim) return 0;
    if (type === 'difference') {
      nextTim -= 1000;
    } else {
      nextTim -= Date.now();
    }
    return nextTim;
  };
  const start = () => {
    if (ticker.current) return;
    let diff = nextTime;
    const doNow = () => {
      diff = reduce(diff);
      if (diff <= 0) {
        clearInterval(ticker.current);
        ticker.current = null;
        setSpan(false);
        // 倒计时结束只抛出一次
        if (isOnBingGoOnce) {
          if (!onBingGoRef.current) {
            onBingGoRef.current = 1;
            onBingGo && onBingGo();
          }
        } else {
          // 倒计时结束多次抛出
          onBingGo && onBingGo();
        }
      } else {
        // 毫秒计算器
        const t = nuclearCaclRunTime(diff);
        setSpan(t);
        onTicker && onTicker(t);
      }
    };
    doNow();
    ticker.current = setInterval(doNow, 1000);
  };

  // 倒计时变化需要重新启动
  useEffect(() => {
    start();
    return () => {
      if (ticker.current) {
        clearInterval(ticker.current);
        ticker.current = null;
      }
    };
  }, [nextTime]);
  useEffect(() => {
    return () => {
      if (ticker.current) {
        clearInterval(ticker.current);
        ticker.current = null;
      }
    };
  }, []);
  return span;
};
/**
 * nextTime 时间差毫秒
 * type : nextTime下次时间；difference时间差
 */

const CountDown = React.memo(
  ({
    onTicker,
    formater,
    nextTime,
    type = 'difference',
    onBingGo,
    isOnBingGoOnce = true,
    binggoText = _t('auto.buying'),
  }) => {
    const span = useCountDown({
      onTicker,
      nextTime,
      type,
      onBingGo,
      isOnBingGoOnce,
    });
    if (!span) return binggoText;
    const day = span.day;
    let { hour, minite, sec } = span;
    hour = `0${hour}`.slice(-2);
    minite = `0${minite}`.slice(-2);
    sec = `0${sec}`.slice(-2);
    const time = `${hour}:${minite}:${sec}`;
    const langFormat =
      getLang() === 'zh_CN' ? `${day}天 ${hour}小时 ${minite}分` : `${day}d ${hour}h ${minite}m`;

    if (formater) {
      return formater({ day, time, hour, minite, sec, langFormat });
    }
    return null;
  },
);

export default CountDown;
