/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserOpenFutures } from '@/hooks/futures/useGetUserFuturesInfo';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';
import { FUTURES } from '@/meta/const';
import { useTradeType } from '@/hooks/common/useTradeType';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import { SYMBOL_FILTER_ENUM } from '../config';

const prefixTopic = '/contractMarket/userActiveOrder';
const prefixTopicTrialFund = '/trialContractMarket/userActiveOrder';

const use0penOrdersInit = (props) => {
  const dispatch = useDispatch();
  const openContract = useGetUserOpenFutures();
  const { isLogin } = useLoginDrawer();
  const symbol = useGetCurrentSymbol();
  const tradeType = useTradeType();
  const activeOrderSymbolFilter = useSelector(
    (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER],
  );

  useEffect(() => {
    const isSpotSymbol = isSpotTypeSymbol(symbol);
    if (openContract && isLogin && tradeType === FUTURES && !isSpotSymbol) {
      dispatch({
        type: 'futures_orders/getActiveOrders',
        payload: {
          symbol: activeOrderSymbolFilter ? symbol : undefined,
        },
      });
    }
  }, [dispatch, isLogin, openContract, activeOrderSymbolFilter, symbol, tradeType]);

  const cancelPolling = useCallback(() => {
    // dispatch({
    //   type: 'futures_orders/pullActiveOrders@polling:cancel',
    // });
    // dispatch({
    //   type: 'futures_orders/getPositionList@polling:cancel',
    // });
  }, []);

  const startPolling = useCallback(() => {
    // dispatch({
    //   type: 'futures_orders/pullActiveOrders@polling',
    // });
    // console.log('======start poll');
    // dispatch({
    //   type: 'futures_orders/getPositionList@polling',
    // });
  }, []);

  // 开启保底轮训
  useEffect(() => {
    const isSpotSymbol = isSpotTypeSymbol(symbol);
    if (isSpotSymbol) {
      return () => {
        cancelPolling();
      };
    }
    if (isLogin && openContract && tradeType === FUTURES) {
      startPolling();
      return () => {
        cancelPolling();
      };
    }
  }, [dispatch, openContract, isLogin, tradeType, symbol, cancelPolling, startPolling]);

  useFuturesWorkerSubscribe(prefixTopic, true);
  useFuturesWorkerSubscribe(prefixTopicTrialFund, true);
};

export default use0penOrdersInit;
