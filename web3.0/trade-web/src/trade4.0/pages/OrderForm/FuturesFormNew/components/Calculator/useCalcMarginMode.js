/**
 * Owner: Clyne@kupotech.com
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { MARGIN_MODE_CROSS } from '../../builtinCommon';

export const useMarginMode = () => {
  return useSelector((state) => state.futuresForm.calcMarginModel);
};

export const useCalcMarginMode = () => {
  const dispatch = useDispatch();

  const onChange = useCallback(
    (v) => {
      dispatch({ type: 'futuresForm/update', payload: { calcMarginModel: v } });
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    onChange(MARGIN_MODE_CROSS);
  }, [onChange]);

  return {
    reset,
    onChange,
  };
};
