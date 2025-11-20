/**
 * Owner: clyne@kupotech.com
 */
import { filter } from 'lodash';
import { _t } from 'utils/lang';
import { formatCurrency } from 'src/trade4.0/utils/futures';

export const quantityToText = (contract) => {
  if (!contract) return '-';
  const { multiplier, baseCurrency, quoteCurrency, isInverse } = contract;
  if (isInverse) {
    return `(1 ${_t('global.unit')} = ${Math.abs(multiplier)}${quoteCurrency})`;
  }
  return `(1 ${_t('global.unit')} = ${multiplier}${formatCurrency(baseCurrency)})`;
};

// 返回止盈止损订单
export const getShortcutOrder = ({ stopOrders, symbol, isTrialFunds }) => {
  if (!stopOrders || !stopOrders.length) return [];
  const shortcutOrders = filter(stopOrders, (item) => {
    if (symbol) {
      return item.shortcut && item.symbol === symbol && !!item.isTrialFunds === !!isTrialFunds;
    }
    return item.shortcut;
  });
  return shortcutOrders;
};
