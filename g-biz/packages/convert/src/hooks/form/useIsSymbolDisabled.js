/*
 * @owner: borden@kupotech.com
 * @desc: 获取当前交易对是否禁用状态
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { checkSymbolIsDisabled } from '../../utils/tools';
import { NAMESPACE, ORDER_TYPE_ENUM } from '../../config';
import { useCurrenciesMap, useFromCurrency, useToCurrency } from './useStoreValue';

export default function useIsSymbolDisabled() {
  const orderType = useSelector((state) => state[NAMESPACE].orderType);
  // 这里不能用useConvertSymbolsMap hook，要用原始的，传给checkSymbolIsDisabled里会根据 orderType 适配
  const convertSymbolsMap = useSelector((state) => state[NAMESPACE].convertSymbolsMap);
  const currenciesMap = useCurrenciesMap();
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const symbol = useMemo(() => {
    // 保证两个币种反转时得到同一个交易对
    return [fromCurrency, toCurrency].sort().join('-');
  }, [fromCurrency, toCurrency]);

  return useMemo(() => {
    return orderType === ORDER_TYPE_ENUM.USDD
      ? false
      : checkSymbolIsDisabled({
          symbol,
          orderType,
          convertSymbolsMap,
        }) ||
          currenciesMap?.[fromCurrency]?.tradeDirection === 'TO' ||
          currenciesMap?.[toCurrency]?.tradeDirection === 'FROM';
  }, [convertSymbolsMap, currenciesMap, fromCurrency, orderType, symbol, toCurrency]);
}
