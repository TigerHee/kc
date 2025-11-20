/**
 * Owner: terry@kupotech.com
 */
import { useState, useEffect } from 'react';
import { compliantHelper } from '../compliantHelper';

export const useHelperState = () => {
  const [state, updateState] = useState(compliantHelper.getState());
  useEffect(() => {
    if (typeof window === 'undefined' || !window.__COMPLIANCE_EVENT) return;
    return window.__COMPLIANCE_EVENT.on(window.__COMPLIANCE_EVENT.evts.RULE_READY, () => {
      const newState = compliantHelper.getState();
      updateState(newState);
    });
  }, []);
  return state;
};
