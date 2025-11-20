/*
 * @owner: borden@kupotech.com
 */
import { useRef } from 'react';

const useRetryPlugin = (fetchInstance: any, { retryInterval, retryCount }: any): any => {
  const timerRef = useRef<any>(null);
  const countRef = useRef<any>(0);

  const triggerByRetry = useRef<any>(false);

  if (!retryCount) {
    return {};
  }

  return {
    onBefore: (): void => {
      if (!triggerByRetry.current) {
        countRef.current = 0;
      }

      triggerByRetry.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },

    onSuccess: (): void => {
      countRef.current = 0;
    },

    onError: (): void => {
      countRef.current += 1;

      if (retryCount === -1 || countRef.current <= retryCount) {
        const timeout = retryInterval ?? Math.min(1000 * 3 ** countRef.current, 30000);

        timerRef.current = setTimeout(() => {
          triggerByRetry.current = true;

          fetchInstance.refresh();
        }, timeout);
      } else {
        countRef.current = 0;
      }
    },

    onCancel: (): void => {
      countRef.current = 0;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
  };
};

export default useRetryPlugin;
