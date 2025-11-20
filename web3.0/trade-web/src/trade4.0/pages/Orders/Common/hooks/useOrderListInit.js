/*
 * @Owner: jessie@kupotech.com
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { debounce, filter } from 'lodash';
import { APMCONSTANTS } from 'utils/apm/apmConstants';
import SensorApm from 'utils/apm/index';
import { isDisableCancelOrder } from 'utils/noticeUtils';
import { toBoolean } from 'utils/tools';
import { commonSensorsFunc } from '@/meta/sensors';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';

const plainArr = [];

export const useOrderListInit = ({ namespace, type }) => {
  const dispatch = useDispatch();
  const cancelVisible = useSelector((state) => state[namespace]?.cancelVisible);
  const totalNum = useSelector((state) => state[namespace]?.totalNum);
  const allowCancelAll = useSelector((state) => toBoolean(state[namespace]?.allowCancelAll));
  const maintenanceStatus = useSelector((state) => state.tradeForm.maintenanceStatus);

  // 是否为高级委托
  const isAdvancedOrder = type === 'stop';
  // 禁用全部撤单
  const disabledAllCancel = !isAdvancedOrder && !allowCancelAll;

  let trackSensorInstance = null;
  const sensorsInstance = useSelector((state) => state.collectionSensorsStore.sensorsInstance);
  const collectCancelOrder = () => {
    try {
      if (!trackSensorInstance) {
        trackSensorInstance = new SensorApm({
          eventName: APMCONSTANTS.TRADE_ORDER_CANCEL_ANALYSE,
        });
      }
      if (trackSensorInstance) {
        trackSensorInstance.initSensorApm({
          eventName: APMCONSTANTS.TRADE_ORDER_CANCEL_ANALYSE,
        });
        sensorsInstance[APMCONSTANTS.TRADE_ORDER_CANCEL_ANALYSE] = trackSensorInstance;
        dispatch({
          type: 'collectionSensorsStore/collectDuration',
          payload: sensorsInstance,
        });
      }
    } catch (error) {
      console.error(error, 'SensorApmCollectorError');
    }
  };

  const onCancelAll = useCallback(() => {
    collectCancelOrder();
    dispatch({ type: `${namespace}/cancelAllOrders` });
    // 将轮训获取委托单列表时的重试次数改为4，这个不一定只能4
    if (namespace === 'orderCurrent' || namespace === 'orderStop') {
      dispatch({
        type: `${namespace}/updateTryAgainNum`,
        payload: { tryAgainNum: 4 },
      });
    }
    dispatch({
      type: `${namespace}/update`,
      payload: { cancelVisible: false },
    });
    commonSensorsFunc(['openOrders', 8, 'click']);
  }, [dispatch, namespace]);

  const onCancel = useCallback(
    (value) => {
      collectCancelOrder();
      dispatch({
        type: `${namespace}/cancelSpecifyOrder`,
        payload: {
          order: value,
          isStop: namespace === 'orderStop',
        },
      });
      commonSensorsFunc(['openOrders', 10, 'click'], value?.symbol);
    },
    [dispatch, namespace],
  );

  const isDisableCancel = useMemo(() => {
    return !isAdvancedOrder && isDisableCancelOrder(maintenanceStatus);
  }, [maintenanceStatus, isAdvancedOrder]);

  const hideCancelVisible = useCallback(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: { cancelVisible: false },
    });
  }, []);

  const showCancelVisible = useCallback(() => {
    if (totalNum === 0) {
      return;
    }
    dispatch({ type: `${namespace}/update`, payload: { cancelVisible: true } });
  }, [totalNum]);

  const _onCancelAll = useMemo(() => debounce(onCancelAll, 300), [onCancelAll]);
  const _onCancel = useMemo(() => debounce(onCancel, 300), [onCancel]);

  return {
    onCancelAll: _onCancelAll,
    onCancel: _onCancel,
    cancelVisible,
    isDisableCancel,
    hideCancelVisible,
    showCancelVisible,
    disabledAllCancel,
  };
};

export const useOrderListData = ({ namespace, symbol }) => {
  const dispatch = useDispatch();
  // const filterSymbol = useSelector((state) => state[namespace]?.filters?.symbol);
  const isLogin = useSelector((state) => state.user.isLogin);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const dataSource = useSelector((state) => state[namespace]?.records) || plainArr;
  const dataLoading = useSelector((state) => state.loading.effects[`${namespace}/filter`]);
  const totalNum = useSelector((state) => state[namespace]?.totalNum);
  const isOrderInit = useRef(false);
  useEffect(() => {
    if (isLogin && isSpotTypeSymbol(currentSymbol)) {
      // 优化下，现货类型交易对，在执行
      if (isOrderInit.current) {
        // 因为历史委托和成交明细 没有接推送，所以直接用polling更新数据就好。如果是当前委托和历史委托当 socket建连的时候不会去polling，需要主动调用rest接口
        dispatch({
          type: 'orderCurrent/filter',
          payload: {
            triggerMethod: 'rest',
          },
        });
        dispatch({
          type: 'orderStop/filter',
          payload: {
            triggerMethod: 'rest',
          },
        });
      } else {
        isOrderInit.current = true;
      }
      // 登陆时轮训拉取数据
      dispatch({
        type: `${namespace}/filter@polling`,
        payload: {
          triggerMethod: 'polling',
        },
      });
      return () => {
        dispatch({ type: `${namespace}/filter@polling:cancel` });
      };
    }
  }, [isLogin, namespace, dispatch, currentSymbol]);

  const dataSourceBySymbol = useMemo(() => {
    return filter(dataSource, (item) => item?.symbol === symbol);
  }, [dataSource]);

  return {
    dataLoading,
    dataSource,
    dataSourceBySymbol,
    totalNum,
  };
};

export const useOrderListFilterData = ({ namespace }) => {
  const filters = useSelector((state) => state[namespace]?.filters);

  // 若有新增filter需在此增加判断
  const hasFilter = useMemo(() => {
    if (filters) {
      return !!filters.type || !!filters.side || !!filters.cancelExist;
    }
    return false;
  }, [filters]);

  return {
    hasFilter,
  };
};
