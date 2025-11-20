/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, useRef, useCallback, memo } from 'react';
import { isEqual } from 'lodash';

import { evtEmitter } from 'helper';
import { SWITCH_KLINE_SYMBOL_DONE } from '@/meta/chart';

import { useTheme } from '@kux/mui';
import useOrderLine from '@/pages/Chart/hooks/useOrderLine';
import usePrevious from '@/hooks/common/usePrevious';

const event = evtEmitter.getEvt('trade.kline');

export default memo(({ tvWidget, order, onCancel }) => {
  const { side } = order;
  const refData = useRef(order);
  const prevData = usePrevious(order);

  const { createOrderLine, removeOrderLine, updateOrderLineConfig, updateOrderLineData } =
    useOrderLine({ tvWidget });

  const { currentTheme } = useTheme();

  useEffect(() => {
    createOrderLine({ onCancel: onCancel || undefined, data: refData.current });
    return () => {
      removeOrderLine();
    };
  }, [createOrderLine, onCancel, removeOrderLine]);

  useEffect(() => {
    if (!isEqual(prevData, order)) {
      updateOrderLineConfig({ side: order.side, onCancel: onCancel || undefined });
      updateOrderLineData(order);

      refData.current = order;
    }
  }, [side, currentTheme, updateOrderLineConfig, onCancel, prevData, order, updateOrderLineData]);

  const handleCreateLine = useCallback(() => {
    removeOrderLine();
    createOrderLine({ onCancel: onCancel || undefined, data: refData.current });
  }, [createOrderLine, onCancel, removeOrderLine]);

  useEffect(() => {
    event.on(SWITCH_KLINE_SYMBOL_DONE, handleCreateLine);
    return () => {
      event.off(SWITCH_KLINE_SYMBOL_DONE, handleCreateLine);
    };
  }, [handleCreateLine]);

  return null;
});
