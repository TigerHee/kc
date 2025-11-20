/**
 * Owner: clyne@kupotech.com
 */
import { useSelector } from 'react-redux';
import { xbtUnitObj } from '@/pages/Orders/FuturesOrders/config';
import { formatCurrency } from '@/utils/futures';

export default function useBTCUnitObject(settleCurrency) {
  const currency = useSelector((state) => state.futures_orders.currency);

  const settleCurrencyIsBtc = formatCurrency(settleCurrency) === 'BTC';

  return { settleCurrencyIsBtc, ...xbtUnitObj[currency] };
}
