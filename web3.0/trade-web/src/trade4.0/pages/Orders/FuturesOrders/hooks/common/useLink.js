/**
 * Owner: clyne@kupotech.com
 */
import { useDispatch } from 'dva';
import { useCallback } from 'react';
import { getCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { FUTURES } from 'src/trade4.0/meta/const';

export const useLink = ({ symbol }) => {
  const dispatch = useDispatch();
  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentSymbol = getCurrentSymbol();
      if (symbol === currentSymbol) {
        return;
      }
      dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: {
          symbol,
          toTradeType: FUTURES,
        },
      });
    },
    [dispatch, symbol],
  );

  return { onClick };
};
