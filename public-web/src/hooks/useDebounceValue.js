/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useState } from 'react';

/**
 * debounce 某个值
 * @param {*} value any
 * @param {number} delay ms
 * @returns debouncedValue
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default useDebounce;
