/**
 * Owner: garuda@kupotech.com
 * 返回值
 * orderSizeMap { 'ETHUSDTM-SELL': 10 } // 张数
 * orderMarginMap { 'ETHUSDTM-SELL': 10 } // 成本
 * orderSymbolMap { 'ETHUSDTM': 1 } // symbol map
 * isolatedOrderMarginMap { 'ETHUSDTM-SELL': 10 } // 逐仓占用成本
 */
import { getState } from 'helper';

export const makeCalcOrder = () => {
  const { orderSizeMap, orderMarginMap, orderSymbolMap, isolatedOrderMarginMap } = getState(
    (state) => state.futures_calc_data,
  );

  return { orderSizeMap, orderMarginMap, orderSymbolMap, isolatedOrderMarginMap };
};
