/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Investment from 'Bot/components/Common/Investment/index.js';
import Row from 'Bot/components/Common/Row';
import { formatNumber, formatEffectiveDecimal, floatText } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import Decimal from 'decimal.js';

const getDailyRateText = (dailyRate) => {
  if (!dailyRate) return '--';
  let validNum = Decimal(dailyRate).times(100).toFixed(14, Decimal.ROUND_DOWN);
  validNum = formatEffectiveDecimal(validNum);
  return floatText(validNum);
};

export default ({ symbolInfo = {}, relatedParams = {} }) => {
  const { symbolCode, quota, base, pricePrecision, quotaPrecision, basePrecision } = symbolInfo;
  const { minInvestment, maxInvestment, borrowAmount, direction, dailyRate, blowUpPrice } =
    relatedParams;
  return (
    <>
      <Investment symbol={symbolCode} minInvest={minInvestment} maxInvestment={maxInvestment} />
      <Row
        mt={10}
        mb={8}
        fs={12}
        labelColor="text40"
        label={`${_t('borrownum')} ${direction === 'long' ? quota : base}`}
        value={
          borrowAmount
            ? formatNumber(borrowAmount, direction === 'long' ? quotaPrecision : basePrecision)
            : '--'
        }
      />
      <Row
        fs={12}
        mb={8}
        labelColor="text40"
        label={_t('daliyrate')}
        value={getDailyRateText(dailyRate)}
      />
      <Row
        fs={12}
        labelColor="text40"
        label={_t('futrgrid.expectbaoprice')}
        value={
          Number(blowUpPrice) > 0 ? `${formatNumber(blowUpPrice, pricePrecision)} ${quota}` : '--'
        }
      />
    </>
  );
};
