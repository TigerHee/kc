/*
 * @owner: harry@kupotech.com
 */
import { useEffect } from 'react';

/**hack: public-web h5 场景 rerender会清空 body style导致滚动穿透 此处增强处理穿透 */
export const useEnhanceOnboardLockBodyScroll = (step) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [step]);
};
