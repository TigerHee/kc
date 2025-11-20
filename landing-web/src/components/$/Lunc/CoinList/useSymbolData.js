/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'dva';
import {SYMBOLS} from './config';


const useSymbolData = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!SYMBOLS.length) return;
      const tradingSymbols = SYMBOLS.join(',');
      let _socket = null;
      import('@kc/socket').then(ws => {
        const socket = ws.getInstance();
        _socket = socket;
        socket.subscribe(`/quicksilver/symbol-stats:${tradingSymbols}`);
        socket.topicMessage(`/quicksilver/symbol-stats`, 'quicksilver.symbol.stats')(result => {
          if (Array.isArray(result) && result.length > 0) {
            dispatch({ type: 'lunc/updateSymbolMap', payload: result });
          }
        });
      })
      return () => {
        if (!_socket) return;
        _socket.unsubscribe(`/quicksilver/symbol-stats:${tradingSymbols}`);
        _socket = null;
      };
    },
    [dispatch],
  );
};

export default useSymbolData;
