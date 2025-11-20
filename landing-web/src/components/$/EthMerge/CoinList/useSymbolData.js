/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'dva';
import fp from 'lodash/fp';


const configReducer = (result, { currencyConfigs }) => {
  currencyConfigs.forEach(({ spotSymbol }) => {
    result.push(spotSymbol);
  });
  return result;
};

const useSymbolData = () => {
  const { marketConfig } = useSelector(state => state.ethMerge.activityConfig || {});
  const dispatch = useDispatch();
  const symbols = useMemo(
    () => {
      return fp.pipe(
        fp.reduce(configReducer, []),
        fp.uniq,
        fp.compact,
      )(marketConfig);
    },
    [marketConfig],
  );
  useEffect(
    () => {
      if (!symbols.length) return;
      const tradingSymbols = symbols.join(',');
      let _socket = null;
      import('@kc/socket').then(ws => {
        const socket = ws.getInstance();
        _socket = socket;
        socket.subscribe(`/quicksilver/symbol-stats:${tradingSymbols}`);
        socket.topicMessage(`/quicksilver/symbol-stats`, 'quicksilver.symbol.stats')(result => {
          if (Array.isArray(result) && result.length > 0) {
            dispatch({ type: 'ethMerge/updateSymbolMap', payload: result });
          }
        });
      })
      return () => {
        if (!_socket) return;
        _socket.unsubscribe(`/quicksilver/symbol-stats:${tradingSymbols}`);
        _socket = null;
      };
    },
    [dispatch, symbols],
  );
};

export default useSymbolData;
