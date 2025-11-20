/*
 * @owner: borden@kupotech.com
 */
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { useTradeType, getTradeType } from './common/useTradeType';

export default function useSensorFunc(tradeType) {
  const _tradeType = useTradeType();

  if (!tradeType) {
    tradeType = _tradeType;
  }

  return useMemoizedFn((...rest) => {
    const func = TRADE_TYPES_CONFIG?.[tradeType]?.sensorsFunc;
    if (func) {
      func(...rest);
    }
  });
}

export const sensorFunc = (...rest) => {
  const tradeType = getTradeType();
  const func = TRADE_TYPES_CONFIG?.[tradeType]?.sensorsFunc;
  if (func) {
    func(...rest);
  }
};
