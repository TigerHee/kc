/*
 * @owner: odan.ou@kupotech.com
 */

import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { namespace as ChartNamespace } from '@/pages/Chart/config';
import { namespace as OrderbookNamespace } from '@/pages/Orderbook/config';
import { useSelector } from 'dva';

const useLastPrice = () => {
  const currentSymbol = useGetCurrentSymbol();

  // 买卖盘中间的最新成交价
  const lastPriceVal2 = useSelector(
    (state) => state[OrderbookNamespace]?.lastPrice,
  );

  // K线币对最新成交价
  const lastPriceVal1 = useSelector((state) => {
    return (
      lastPriceVal2 ||
      state[ChartNamespace]?.kLineTabsMarketMap?.[currentSymbol]
        ?.lastTradedPrice
    );
  });
  // 行情最新成交价
  const lastTradedPrice0 = marketSnapshotStore.useSelector((state) => {
    return (
      lastPriceVal1 || state?.marketSnapshot?.[currentSymbol]?.lastTradedPrice
    );
  });
  return lastTradedPrice0;
};

export default useLastPrice;
