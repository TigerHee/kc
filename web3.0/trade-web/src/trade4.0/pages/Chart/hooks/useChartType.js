/**
 * Owner: borden@kupotech.com
 */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import { namespace } from '@/pages/Chart/config';
import storage from '@/pages/Chart/utils/index';
import { KLINE_CHARTTYPE } from '@/storageKey/chart';

const { setItem } = storage;

export const useChartType = () => {
  const dispatch = useDispatch();

  const chartType = useSelector((state) => state[namespace].chartType);

  const onChartTypeChange = useCallback((type) => {
    setItem(KLINE_CHARTTYPE, type);
    dispatch({
      type: `${namespace}/update`,
      payload: { chartType: type },
    });
  }, []);

  return {
    chartType,
    onChartTypeChange,
  };
};
