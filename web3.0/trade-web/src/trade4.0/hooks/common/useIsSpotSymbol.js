/**
 * Owner: Clyne@kupotech.com
 */
import { getCurrentSymbol, useGetCurrentSymbol } from '@/hooks/common/useSymbol';

/**
 * 判断是否为现货杠杠类型的交易对hooks
 */
export const useIsSpotTypeSymbol = (symbol) => {
  const currentSymbol = useGetCurrentSymbol();
  return isSpotTypeSymbol(symbol || currentSymbol);
};

/**
 * 判断是否为现货杠杠类型的交易对
 */
export const isSpotTypeSymbol = (symbol) => {
  const currentSymbol = getCurrentSymbol();
  const arr = (symbol || currentSymbol).split('-');
  if (arr.length > 1) {
    return true;
  } else {
    return false;
  }
};
