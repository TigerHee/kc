/*
 * @owner: borden@kupotech.com
 */
import { useSelector } from 'dva';

export default function useTradeTypes() {
  return useSelector(state => state.trade.tradeTypes);
}
