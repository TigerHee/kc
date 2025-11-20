/**
 * Owner: judith@kupotech.com
 */
import React, { useCallback, useEffect, useRef } from 'react';
import storage from 'utils/storage';

const useClickCount = (ref, key = 'commonClickCount') => {
  const getCount = useCallback(() => {
    const storageItem = storage.getItem(key);
    if (storageItem) {
      return +storageItem;
    } else {
      return 0;
    }
  }, []);

  const setCount = useCallback(() => {
    const count = getCount() + 1;
    storage.setItem(key, count);
    currentCount.current = count;
  }, [getCount]);

  const latestCount = getCount();
  const currentCount = useRef(latestCount);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener('click', setCount);
    }
    return () => {
      if (ref && ref.current) {
        ref.current.removeEventListener('click', setCount);
      }
    };
  }, []);

  return currentCount.current;
};

export default useClickCount;
