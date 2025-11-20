/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import moment from 'moment';

// 对比目标时间和当前时间(utc+8)的差额(target如果为日期格式, 用'/'分割， 如：YYYY/MM/dd hh:mm:ss )
export const contrastTime = ({start, end}) => {
  const result = end - start;
  return result < 0 ? 0 : result;
};

/**
 * 格式化倒计时时间格式
 * @param {} time
 *
 * @returns { d: format(day), h: format(hour), m: format(minute), s: format(second) }
 */
export const formatCountDownTime = time => {
  let result;
  const format = n => (n < 10 ? `0${n}` : n);
  try {
    const tempTime = moment.duration(time);
    const [day, hour, minute, second] = [
      tempTime.days(),
      tempTime.hours(),
      tempTime.minutes(),
      tempTime.seconds(),
    ];
    result = { d: format(day), h: format(hour), m: format(minute), s: format(second) };
  } catch (e) {
    result = { d: format(0), h: format(0), m: format(0), s: format(0) };
  }
  return result;
};

export default ({end, start}) => {
  const timer = useRef(null);
  const [lastTime, setLastTime] = useState();

  const tick = useCallback(
    () => {
      timer.current = setTimeout(() => {
        if (lastTime <= 0) {
          clearTimeout(timer.current);
          timer.current = null;
          setLastTime(0);
        } else {
          const nextLastTime = lastTime - 1000;
          setLastTime(nextLastTime);
        }
      }, 1000);
    },
    [lastTime],
  );

  useEffect(() => {
    if (end) {
      setLastTime(contrastTime({end, start}));
    }
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [end, start]);

  useEffect(
    () => {
      if (lastTime === undefined) {
        return;
      }
      if (lastTime > 0) {
        tick();
      }
    },
    [lastTime],
  );

  return lastTime;
};
