/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-20 21:32:58
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-23 21:41:33
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/hooks/useTimeWeightedOrderConfig.js
 * @Description:
 */
import { useSelector } from 'dva';

export default function useTimeWeightedOrderConfig() {
  const timeWeightedOrderConfig = useSelector((state) => state.tradeForm.timeWeightedOrderConfig);
  const pricesUSD = useSelector((state) => state.currency.pricesUSD);

  return { timeWeightedOrderConfig, pricesUSD };
}
