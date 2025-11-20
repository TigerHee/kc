/**
 * Owner: garuda@kupotech.com
 */

import { useState, useCallback, useEffect } from 'react';

import { EVENT_NAME, RESULT_CONFIG } from './config';

import { useResetRet } from './useReset';

import { evtEmitter } from '../../builtinCommon';

import { TABS_PROFIT } from '../../config';

import { useCalculatorTabsActive } from '../../hooks/useCalculatorProps';

const event = evtEmitter.getEvt('futures-calculator');
const useCalculatorEvent = () => {
  const { tabsActive } = useCalculatorTabsActive();
  const [resultConfig, setResultConfig] = useState(RESULT_CONFIG[TABS_PROFIT]);
  const [calcValue, setCalcValue] = useState(null);
  // 重制监听
  useResetRet(() => setCalcValue(null));
  useEffect(() => {
    if (tabsActive) {
      setResultConfig(RESULT_CONFIG[tabsActive]);
    }
    return () => {
      setCalcValue(null);
    };
  }, [tabsActive]);

  const handleEventData = useCallback((data) => {
    setCalcValue(data);
  }, []);

  useEffect(() => {
    event.on(EVENT_NAME, handleEventData);
    return () => {
      event.off(EVENT_NAME, handleEventData);
    };
  }, [handleEventData]);

  return {
    resultConfig,
    calcValue,
  };
};

export default useCalculatorEvent;
