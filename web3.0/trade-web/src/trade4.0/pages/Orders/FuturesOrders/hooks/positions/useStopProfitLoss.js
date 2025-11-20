/**
 * Owner: clyne@kupotech.com
 */
import { useSelector } from 'react-redux';
import { isEqual, filter } from 'lodash';

import { futuresPositionNameSpace } from '../../config';
import { getShortcutOrder } from '../../util';

const useStopProfitLoss = ({ symbol, currentQty, isTrialFunds } = {}) => {
  const stopOrders = useSelector((state) => state[futuresPositionNameSpace].stopOrders, isEqual);

  const shortcutStopOrders = getShortcutOrder({
    stopOrders,
    symbol,
    isTrialFunds,
  });
  // 做空止盈stop为'down'做多止盈stop为'up'
  const isShort = currentQty < 0;
  const stopProfit = shortcutStopOrders.find((stopOrder) => {
    const _isTrial = !!stopOrder.isTrialFunds === !!isTrialFunds;
    return _isTrial && (isShort ? stopOrder.stop === 'down' : stopOrder.stop === 'up');
  });
  // 做空止损stop为'up'做多止损为'down'
  const stopLoss = shortcutStopOrders.find((stopOrder) => {
    const _isTrial = !!stopOrder.isTrialFunds === !!isTrialFunds;
    return _isTrial && (isShort ? stopOrder.stop === 'up' : stopOrder.stop === 'down');
  });
  return { stopProfit, stopLoss };
};

export default useStopProfitLoss;
