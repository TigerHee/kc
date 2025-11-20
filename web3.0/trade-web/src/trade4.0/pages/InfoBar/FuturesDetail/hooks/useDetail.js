/**
 * Owner: Clyne@kupotech.com
 */
import { useSelector } from 'dva';

export const useDetailData = (key, defaultValue) => {
  return useSelector((state) => {
    return key
      ? state.futuresMarket.currentDetail[key] || defaultValue
      : state.futuresMarket.currentDetail || defaultValue;
  });
};
