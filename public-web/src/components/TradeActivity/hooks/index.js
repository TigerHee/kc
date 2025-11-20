/**
 * Owner: solar@kupotech.com
 */

import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

export const useVaildSymbol = (symbol) => {
  const records = useSelector((state) => state.market.records, shallowEqual);
  const nowSymbol = useMemo(() => {
    if (records) {
      const nowSymbolInfo = records.find((s) => s?.code === symbol);
      return nowSymbolInfo?.code;
    }
    return '';
  }, [records, symbol]);

  return nowSymbol || 'BTC-USDT';
};
