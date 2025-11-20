/*
 * @owner: garuda@kupotech.com
 */
import { useEffect, useCallback } from 'react';

import { evtEmitter } from '../../builtinCommon';

const event = evtEmitter.getEvt();
const eventNameForm = 'calcResetForm';
const eventNameRet = 'calcResetRet';
export const useReset = (form) => {
  const handleFormReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    event.on(eventNameForm, handleFormReset);
    return () => event.off(eventNameForm, handleFormReset);
  }, [handleFormReset]);
};

export const useResetRet = (resetFx) => {
  useEffect(() => {
    event.on(eventNameRet, resetFx);
    return () => event.off(eventNameRet, resetFx);
  }, [resetFx]);
};

export const reset = () => {
  event.emit(eventNameForm);
  event.emit(eventNameRet);
};
