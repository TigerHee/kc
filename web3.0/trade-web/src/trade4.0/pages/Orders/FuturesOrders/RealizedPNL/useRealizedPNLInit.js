/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserOpenFutures } from '@/hooks/futures/useGetUserFuturesInfo';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';

const useRealizedPNLInit = (props) => {
  const dispatch = useDispatch();
  const symbolCheck = useSelector((state) => state.futures_orders.isPnlOnlySymbolCheck);
  const openContract = useGetUserOpenFutures();
  const currentSymbol = useGetCurrentSymbol();
  const { isLogin } = useLoginDrawer();

  useEffect(() => {
    if (openContract && isLogin) {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          closedPositionsPagination: {},
        },
      });
      dispatch({
        type: 'futures_orders/getPrevClosedPositions',
      });
    }
  }, [symbolCheck, dispatch, openContract, currentSymbol, isLogin]);
};

export default useRealizedPNLInit;
