/**
 * Owner: willen@kupotech.com
 * CountDown component - converted to TypeScript with modern patterns
 */
import React, { useEffect, useState } from 'react';

interface CountDownProps {
  totalMS?: number;
  onFetch?: () => void;
}

// 毫秒倒计时组件
let timer: NodeJS.Timeout | null = null;

const CountDown: React.FC<CountDownProps> = ({ totalMS = 15 * 60 * 1000, onFetch = () => {} }) => {
  const [time, setTime] = useState<string>('');

  // 每10ms都会调用一次
  const timeTransition = (maxtime: number) => {
    timer = setInterval(() => {
      if (maxtime >= 10) {
        const hours = Math.floor(maxtime / 1000 / 3600);
        const minutes = Math.floor((maxtime / 1000 / 60) % 60);
        const seconds = Math.floor((maxtime / 1000) % 60);
        const microSec = Math.floor((maxtime % 1000) / 10);
        const hoursStr = hours < 10 ? `0${hours}` : hours.toString();
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
        const secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();
        const microSecStr = microSec < 10 ? `0${microSec}` : microSec.toString();
        setTime(`${hoursStr}:${minutesStr}:${secondsStr}:${microSecStr}`);
        maxtime -= 10;
      } else {
        setTime('00:00:00:00');
        if (timer) {
          clearInterval(timer);
        }
        onFetch();
      }
    }, 10);
  };

  useEffect(() => {
    const hiddenProperty =
      'hidden' in document
        ? 'hidden'
        : 'webkitHidden' in document
          ? 'webkitHidden'
          : 'mozHidden' in document
            ? 'mozHidden'
            : null;

    if (!hiddenProperty) return;

    const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

    // 其他tab切回来时重新拉取倒计时
    const onVisibilityChange = () => {
      if (!(document as any)[hiddenProperty]) {
        onFetch();
      }
    };

    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    timeTransition(totalMS);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
      document.removeEventListener(visibilityChangeEvent, onVisibilityChange);
    };
  }, [totalMS]);

  return <span style={{ fontWeight: 'bold' }}>{time}</span>;
};

export default CountDown;
