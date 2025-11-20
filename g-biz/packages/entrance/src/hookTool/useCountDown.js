import { useEffect, useRef, useState } from 'react';
import delay from 'lodash/delay';
import noop from 'lodash/noop';

export default function useCountDown(props = { deadline: 0, onBegin: noop, onFinish: noop }) {
  const { deadline, onBegin, onFinish } = props;
  const [countTime, setCountTime] = useState(0);
  const timerRef = useRef(null);

  const startCount = () => {
    const now = new Date().getTime();
    const restCount = Math.floor((deadline - now) / 1000);
    if (restCount >= 1) {
      setCountTime(restCount);
      timerRef.current = delay(() => {
        startCount();
      }, 1000);
    } else {
      setCountTime(0);
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onFinish?.();
    }
  };

  const startCountRef = useRef(startCount);
  startCountRef.current = startCount;
  const onBeginRef = useRef(onBegin);
  onBeginRef.current = onBegin;

  useEffect(() => {
    if (deadline) {
      onBeginRef.current();
      startCountRef.current();
    }
  }, [deadline]);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    },
    [],
  );

  return {
    countTime,
  };
}
