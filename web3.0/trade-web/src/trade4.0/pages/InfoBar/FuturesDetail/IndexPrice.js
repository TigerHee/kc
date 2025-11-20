/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import TextTips from './TextTips';
import { Link } from 'src/components/Router';
import { _t } from 'src/utils/lang';
import { useIndexPrice } from 'src/trade4.0/hooks/futures/useMarket';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import AmountPrecision from './AmountPrecision';
import { getDigit } from 'src/helper';

const MarkPrice = () => {
  const { symbol, indexPriceTickSize } = useGetCurrentSymbolInfo();
  const indexPrice = useIndexPrice(symbol);
  const tips = (
    <div>
      {_t('trade.tooltip.indexPrice1')}
      <Link target="_blank" to={`/futures/contract/index/${symbol}`}>
        {_t('trade.tooltip.indexPrice2')}
      </Link>
    </div>
  );
  return (
    <TextTips
      tips={tips}
      header={_t('trade.order.indexPrice')}
      value={
        <AmountPrecision
          pointed
          value={indexPrice}
          fixed={getDigit(indexPriceTickSize)}
          dropZ={false}
        />
      }
    />
  );
};

export default MarkPrice;
