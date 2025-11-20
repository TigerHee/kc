/**
 * Owner: Lena@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';

const UseCountdown = (seconds = 30) => {
  const [second, setSecond] = useState(seconds);
  const [reset, setReset] = useState(false);

  const timerRef = useRef(null);
  const clearTimerRef = () => {
    timerRef.current && clearInterval(timerRef.current);
  };
  useEffect(() => {
    clearTimerRef();
    if (reset) {
      setSecond(seconds);
      setReset(false);
    }
    timerRef.current = setInterval(() => {
      if (+second > 0) {
        setSecond((val) => val - 1);
      }
    }, 1000);
    return () => {
      clearTimerRef();
    };
  }, [reset]);

  useEffect(() => {
    if (second === 0) {
      clearTimerRef();
    }
  }, [second]);
  return [second, setSecond, clearTimerRef, setReset];
};
export default UseCountdown;
