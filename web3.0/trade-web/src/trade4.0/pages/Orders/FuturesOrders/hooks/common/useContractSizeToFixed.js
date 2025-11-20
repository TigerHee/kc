/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import Decimal from 'decimal.js';
import { FUTURES } from '@/meta/const';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';

// 小数点过多时，后端返回值会出现科学计数法 0e-8 需要转换一下
const useContractSizeToFixed = (symbol) => {
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  const tickSizeToFixed = React.useMemo(() => {
    let { tickSize = 1 } = contract || {};
    if (tickSize) {
      tickSize = new Decimal(tickSize).toFixed().valueOf();
    }
    return tickSize;
  }, [contract]);

  const indexPriceTickSizeToFixed = React.useMemo(() => {
    let { indexPriceTickSize = 1 } = contract || {};
    if (indexPriceTickSize) {
      indexPriceTickSize = new Decimal(indexPriceTickSize).toFixed().valueOf();
    }
    return indexPriceTickSize;
  }, [contract]);

  return {
    ...contract,
    tickSize: tickSizeToFixed,
    indexPriceTickSize: indexPriceTickSizeToFixed,
  };
};

export default useContractSizeToFixed;
