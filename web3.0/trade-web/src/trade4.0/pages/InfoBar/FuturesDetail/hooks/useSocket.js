/**
 * Owner: Clyne@kupotech.com
 */
import { useEffect } from 'react';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';

const futuresSnapShotTopic = () => {
  return '/contractMarket/snapshot:ALL';
};

// TIPS: 指数价格订阅 功能迁移到 MarkPriceSubscribe 方法中
export const useSocket = () => {
  const currentSymbol = useGetCurrentSymbol();
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  useEffect(() => {
    if (isFutures && currentSymbol) {
      // const topicIndexPrice = futuresIndexPriceTopic(currentSymbol, positionLen);
      const snapTopic = futuresSnapShotTopic();
      // futuresWorkerSocket.subscribe(topicIndexPrice, false);
      futuresWorkerSocket.subscribe(snapTopic, false);
      return () => {
        // futuresWorkerSocket.unsubscribe(topicIndexPrice, false);
        futuresWorkerSocket.unsubscribe(snapTopic, false);
      };
    }
  }, [currentSymbol, isFutures]);
};
