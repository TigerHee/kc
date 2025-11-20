import React from 'react';
/**
 * Owner: clyne@kupotech.com
 */
import TextTips from './TextTips';
import { _t } from 'src/utils/lang';
import { greaterThanOrEqualTo } from 'src/utils/operation';
import { useDetailData } from './hooks/useDetail';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import PrettyCurrency from 'src/trade4.0/components/PrettyCurrency';

const Volume = () => {
  const volumeOf24h = useDetailData('volumeOf24h');
  const { baseCurrency } = useGetCurrentSymbolInfo();
  const valueText = (
    <PrettyCurrency
      isShort
      isBigNumber={greaterThanOrEqualTo(volumeOf24h)(1000)}
      value={volumeOf24h}
      currency={baseCurrency}
    />
  );

  return (
    <TextTips
      className="bigNumberRTLWrapper"
      header={_t('trade.contract.24Volume')}
      value={valueText}
    />
  );
};

export default Volume;
