/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useRef, useEffect } from 'react';

// 简单的 raf 实现
const raf = {
  current: null as number | null,
  cancel: (id: number | null) => {
    if (id) {
      cancelAnimationFrame(id);
    }
  },
};

export default function useFrameState<T>(defaultValue: T): [T, (updater: (prev: T) => T) => void] {
  const [value, setValue] = React.useState<T>(defaultValue);
  const frameRef = useRef<number | null>(null);
  const batchRef = useRef<Array<(prev: T) => T>>([]);
  const destroyRef = useRef(false);

  useEffect(() => {
    destroyRef.current = false;
    return () => {
      destroyRef.current = true;
      raf.cancel(frameRef.current);
      frameRef.current = null;
    };
  }, []);

  function setFrameValue(updater: (prev: T) => T) {
    if (destroyRef.current) {
      return;
    }

    if (frameRef.current === null) {
      batchRef.current = [];
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setValue((prevValue) => {
          let current = prevValue;

          batchRef.current.forEach((func) => {
            current = func(current);
          });

          return current;
        });
      });
    }

    batchRef.current.push(updater);
  }

  return [value, setFrameValue];
} 