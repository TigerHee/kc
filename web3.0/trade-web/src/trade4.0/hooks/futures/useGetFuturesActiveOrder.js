/**
 * Owner: garuda@kupotech.com
 */
import { useSelector } from 'dva';
import { get, filter, isEqual } from 'lodash';
import { getStore } from 'src/utils/createApp';

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
    const ret = state?.futures_orders?.activeOrders || [];
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
 * 获取活跃委托列表
 * @param {object} options 参数对象 default: {}
 * @param {string} options.dataType 数据类型 trialFund
 * @param {function} options.condition 过滤函数
 * @returns
 */
export const getActiveOrders = ({ dataType, condition } = {}) => {
  const ret = getStore().getState().futures_orders.activeOrders || [];
  const conditionItem = dataType ? conditionMap()[dataType] : null;
  const filterCondition = condition || conditionItem;
  if (filterCondition) {
    return filter(ret, filterCondition);
  }
  // 啥都不满足返回全部数据
  return ret;
};
