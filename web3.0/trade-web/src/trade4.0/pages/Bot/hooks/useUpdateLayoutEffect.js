/**
 * Owner: mike@kupotech.com
 */
import { useRef, useLayoutEffect } from 'react';

export default (handler, relays) => {
  const isUpdatedRef = useRef(false);

  useLayoutEffect(() => {
    if (isUpdatedRef.current) {
      handler();
    }
    isUpdatedRef.current = true;
  }, relays);
};
