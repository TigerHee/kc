/*
 * @owner: borden@kupotech.com
 */
import {
  getCurrentSymbol,
  useGetCurrentSymbol,
} from '@/hooks/common/useSymbol';
import { getCoinInfo, getCurrencyInfo } from '@/hooks/common/useCoin';
import { TRADE_SIDE_MAP } from '../config';

export default function useOrderCurrency({ side, invert }) {
  const currentSymbol = useGetCurrentSymbol();
  const pair = currentSymbol.split('-');
  let { orderCurrencyIndexInPair = 1 } = TRADE_SIDE_MAP[side] || {};
  // invert为true则取反side，返回交易获得的币种
  if (invert) {
    orderCurrencyIndexInPair = ~orderCurrencyIndexInPair + 2;
  }
  const coin = pair[orderCurrencyIndexInPair];

  return getCoinInfo({ coin });
}
/**
 *
 * @param {*} side 默认sell
 * @param {*} symbol 默认当前交易对
 * @returns
 */
export function getOrderCurrency({ symbol, invert, side = 'sell' }) {
  const currentSymbol = symbol || getCurrentSymbol();
  const pair = currentSymbol.split('-');
  let { orderCurrencyIndexInPair = 1 } = TRADE_SIDE_MAP[side] || {};
  // invert为true则取反side，返回交易获得的币种
  if (invert) {
    orderCurrencyIndexInPair = ~orderCurrencyIndexInPair + 2;
  }
  const coin = pair[orderCurrencyIndexInPair];

  return getCurrencyInfo(coin);
}
