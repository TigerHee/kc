/**
 * Owner: garuda@kupotech.com
 * 该 hooks 控制 下单类型的切换（limit/market/stop(limit|market)）
 */
import { useMemo, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { filter } from 'lodash';

import { useGetActiveTab, useGetSetting, useGetYSmall } from './useGetData';

import { _t, evtEmitter } from '../builtinCommon';
import { useSwitchTrialFund } from '../builtinHooks';

import {
  LIMIT,
  MARKET,
  STOP,
  STOP_LIMIT,
  STOP_MARKET,
  STOP_CHECK_KEY,
  ADVANCED_LIMIT,
  HIDDEN_LIMIT,
  TRIAL_FUND_DISABLED,
  STOP_ORDERS,
  ADVANCED_ORDERS,
  ADVANCED_ORDER_TYPE,
  STOP_ORDER_TYPE,
} from '../config';
import { tradeOrderTypeSensors } from '../utils';

const event = evtEmitter.getEvt();

// 常规订单类型
const NORMAL_ORDERS = [
  {
    value: LIMIT,
    label: () => _t('trade.order.limit'),
  },
  {
    value: MARKET,
    label: () => _t('trade.order.market'),
  },
];

// 小宽度下的 type
const SINGLE_TYPES = (advancedOptions = []) => {
  return [
    ...NORMAL_ORDERS,
    advancedOptions?.length
      ? {
          value: STOP,
          label: () => _t('trade.order.stop'),
          titleSelect: advancedOptions,
        }
      : [],
  ];
};

// 大宽度下的 type 会把条件单展开
const PLURAL_TYPES = (advancedOptions = []) => {
  return [...NORMAL_ORDERS, ...advancedOptions];
};

// 获取条件委托的下拉
const getAdvancedOptions = ({ authStopOrder, authAdvancedOrder }) => {
  let baseOptions = [
    {
      value: ADVANCED_LIMIT,
      label: () => _t('advanced.limit'),
      type: ADVANCED_ORDER_TYPE,
    },
    {
      value: STOP_LIMIT,
      label: () => _t('trade.order.stopLimit'),
      type: STOP_ORDER_TYPE,
    },
    {
      value: STOP_MARKET,
      label: () => _t('trade.order.stopMarket'),
      type: STOP_ORDER_TYPE,
    },
    {
      value: HIDDEN_LIMIT,
      label: () => _t('hidden.limit'),
      type: ADVANCED_ORDER_TYPE,
    },
  ];

  if (!authAdvancedOrder) {
    baseOptions = filter(baseOptions, (item) => item.type !== ADVANCED_ORDER_TYPE);
  }
  if (!authStopOrder) {
    baseOptions = filter(baseOptions, (item) => item.type !== STOP_ORDER_TYPE);
  }
  return baseOptions;
};

const useOrderTypesProps = (screen) => {
  const dispatch = useDispatch();

  const { activeTab, stopOrderType, orderType } = useGetActiveTab();
  const isYScreenSM = useGetYSmall();
  const { switchTrialFund } = useSwitchTrialFund();
  const { authAdvancedOrder: advancedOrderStatus, authStopOrder } = useGetSetting();

  // 高级订单权限
  const authAdvancedOrder = useMemo(() => {
    return advancedOrderStatus && !switchTrialFund;
  }, [advancedOrderStatus, switchTrialFund]);

  const isMd = useMemo(() => screen === 'md', [screen]);

  const size = useMemo(() => {
    return isYScreenSM ? 'xxsmall' : 'xsmall';
  }, [isYScreenSM]);

  const stopOptions = useMemo(() => {
    const advancedOptions = getAdvancedOptions({ authAdvancedOrder, authStopOrder });
    // 开启体验金，需要屏蔽的订单类型
    return switchTrialFund
      ? advancedOptions.filter((item) => !TRIAL_FUND_DISABLED.includes(item.value))
      : advancedOptions;
  }, [authAdvancedOrder, authStopOrder, switchTrialFund]);

  // 返回 tabs 配置
  const tabsConfig = useMemo(() => {
    return isMd ? PLURAL_TYPES(stopOptions) : SINGLE_TYPES(stopOptions);
  }, [isMd, stopOptions]);

  useEffect(() => {
    const isEmptyStopOptions = !stopOptions?.length;
    const isStopActiveTab = activeTab === STOP;
    const isStopOptionsActiveTab = STOP_CHECK_KEY.includes(activeTab);
    const isStopOrderType = STOP_ORDERS.includes(stopOrderType);
    const isAdvancedOrderType = ADVANCED_ORDERS.includes(stopOrderType);

    // 条件单整个下拉都为空，则不执行后续逻辑
    if (isEmptyStopOptions) {
      // 并且判断是否当前选中的条件单，如果选中了，需要切换成限价单
      if (isStopActiveTab || isStopOptionsActiveTab) {
        dispatch({
          type: 'futuresForm/update',
          payload: {
            activeTab: LIMIT,
          },
        });
      }
      return;
    }
    // 没有条件单权限，但是tab 位于条件单，跳转到高级限价委托
    if (!authStopOrder && isStopOrderType) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          stopOrderType: ADVANCED_LIMIT,
        },
      });
      // 没有高级限价权限，但是 tab 位于高级限价，跳转到条件单 limit
    } else if (!authAdvancedOrder && isAdvancedOrderType) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          stopOrderType: STOP_LIMIT,
        },
      });
    }
    // 如果是小宽度，并且选中了条件单的子节点，代表从大宽度切成小的，需要更新下
    if (!isMd && isStopOptionsActiveTab) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          activeTab: STOP,
          stopOrderType: activeTab,
        },
      });
    }
    // 如果是宽屏，并且选中了条件单Key，更新成子级选中
    if (isMd && isStopActiveTab) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          activeTab: stopOrderType,
        },
      });
    }
  }, [
    dispatch,
    activeTab,
    isMd,
    stopOrderType,
    authStopOrder,
    orderType,
    authAdvancedOrder,
    stopOptions,
  ]);

  // 切换 tabs
  const onTabsChange = useCallback(
    (e, v) => {
      e.preventDefault();
      e.stopPropagation();
      if (v === activeTab) return;
      dispatch({
        type: 'futuresForm/update',
        payload: {
          activeTab: v,
        },
      });
      // 埋点
      tradeOrderTypeSensors({ type: v });
    },
    [activeTab, dispatch],
  );

  // 选择条件单下拉
  const onTabSelectChange = useCallback(
    (v) => {
      if (v === stopOrderType) return;
      dispatch({
        type: 'futuresForm/update',
        payload: {
          stopOrderType: v,
        },
      });
      // 埋点
      tradeOrderTypeSensors({ type: v });
    },
    [dispatch, stopOrderType],
  );

  // 监听下体验金需要隐藏的 tab
  useEffect(() => {
    if (stopOrderType) {
      let isHidden = TRIAL_FUND_DISABLED.includes(activeTab);
      if (!isHidden && activeTab === STOP) {
        isHidden = TRIAL_FUND_DISABLED.includes(stopOrderType);
      }

      event.emit('futures@watch_tradeForm_hidden', isHidden);
    }
  }, [stopOrderType, activeTab]);

  return {
    activeTab,
    tabSelectValue: stopOrderType,
    tabsConfig,
    orderType,
    onTabsChange,
    onTabSelectChange,
    size,
  };
};

export default useOrderTypesProps;
