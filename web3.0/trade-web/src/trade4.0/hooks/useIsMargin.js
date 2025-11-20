/*
 * @owner: borden@kupotech.com
 */
import { checkIsMargin } from '@/meta/tradeTypes';
import { useTradeType } from './common/useTradeType';

export default function useIsMargin(tradeType) {
  const _tradeType = useTradeType();

  if (!tradeType) {
    tradeType = _tradeType;
  }

  return checkIsMargin(tradeType);
}
