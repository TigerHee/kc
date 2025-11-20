/**
 * Owner: clyne@kupotech.com
 */
import { filter, isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { CROSS, namespace } from '../../pages/Orders/FuturesOrders/NewPosition/config';
import { getStore } from 'src/utils/createApp';
import { getCurrentSymbol } from '../common/useSymbol';
import { SYMBOL_FILTER_ENUM } from 'src/trade4.0/pages/Orders/FuturesOrders/config';

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
    const ret = state[namespace]?.positions || [];
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
  const ret = getStore().getState()[namespace].positions || [];
  const conditionItem = dataType ? conditionMap()[dataType] : null;
  const filterCondition = condition || conditionItem;
  if (filterCondition) {
    return filter(ret, filterCondition);
  }
  // 啥都不满足返回全部数据
  return ret;
};

/**
 * 获取追加保证金需要的detail数据hooks
 */
export const useGetAppendMarginDetail = () => {
  return useSelector((state) => state[namespace]?.appendMarginDetail || {}, isEqual);
};

/**
 * 获取追加保证金需要的detail数据
 */
export const getAppendMarginDetail = () => {
  return getStore().getState()[namespace].appendMarginDetail || {};
};

/**
 * 获取是否为乱斗仓位hooks
 */
export const useIsBattlePosition = ({ symbol, isTrialFunds, marginMode }) => {
  const isCross = marginMode === CROSS;
  const battleInProgress = useSelector((state) => state[namespace]?.battleInProgress);
  return !isCross && battleInProgress && symbol === 'XBTUSDTM' && !isTrialFunds;
};

export const useGetPosTableData = () => {
  const isCurrentSymbolOnly = useSelector(
    (state) => state.fund[SYMBOL_FILTER_ENUM.FUTURES_POSITION],
  );
  console.log('====pos isCurrentSymbolOnly', isCurrentSymbolOnly);
  const openPositions = useGetPosition({
    condition: (p) => {
      if (isCurrentSymbolOnly) {
        const currentSymbol = getCurrentSymbol();
        // 过滤体验金资金
        return p.isOpen && p.symbol === currentSymbol;
      }
      // 过滤体验金资金
      return p.isOpen;
    },
  });

  return openPositions;
};
