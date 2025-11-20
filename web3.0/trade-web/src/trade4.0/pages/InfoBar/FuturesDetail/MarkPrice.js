import React from 'react';
import TextTips from './TextTips';
import { Link } from 'src/components/Router';
/**
 * Owner: clyne@kupotech.com
 */
import { _t } from 'src/utils/lang';
import { useMarkPrice } from 'src/trade4.0/hooks/futures/useMarket';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import AmountPrecision from './AmountPrecision';
import { getDigit } from 'src/helper';

const MarkPrice = () => {
  const tips = (
    <div>
      {_t('trade.tooltip.markPrice1')}
      <Link target="_blank" to="/futures/refer/markPrice">
        {_t('trade.tooltip.markPrice2')}
      </Link>
    </div>
  );
  const { symbol, indexPriceTickSize } = useGetCurrentSymbolInfo();
  const markPrice = useMarkPrice(symbol);
  return (
    <TextTips
      tips={tips}
      header={_t('refer.markPrice')}
      value={
        <AmountPrecision
          pointed
          value={markPrice}
          fixed={getDigit(indexPriceTickSize)}
          dropZ={false}
        />
      }
    />
  );
};

export default MarkPrice;
