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

const useOrderHistoryInit = (props) => {
  const dispatch = useDispatch();
  const symbolCheck = useSelector(
    (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_ORDER_HISTORY],
  );
  const openContract = useGetUserOpenFutures();
  const { isLogin } = useLoginDrawer();
  const symbol = useGetCurrentSymbol();

  const pullData = useCallback(() => {
    if (isLogin && openContract) {
      dispatch({
        type: 'futures_orders/getHistoryOrders@polling:restart',
      });
    }
  }, [dispatch, isLogin, openContract]);

  const updateQueryTableParams = useCallback(() => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        historyOrdersFirstRequest: true,
        historyOrdersPagination: {},
      },
    });
  }, [dispatch]);

  const cancelPolling = useCallback(() => {
    dispatch({
      type: 'futures_orders/getHistoryOrders@polling:cancel',
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
          historySymbolFilters: {
            symbol,
          },
        },
      });
    } else {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          historySymbolFilters: {
            symbol: undefined,
          },
        },
      });
    }
    pullData();
    return () => {
      cancelPolling();
    };
  }, [
    symbolCheck,
    dispatch,
    updateQueryTableParams,
    cancelPolling,
    symbol,
    pullData,
  ]);
};

export default useOrderHistoryInit;
