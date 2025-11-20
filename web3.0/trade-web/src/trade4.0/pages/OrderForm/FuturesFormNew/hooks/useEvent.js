/**
 * Owner: garuda@kupotech.com
 * 该 hooks 维护一些公共的  event 事件
 */
import { useCallback, useEffect } from 'react';

import { evtEmitter, toNonExponential } from '../builtinCommon';

const event = evtEmitter.getEvt();

// 监听买卖盘的点击事件
export const useOrderBookClickEvent = (form) => {
  const handleChange = useCallback(
    ({ price, size }) => {
      if (price) {
        form.setFieldsValue({ price: toNonExponential(price) });
      }
      if (size) {
        form.setFieldsValue({ size: toNonExponential(size) });
      }
    },
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    event.on('event/orderBook@click', handleChange);
    return () => {
      event.off('event/orderBook@click', handleChange);
    };
  }, [handleChange]);
};
