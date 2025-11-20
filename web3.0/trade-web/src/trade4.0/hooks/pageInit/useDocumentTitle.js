/*
 * @owner: borden@kupotech.com
 */
import * as ws from '@kc/socket';
import { useRef, useEffect } from 'react';
import usePolling from '@/hooks/usePolling';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import { normalizeNumber } from 'src/helper';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import { useLastPrice } from '../futures/useMarket';
import { useTradeType } from '../common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';

export default function useDocumentTitle() {
  const timerRef = useRef(null);
  const oldTitleRef = useRef(null);

  const currentSymbolInfo = useGetCurrentSymbolInfo();
  // 合约融合
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const { symbolCode, pricePrecision, symbol } = currentSymbolInfo;

  useWorkerSubscribe(getTopic(ws.Topic.MARKET_SNAPSHOT, symbolCode));
  const { startPolling, cancelPolling } = usePolling(
    'marketSnapshot/pull',
    'marketSnapshot/registerPolling',
  );

  const realTimeMarketInfo = marketSnapshotStore.useSelector(
    (state) => state.marketSnapshot[symbolCode],
  );
  // 合约融合
  const { lastTradedPrice: spotLP = 0 } = realTimeMarketInfo || {};
  const futuresLP = useLastPrice(symbol);
  const lastTradedPrice = isFutures ? futuresLP : spotLP;

  useEffect(() => {
    checkTitle();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (
        oldTitleRef.current &&
        ['null', 'undefined'].includes(oldTitleRef.current)
      ) {
        document.title = oldTitleRef.current;
      }
    };
  }, []);

  useEffect(() => {
    if (symbolCode) {
      startPolling({ symbol: symbolCode });
    }
    return () => {
      if (symbolCode) {
        cancelPolling();
      }
    };
  }, [symbolCode]);

  useEffect(() => {
    // set title
    if (!oldTitleRef.current) return;
    const metaOgTitleNode = document.querySelector(
      'meta[property="og:title"]',
    );
    const tdkTitle = metaOgTitleNode?.getAttribute('content');
    if (lastTradedPrice > 0 && tdkTitle) {
      const lastDealPrice = `${normalizeNumber(
        lastTradedPrice,
        pricePrecision || 8,
      )}`;
      // 应SEO组要求，改为TDK返回的title再拼接
      // document.title = [lastDealPrice, symbol, oldTitleRef.current].filter((v) => {
      //   return !!v && indexOf(['null', 'undefined'], v) === -1;
      // }).join(' | ');
      document.title = `${lastDealPrice} | ${tdkTitle}`;
    } else {
      document.title = oldTitleRef.current;
    }
  }, [lastTradedPrice, pricePrecision]);

  const checkTitle = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!document.title) {
      timerRef.current = setTimeout(checkTitle, 500);
    } else {
      oldTitleRef.current = document.title;
    }
  };
}
