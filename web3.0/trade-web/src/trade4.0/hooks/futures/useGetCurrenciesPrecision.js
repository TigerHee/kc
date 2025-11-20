/**
 * Owner: garuda@kupotech.com
 */

/**
 * 此 hooks 用来取 coins 中的 displayPrecision / shortDisplayPrecision 字段
 * 传递参数 currency 币种
 */
import { useSelector } from 'react-redux';
import { find, get } from 'lodash';
import { getStore } from 'utils/createApp';
import { formatCurrency } from '@/utils/futures/formatCurrency';

export const makeReturnCurrenciesPrecision = ({ currencies, currency }) => {
  const _currency = formatCurrency(currency);

  const currencyObj = find(currencies, (c) => c.currency === _currency);
  const precision = get(currencyObj, 'displayPrecision', 8);
  const shortPrecision = get(currencyObj, 'shortDisplayPrecision', 2);

  return { precision: Number(precision), shortPrecision: Number(shortPrecision) };
};

export const useGetCurrenciesPrecision = (currency) => {
  const currencies = useSelector((state) => state.coins.kumexCoins);

  return makeReturnCurrenciesPrecision({ currencies, currency });
};

// 直接从 store 返回低频率更新对象
export const getCurrenciesPrecision = (currency) => {
  const globalState = getStore().getState();
  const currencies = get(globalState, 'coins.kumexCoins');

  return makeReturnCurrenciesPrecision({ currencies, currency });
};
