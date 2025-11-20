/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, memo } from 'react';
import { topicName, futuresTopicName } from '@/pages/Chart/config';
import useWorkerSubscribe, {
  getTopic,
  useFuturesWorkerSubscribe,
} from '@/hooks/useWorkerSubscribe';
import { useKlineSocket } from '@/pages/Chart/hooks/useSocket';
// import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { getSymbolTypes } from './utils';
import { getReplaceIndexSymbol } from './Header/PriceSelect/config';

// socket订阅
const SpotSocket = memo((props) => {
  const { symbol, interval } = props;

  const symbolStr = useMemo(() => {
    if (!symbol || !interval) {
      return '';
    }
    return getSymbolTypes({ symbol, interval });
  }, [symbol, interval]);

  useWorkerSubscribe(getTopic(topicName, symbolStr));

  useKlineSocket({
    symbolStr,
    ...props,
  });
  return null;
});

const FuturesSocket = memo((props) => {
  const { symbol, interval } = props;
  // const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  // const { indexSymbol } = contract || {};

  const symbolStr = useMemo(() => {
    if (!symbol || !interval) {
      return '';
    }
    return getSymbolTypes({ symbol: getReplaceIndexSymbol(symbol, true), interval });
  }, [symbol, interval]);

  // const indexSymbolStr = useMemo(() => {
  //   if (!indexSymbol || !interval) {
  //     return '';
  //   }
  //   const _indexSymbol =
  //     indexSymbol.indexOf('.B') === 0 ? indexSymbol.replace('.B', '.K') : indexSymbol;
  //   return getSymbolTypes({ symbol: _indexSymbol, interval });
  // }, [indexSymbol, interval]);

  // console.log('futures subscribe --->', getTopic(futuresTopicName, symbolStr));
  useFuturesWorkerSubscribe(getTopic(futuresTopicName, symbolStr)); // 合约symbol
  // useFuturesWorkerSubscribe(getTopic(futuresTopicName, indexSymbolStr)); // 合约指数symbol
  // useFuturesWorkerSubscribe('/contractMarket/limitCandle:JOEUSDTM_MARKPRICE_4hour');

  useKlineSocket({
    ...props,
    symbolStr,
  });

  // useKlineSocket({
  //   ...props,
  //   symbolStr: indexSymbolStr,
  //   symbol: indexSymbol,
  // });
  return null;
});

const SocketDataWrap = (props) => {
  return props.tradeType === FUTURES ? <FuturesSocket {...props} /> : <SpotSocket {...props} />;
};

export default SocketDataWrap;
