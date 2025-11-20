/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, useRef, useCallback, memo } from 'react';
import { isEqual } from 'lodash';

import { evtEmitter } from 'helper';

import { useTheme } from '@kux/mui';
import usePositionLine from '@/pages/Chart/hooks/usePositionLine';
import usePrevious from '@/hooks/common/usePrevious';
import { SWITCH_KLINE_SYMBOL_DONE } from '@/meta/chart';

const event = evtEmitter.getEvt('trade.kline');

export default memo(({ tvWidget, position }) => {
  const refData = useRef(position);
  const prevData = usePrevious(position);

  const { createOPositionLine, removePositionLine, updatePositionLine } = usePositionLine({
    tvWidget,
  });

  const { currentTheme } = useTheme();

  useEffect(() => {
    createOPositionLine({ data: refData.current });
    return () => {
      removePositionLine();
    };
  }, [createOPositionLine, removePositionLine]);

  useEffect(() => {
    if (!isEqual(prevData, position)) {
      updatePositionLine(position);
      refData.current = position;
    }
  }, [position, updatePositionLine, currentTheme, prevData]);

  const handleCreateLine = useCallback(() => {
    removePositionLine();
    createOPositionLine({ data: refData.current });
  }, [createOPositionLine, removePositionLine]);

  useEffect(() => {
    event.on(SWITCH_KLINE_SYMBOL_DONE, handleCreateLine);
    return () => {
      event.off(SWITCH_KLINE_SYMBOL_DONE, handleCreateLine);
    };
  }, [handleCreateLine]);

  return null;
});
