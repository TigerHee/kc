/**
 * Owner: solar@kupotech.com
 */
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清除上一次的定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
