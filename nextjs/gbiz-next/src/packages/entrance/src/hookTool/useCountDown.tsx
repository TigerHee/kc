/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';
import delay from 'lodash-es/delay';
import noop from 'lodash-es/noop';

interface CountDownProps {
  deadline?: number;
  onBegin?: () => void;
  onFinish?: () => void;
}

export default function useCountDown(props: CountDownProps = { deadline: 0, onBegin: noop, onFinish: noop }) {
  const { deadline = 0, onBegin, onFinish } = props;
  const [countTime, setCountTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onFinish?.();
    }
  };

  const startCountRef = useRef<() => void>(startCount);
  startCountRef.current = startCount;
  const onBeginRef = useRef<() => void>(onBegin);
  onBeginRef.current = onBegin;

  useEffect(() => {
    if (deadline) {
      onBeginRef.current?.();
      startCountRef.current();
    }
  }, [deadline]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [],
  );

  return {
    countTime,
  };
}
