/**
 * Owner: charles.yang@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { getStore } from 'src/utils/createApp';
import { get, filter, isEqual } from 'lodash';

/**
 * 数据类型枚举
 */
export const POSITION_ENUM = {
  // 体验金仓位
  TRIAL_FUND: 'TRIAL_FUND',
  // 自有资金仓位
  SELF: 'SELF',
};

/**
 * 条件映射
 */
export const conditionMap = () => {
  return {
    // 体验金
    [POSITION_ENUM.TRIAL_FUND]: ({ isTrialFunds }) => isTrialFunds,
    // 自有资金
    [POSITION_ENUM.SELF]: ({ isTrialFunds }) => !isTrialFunds,
  };
};

/**
 * 获取仓位列表hooks
 * @param {object} options 参数对象 default: {}
 * @param {string} options.dataType 数据类型 trialFund
 * @param {function} options.condition 仓位过滤函数
 * @returns
 */
export const useGetPosition = ({ dataType, condition } = {}) => {
  const data = useSelector((state) => {
    const ret = state?.futures_orders?.positions || [];
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
 * 获取仓位列表
 * @param {object} options 参数对象 default: {}
 * @param {string} options.dataType 数据类型 trialFund
 * @param {function} options.condition 仓位过滤函数
 * @returns
 */
export const getPosition = ({ dataType, condition } = {}) => {
  const ret = getStore().getState()?.futures_orders?.positions || [];
  const conditionItem = dataType ? conditionMap()[dataType] : null;
  const filterCondition = condition || conditionItem;
  if (filterCondition) {
    return filter(ret, filterCondition);
  }
  // 啥都不满足返回全部数据
  return ret;
};

// 获取所有仓位的数据
export const useGetAllPositionsData = () => {
  const positions = useSelector((state) => state.futures_orders.positions);
  const openPositions = useMemo(
    () =>
      filter(positions, (p) => {
        return p.isOpen;
      }),
    [positions],
  );
  return openPositions;
};

const emptyObject = {};
// 获取所有指定symbol仓位的数据
export const useGetSymbolPositionsData = ({ symbol, isTrialFunds }) => {
  const openPositions = useGetAllPositionsData();
  const currentSymbolPosition = openPositions.find(
    (item) => item.symbol === symbol && !!item.isTrialFunds === !!isTrialFunds,
  );

  return currentSymbolPosition || emptyObject;
};

// 获取所有活动委托的数据
export const useGetAllOpenOrdersData = () => {
  const activeOrders = useSelector((state) => state.futures_orders.activeOrders);
  return activeOrders;
};
// 获取所有指定symbol活动委托的数据
export const useGetSymbolOpenOrdersData = ({ symbol }) => {
  const activeOrders = useSelector((state) => state.futures_orders.activeOrders);
  return filter(activeOrders, (item) => item.symbol === symbol);
};
// 获取所有条件委托的数据
export const useGetAllAdvancedOrdersData = () => {
  const stopOrders = useSelector((state) => state.futures_orders.stopOrders);
  return stopOrders;
};
// 获取所有指定symbol条件委托的数据
export const useGetSymbolAdvancedOrdersData = ({ symbol }) => {
  const stopOrders = useSelector((state) => state.futures_orders.stopOrders);
  return filter(stopOrders, (item) => item.symbol === symbol) || [];
};

/**
 * 获取追加保证金需要的detail数据hooks
 */
export const useGetAppendMarginDetail = () => {
  return useSelector((state) => state?.futures_orders?.appendMarginDetail || emptyObject, isEqual);
};

/**
 * 获取追加保证金需要的detail数据
 */
export const getAppendMarginDetail = () => {
  return getStore().getState().futures_orders.appendMarginDetail || emptyObject;
};

// 获取所有仓位的数据
export const getAllPositionsData = () => {
  const globalState = getStore().getState();
  const positions = get(globalState, 'futures_orders.positions');
  const openPositions = filter(positions, (p) => {
    return p.isOpen;
  });
  return openPositions;
};

// 获取所有指定symbol仓位的数据
export const getSymbolPositionsData = ({ symbol }) => {
  const openPositions = getAllPositionsData();
  const currentSymbolPosition = openPositions.find((item) => item.symbol === symbol);

  return currentSymbolPosition || {};
};

// 获取所有活动委托的数据
export const getAllOpenOrdersData = () => {
  const globalState = getStore().getState();
  const activeOrders = get(globalState, 'futures_orders.activeOrders');
  return activeOrders;
};
// 获取所有指定symbol活动委托的数据
export const getSymbolOpenOrdersData = ({ symbol }) => {
  const activeOrders = getAllOpenOrdersData();
  return filter(activeOrders, (item) => item.symbol === symbol);
};
// 获取所有条件委托的数据
export const getAllAdvancedOrdersData = () => {
  const globalState = getStore().getState();
  const stopOrders = get(globalState, 'futures_orders.stopOrders');
  return stopOrders;
};
// 获取所有指定symbol条件委托的数据
export const getSymbolAdvancedOrdersData = ({ symbol }) => {
  const stopOrders = getAllAdvancedOrdersData();
  return filter(stopOrders, (item) => item.symbol === symbol);
};
