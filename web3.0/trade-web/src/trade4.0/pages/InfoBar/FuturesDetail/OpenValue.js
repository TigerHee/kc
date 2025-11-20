/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import TextTips from './TextTips';
import { _t } from 'src/utils/lang';
import Decimal from 'decimal.js';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { greaterThanOrEqualTo } from 'src/utils/operation';
import { multiplyFloor } from 'helper';
import BigNumberTransform from 'src/trade4.0/components/PrettyCurrency/BigNumberTransform';
import { ContractUnitQuantity, ContractUnitText } from './utils';
import { formatCurrency } from 'src/trade4.0/utils/futures';
import { useDetailData } from './hooks/useDetail';

const OpenValue = () => {
  const openInterest = useDetailData('openInterest', 0);
  const contract = useGetCurrentSymbolInfo();
  const { baseCurrency, multiplier, settleCurrency } = contract;
  let text = '-';
  if (multiplier !== undefined && baseCurrency && settleCurrency) {
    const value = multiplyFloor(openInterest, multiplier);
    const valueText = greaterThanOrEqualTo(value)(1000) ? (
      <BigNumberTransform value={value} />
    ) : (
      <ContractUnitQuantity
        settleCurrency={settleCurrency}
        tradingUnit={formatCurrency(baseCurrency)}
        value={openInterest}
        contract={contract}
        round={Decimal.ROUND_FLOOR}
      />
    );
    text = (
      <>
        {valueText}
        <span className="ml-2">
          <ContractUnitText tradingUnit={formatCurrency(baseCurrency)} contract={contract} />
        </span>
      </>
    );
  }

  return (
    <TextTips
      className="bigNumberRTLWrapper"
      header={_t('trade.contract.openValue')}
      value={text}
    />
  );
};

export default OpenValue;
