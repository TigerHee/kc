/**
 * Owner: Clyne@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch } from 'dva';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';

export const usePullContractDetail = () => {
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  const pullContractDetail = useCallback(() => {
    if (isSpotTypeSymbol(currentSymbol)) {
      return;
    }
    dispatch({
      type: 'futuresMarket/getContractDetail',
      payload: {
        symbol: currentSymbol,
      },
    });
  }, [currentSymbol, dispatch]);
  return { pullContractDetail };
};
