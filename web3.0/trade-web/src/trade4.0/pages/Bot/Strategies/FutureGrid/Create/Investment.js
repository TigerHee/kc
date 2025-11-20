/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Investment from 'Bot/components/Common/Investment/index.js';
import Row from 'Bot/components/Common/Row';
import { formatNumber } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import Decimal from 'decimal.js';

// 计算单张委托
const calcEachGrid = ({ limitAsset, minAmount, realMinAmount, quoteAmount, multiplier }) => {
  if ((!Number(minAmount) && !Number(realMinAmount)) || !Number(limitAsset)) return [0, 0];
  // value 有可能超过账户余额
  const inputValue = Math.min(limitAsset, quoteAmount) || 0;
  // realMinAmount是补救参数 之前的为空 就用他
  const calcMinAmount = Number(realMinAmount || minAmount);

  const zhangnum = Math.floor(inputValue / calcMinAmount);
  const basenum = Decimal(zhangnum).times(multiplier).valueOf();
  return [basenum, zhangnum];
};

export default ({
  symbolInfo,
  minAmount,
  balance = {},
  relatedParams,
  limitAsset,
}) => {
  const { symbolCode, base, quote, precision, multiplier } = symbolInfo;
  const { quoteAmount } = balance;
  const { realMinAmount, maxInvestment, blowUpPrice } = relatedParams;
  minAmount = Number(Decimal(minAmount || 0).toFixed(precision, Decimal.ROUND_UP));
  const [basenum, zhangnum] = calcEachGrid({
    limitAsset,
    minAmount,
    realMinAmount,
    quoteAmount,
    multiplier,
  });
  return (
    <>
      <Investment symbol={symbolCode} minInvest={minAmount} maxInvestment={maxInvestment} />
      <Row
        mt={10}
        mb={8}
        fs={12}
        labelColor="text40"
        label={_t('eachgrid')}
        value={_t('eachgridvalue', {
          basenum: `${basenum} ${base}`,
          zhangnum: `${zhangnum} `,
        })}
      />
      <Row
        fs={12}
        labelColor="text40"
        label={_t('futrgrid.expectbaoprice')}
        value={blowUpPrice ? `${formatNumber(blowUpPrice, precision)} ${quote}` : '--'}
      />
    </>
  );
};
