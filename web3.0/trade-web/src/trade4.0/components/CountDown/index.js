/**
 * Owner: Clyne@kupotech.com
 */
import React, { memo, useEffect, useState, useRef } from 'react';
import { CountDownWrapper } from './style';

const hour = 1000 * 60 * 60;
const minute = 60 * 1000;
const second = 1000;

/**
 * 数字补0
 */
const formatZore = (num, notDot) => {
  const numStr = `${num}`;
  if (numStr.length >= 2) {
    return `${numStr}${notDot ? '' : ':'}`;
  } else {
    return `0${numStr}${notDot ? '' : ':'}`;
  }
};

const CountDown = ({ value = 0, onFinish }) => {
  const ticker = useRef('init');
  const [time, setTime] = useState(0);
  const h = Math.floor(time / hour);
  const m = Math.floor((time - h * hour) / minute);
  const s = Math.floor((time - h * hour - m * minute) / second);

  useEffect(() => {
    if (value !== 0 && ticker.current) {
      let timer;
      // 初始状态
      if (ticker.current === 'init') {
        ticker.current = 'running';
        return setTime(value - (value % 1000));
      }
      if (time <= 0) {
        if (ticker.current !== 'init') {
          onFinish();
        }
        ticker.current = 'init';
        clearTimeout(timer);
      } else {
        timer = setTimeout(() => {
          const diff = time - 1000;
          setTime(diff);
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [onFinish, time, ticker, value]);

  return (
    <CountDownWrapper>
      <div className="hour">{formatZore(h)}</div>
      <div className="minute">{formatZore(m)}</div>
      <div className="second">{formatZore(s, true)}</div>
    </CountDownWrapper>
  );
};

export default memo(CountDown);
