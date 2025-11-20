/**
 * Owner: clyne@kupotech.com
 */
import { useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filter } from 'lodash';
import {
  SYMBOL_FILTER_ENUM,
  futuresPositionNameSpace as namespace,
} from 'src/trade4.0/pages/Orders/FuturesOrders/config';
import { getCurrentSymbol, useGetCurrentSymbol } from '../common/useSymbol';
import { useGetUserOpenFutures } from './useGetUserFuturesInfo';
import useLoginDrawer from '../useLoginDrawer';
import { useTradeType } from '../common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import { isSpotTypeSymbol } from '../common/useIsSpotSymbol';
import { useFuturesWorkerSubscribe } from '../useWorkerSubscribe';
import { event } from '@/utils/event';
import { BIClick, STOP_ORDER, getStopOrderType } from 'src/trade4.0/meta/futuresSensors/list';

// import { BATCHORDERCANCEL, ORDERCANCEL } from 'sensorsKey/trade';
// import { trackClick, cancelOrderAnalyse } from 'utils/sensors';
// import { ALL_DURATION } from 'meta/sensors';

// const emptyArray = [];
const useOrderStop = () => {
  const dispatch = useDispatch();
  const showCancelAllModal = useCallback(() => {
    BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_ALL_CLICK]);
    // trackClick(BATCHORDERCANCEL);
    dispatch({
      type: `${namespace}/update`,
      payload: {
        cancelAllVisibleStop: true,
      },
    });
  }, [dispatch]);

  const cancelOrder = useCallback(
    (orderId, isTrialFunds, row) => {
      const sensorType = getStopOrderType(row);
      BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_CLICK], { type: sensorType });
      dispatch({
        type: `${namespace}/cancel`,
        payload: {
          orderId,
          stop: true,
          isTrialFunds,
          sensorType,
        },
      });
    },
    [dispatch],
  );

  return {
    cancelOrder,
    showCancelAllModal,
  };
};

export const useOrderStopTableData = () => {
  const data = useSelector((state) => state[namespace].stopOrders);
  const currentSymbol = useGetCurrentSymbol();
  const isCurrentSymbolOnly = useSelector(
    (state) => state[namespace][SYMBOL_FILTER_ENUM.FUTURES_STOP_ORDER],
  );

  const dataSource = useMemo(() => {
    let tableDatas = data;
    if (isCurrentSymbolOnly && data.length) {
      tableDatas = filter(data, (item) => item.symbol === currentSymbol);
    }

    return tableDatas;
  }, [data, isCurrentSymbolOnly, currentSymbol]);
  return dataSource;
};

const prefixTopic = '/contractMarket/stopOrder';
const prefixTopicTrialFund = '/trialContractMarket/stopOrder';

const STOP_EVENT_TRIGGER = 'STOP_EVENT_TRIGGER';

export const useInitStopOrders = () => {
  const dispatch = useDispatch();
  const orderStopShowOnlySymbol = useSelector(
    (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_STOP_ORDER],
  );
  const openContract = useGetUserOpenFutures();
  const { isLogin } = useLoginDrawer();
  const auth = useMemo(() => isLogin && openContract, [isLogin, openContract]);
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;

  const getStopOrders = useCallback(() => {
    if (auth && isFutures) {
      dispatch({
        type: 'futures_orders/getStopOrders',
        payload: {
          pageSize: 150, // 订单合并了 size调大点
        },
      });
    }
  }, [dispatch, auth, isFutures]);

  useEffect(() => {
    getStopOrders();
    event.on(STOP_EVENT_TRIGGER, getStopOrders);
    return () => event.off(STOP_EVENT_TRIGGER);
  }, [getStopOrders, orderStopShowOnlySymbol]);

  // 订阅socket
  useFuturesWorkerSubscribe(prefixTopic, true);
  useFuturesWorkerSubscribe(prefixTopicTrialFund, true);
};

export const triggerStop = () => {
  event.emit(STOP_EVENT_TRIGGER);
};

export default useOrderStop;
