/**
 * Owner: clyne@kupotech.com
 */
import { useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { getStore } from 'src/utils/createApp';
import { useTheme } from '@emotion/react';
import { useFuturesSymbols, useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';
import { event } from '@/utils/event';
import { OPEN_ORDER, BIClick, getOpenOrderType } from '@/meta/futuresSensors/list';
// import { trackClick, cancelOrderAnalyse } from 'utils/sensors';
// import { BATCHORDERCANCEL, ORDERCANCEL } from 'sensorsKey/trade';
// import { ALL_DURATION } from 'meta/sensors';
import { filter, isEqual } from 'lodash';
import {
  SYMBOL_FILTER_ENUM,
  futuresPositionNameSpace as namespace,
} from 'src/trade4.0/pages/Orders/FuturesOrders/config';

const prefixTopic = '/contractMarket/userActiveOrder';
const prefixTopicTrialFund = '/trialContractMarket/userActiveOrder';

// ======================================== 体验金2.0新增hooks ========================================

/**
 * 数据类型枚举
 */
export const ACTIVE_ORDER_ENUM = {
  // 体验金活跃订单
  TRIAL_FUND: 'TRIAL_FUND',
  // 自有资金活跃订单
  SELF: 'SELF',
};

/**
 * 条件映射
 */
export const conditionMap = () => {
  return {
    // 体验金
    [ACTIVE_ORDER_ENUM.TRIAL_FUND]: ({ isTrialFunds }) => isTrialFunds,
    // 自有资金
    [ACTIVE_ORDER_ENUM.SELF]: ({ isTrialFunds }) => !isTrialFunds,
  };
};

/**
 * 获取活跃委托列表hooks
 * @param {object} options 参数对象 default: {}
 * @param {string} options.dataType 数据类型 trialFund
 * @param {function} options.condition 过滤函数
 * @returns
 */
export const useGetActiveOrders = ({ dataType, condition } = {}) => {
  const data = useSelector((state) => {
    const ret = state[namespace].activeOrders || [];
    const conditionItem = dataType ? conditionMap()[dataType] : null;
    const filterCondition = condition || conditionItem;
    if (filterCondition) {
      return filter(ret, filterCondition);
    }
    // 啥都不满足返回全部数据
    return ret;
  }, isEqual);
  return data;
};

/**
 * 获取活跃委托列表,
 * @param {object} options 参数对象 default: {}
 * @param {string} options.dataType 数据类型 trialFund
 * @param {function} options.condition 过滤函数
 * @returns
 */
export const getActiveOrders = ({ dataType, condition } = {}) => {
  const ret = getStore().getState()[namespace].activeOrders || [];
  const conditionItem = dataType ? conditionMap()[dataType] : null;
  const filterCondition = condition || conditionItem;
  if (filterCondition) {
    return filter(ret, filterCondition);
  }
  // 啥都不满足返回全部数据
  return ret;
};

const ACTIVE_EVENT_TRIGGER = 'ACTIVE_EVENT_TRIGGER';

/**
 * 活动委托列表初始化
 */
export const useInitActiveOrder = () => {
  const dispatch = useDispatch();
  const isCurrentSymbolOnly = useSelector(
    (state) => state[namespace][SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER],
  );
  const userInfo = useSelector((state) => state.user.user);
  const openContract = useSelector((state) => state.openFutures.openContract);
  useEffect(() => {
    const handle = () => {
      dispatch({
        type: `${namespace}/getActiveOrders`,
      });
    };
    if (userInfo && openContract) {
      handle();
      event.on(ACTIVE_EVENT_TRIGGER, handle);
    }
    return () => event.off(ACTIVE_EVENT_TRIGGER);
  }, [isCurrentSymbolOnly, userInfo, openContract, dispatch]);
};

export const triggerActive = () => {
  event.emit(ACTIVE_EVENT_TRIGGER);
};

/**
 * 活动委托列表数据源
 */
export const useActiveOrderListData = () => {
  const data = useGetActiveOrders();
  const currentSymbol = useGetCurrentSymbol();
  const isCurrentSymbolOnly = useSelector(
    (state) => state[namespace][SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER],
  );
  const dataSource = useMemo(() => {
    if (isCurrentSymbolOnly && data.length) {
      // 过滤体验金资金
      return data.filter((item) => item.symbol === currentSymbol);
    }
    return data;
  }, [currentSymbol, data, isCurrentSymbolOnly]);
  return dataSource;
};

export const useActiveOrderLen = () => {
  const orders = useActiveOrderListData();
  return orders.length;
};

export const useActiveOrderSubscribe = () => {
  useFuturesWorkerSubscribe(prefixTopic, true);
  useFuturesWorkerSubscribe(prefixTopicTrialFund, true);
};

export default (openOrderDetail = () => {}) => {
  const dispatch = useDispatch();
  const cancelAllVisible = useSelector((state) => state[namespace].cancelAllVisible);
  const contractMap = useFuturesSymbols();

  const { currentTheme: theme } = useTheme();

  const setCancelAllVisible = useCallback(
    (value) => {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          cancelAllVisible: value,
        },
      });
    },
    [dispatch],
  );

  const showCancelConfirm = useCallback(() => {
    BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_ALL_CLICK]);
    setCancelAllVisible(true);
  }, [setCancelAllVisible]);

  const hideCancelConfirm = useCallback(() => {
    setCancelAllVisible(false);
  }, [setCancelAllVisible]);

  // const showDetail = useCallback(
  //   (orderId) => {
  //     dispatch({
  //       type: `${namespace}/getOrderDetails`,
  //       payload: { orderId },
  //     });
  //     openOrderDetail();
  //   },
  //   [dispatch, openOrderDetail],
  // );

  const cancelOrder = useCallback(
    (orderId, isTrialFunds, row) => {
      const type = getOpenOrderType(row);
      BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_CLICK], { type });
      dispatch({
        type: `${namespace}/cancel`,
        payload: {
          orderId,
          order: true,
          isTrialFunds,
          sensorType: type,
        },
      });
      // cancelOrderAnalyse.addTimer(ALL_DURATION);
      // trackClick(ORDERCANCEL, {
      //   orderType: 'limit',
      // });
    },
    [dispatch],
  );

  const handleCancelAllOrders = useCallback(() => {
    BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_ALL_CONFIRM]);
    dispatch({
      type: `${namespace}/cancelAllOrders`,
    });
    hideCancelConfirm();
    // cancelOrderAnalyse.addTimer(ALL_DURATION);
  }, [dispatch, hideCancelConfirm]);

  return {
    handleCancelAllOrders,
    cancelOrder,
    // showDetail,
    hideCancelConfirm,
    showCancelConfirm,
    theme,
    cancelAllVisible,
    setCancelAllVisible,
    contractMap,
    contracts: contractMap,
  };
};
