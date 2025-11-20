/*
 * @owner: borden@kupotech.com
 */
import throttle from 'lodash/throttle';
import { useEffect, useRef } from 'react';

const useThrottlePlugin = (fetchInstance, { throttleWait, throttleLeading, throttleTrailing }) => {
  const options = {};
  const throttledRef = useRef();

  if (throttleLeading !== undefined) {
    options.leading = throttleLeading;
  }

  if (throttleTrailing !== undefined) {
    options.trailing = throttleTrailing;
  }

  useEffect(() => {
    if (throttleWait) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

      throttledRef.current = throttle(
        (callback) => {
          callback();
        },
        throttleWait,
        options,
      );

      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          throttledRef.current?.(() => {
            _originRunAsync(...args)
              .then(resolve)

              .catch(reject);
          });
        });
      };

      return () => {
        fetchInstance.runAsync = _originRunAsync;
        throttledRef.current?.cancel();
      };
    }
  }, [throttleWait, throttleLeading, throttleTrailing]);

  if (!throttleWait) {
    return {};
  }

  return {
    onCancel: () => {
      throttledRef.current?.cancel();
    },
  };
};

export default useThrottlePlugin;
