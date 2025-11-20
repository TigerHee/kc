/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import TextTips from './TextTips';
import { _t } from 'src/utils/lang';
import Decimal from 'decimal.js';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { greaterThanOrEqualTo } from 'src/utils/operation';
import BigNumberTransform from 'src/trade4.0/components/PrettyCurrency/BigNumberTransform';
import { ContractUnitQuantity } from './utils';
import { useDetailData } from './hooks/useDetail';
import { QUANTITY_UNIT } from 'src/trade4.0/meta/futures';

const OpenInterest = () => {
  const openInterest = useDetailData('openInterest', 0);

  const contract = useGetCurrentSymbolInfo();
  const { settleCurrency } = contract;
  let text = '-';
  if (settleCurrency) {
    const valueText = greaterThanOrEqualTo(openInterest)(1000) ? (
      <BigNumberTransform value={openInterest} />
    ) : (
      <ContractUnitQuantity
        settleCurrency={settleCurrency}
        tradingUnit={QUANTITY_UNIT}
        value={openInterest}
        round={Decimal.ROUND_FLOOR}
      />
    );
    text = (
      <>
        {valueText}
        <span>{` ${_t('global.unit')}`}</span>
      </>
    );
  }

  return (
    <TextTips
      header={_t('contract.detail.openInterest')}
      value={text}
    />
  );
};

export default OpenInterest;
