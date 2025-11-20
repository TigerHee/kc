/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useGetUserOpenFutures } from '@/hooks/futures/useGetUserFuturesInfo';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

import { SYMBOL_FILTER_ENUM } from '../config';

const useTradeHistoryInit = (props) => {
  const dispatch = useDispatch();
  const symbolCheck = useSelector(
    (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_TRADE_HISTORY],
  );
  const symbol = useGetCurrentSymbol();
  const openContract = useGetUserOpenFutures();
  const { isLogin } = useLoginDrawer();

  const pullData = useCallback(() => {
    if (isLogin && openContract) {
      dispatch({
        type: 'futures_orders/getFills@polling:restart',
      });
    }
  }, [dispatch, isLogin, openContract]);

  const updateQueryTableParams = useCallback(() => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        firstRequest: true,
        fillsPagination: {},
      },
    });
  }, [dispatch]);

  const cancelPolling = useCallback(() => {
    dispatch({
      type: 'futures_orders/getFills@polling:cancel',
    });
  }, [dispatch]);

  useEffect(() => {
    updateQueryTableParams();
    const isSpotSymbol = isSpotTypeSymbol(symbol);
    // 如果是现货交易对，直接 return
    if (isSpotSymbol) {
      return () => {
        cancelPolling();
      };
    }
    if (symbolCheck) {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          fillsSymbolFilters: {
            symbol,
          },
        },
      });
    } else {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          fillsSymbolFilters: {
            symbol: undefined,
          },
        },
      });
    }
    pullData();
    return () => {
      cancelPolling();
    };
  }, [symbolCheck, pullData, updateQueryTableParams, cancelPolling, symbol, dispatch]);
};

export default useTradeHistoryInit;
