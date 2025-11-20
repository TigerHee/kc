/**
 * Owner: mike@kupotech.com
 */
import { useSelector } from 'dva';
import { TRADEMODE_META } from '@/meta/tradeTypes';
import { getStateFromStore } from '@/utils/stateGetter';

export const useTradeMode = () => {
  return useSelector((state) => state.trade.tradeMode);
};

export const getTradeMode = () => {
  return getStateFromStore((state) => state.trade.tradeMode);
};

/**
 * @description: 判断是否是机器人模式
 * @return {*}
 */
export const useIsTradingBot = () => {
  const tradeMode = useSelector((state) => state.trade.tradeMode);
  return tradeMode === TRADEMODE_META.keys.BOTTRADE;
};
