/**
 * Owner: clyne@kupotech.com
 */
import { useEffect } from 'react';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';

const prefixTopic = '/contract/instrument';

export default function useWorkerIndexPriceSingleSubscribe(symbol) {
  const topic = `${prefixTopic}:symbol`;
  const isFutures = !isSpotTypeSymbol(symbol);

  useEffect(() => {
    if (isFutures) {
      futuresWorkerSocket.subscribe(topic, false);
      return () => {
        futuresWorkerSocket.unsubscribe(topic, false);
      };
    }
  }, [isFutures, symbol, topic]);
}
