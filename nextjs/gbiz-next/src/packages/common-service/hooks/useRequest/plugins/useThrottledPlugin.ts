/*
 * @owner: borden@kupotech.com
 */
import { throttle } from 'lodash-es';

import { useEffect, useRef } from 'react';

const useThrottlePlugin = (
  fetchInstance: any,
  { throttleWait, throttleLeading, throttleTrailing }: any
): any => {
  const options: any = {};

  const throttledRef: any = useRef(null);

  if (throttleLeading !== undefined) {
    options.leading = throttleLeading;
  }

  if (throttleTrailing !== undefined) {
    options.trailing = throttleTrailing;
  }

  useEffect(() => {
    if (throttleWait) {
      const _originRunAsync: any = fetchInstance.runAsync.bind(fetchInstance);

      throttledRef.current = throttle(
        (callback: any) => {
          callback();
        },
        throttleWait,
        options
      );

      fetchInstance.runAsync = (...args: any) => {
        return new Promise((resolve: any, reject: any) => {
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
