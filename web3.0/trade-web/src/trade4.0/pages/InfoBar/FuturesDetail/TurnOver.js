/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import TextTips from './TextTips';
import { _t } from 'src/utils/lang';
import { greaterThanOrEqualTo } from 'src/utils/operation';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import PrettyCurrency from 'src/trade4.0/components/PrettyCurrency';
import { useDetailData } from './hooks/useDetail';

const TurnOver = () => {
  const turnoverOf24h = useDetailData('turnoverOf24h');
  const { settleCurrency } = useGetCurrentSymbolInfo();
  const valueText = (
    <PrettyCurrency
      isShort
      isBigNumber={greaterThanOrEqualTo(turnoverOf24h)(1000)}
      value={turnoverOf24h}
      currency={settleCurrency}
    />
  );

  return (
    <TextTips
      className="bigNumberRTLWrapper"
      header={_t('trade.contract.24Turnover')}
      value={valueText}
    />
  );
};

export default TurnOver;
