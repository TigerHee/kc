/**
 * Owner: odan.ou@kupotech.com
 */
import { multiplyFloor } from 'helper';
import React from 'react';
import { useSelector } from 'dva';
import { NumberFormat } from '@kux/mui';
import { CURRENCY_CHARS } from 'utils/constants';
import { _t } from 'utils/lang';

const MoneyAmountFormat = ({
  value,
  showChar = true,
  showLegalCurrency = false,
  needTransfer = false,
}) => {
  const currentLang = useSelector((state) => state.app.currentLang);
  const { currency, prices, rates } = useSelector((state) => state.currency);
  const rate = prices.USDT;
  const currencyRate = rates[currency];
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];

  const target = needTransfer
    ? multiplyFloor(rate, value, 2) * 1
    : multiplyFloor(currencyRate, value, 2);
  const char = showChar ? (selected ? selected.char : '--') : '';

  const options = { maximumFractionDigits: 2 };
  if (+value >= 1000000) {
    options.notation = 'compact';
  }

  return (
    <React.Fragment>
      {value ? (
        <NumberFormat currency={char} lang={currentLang} options={options}>
          {target}
        </NumberFormat>
      ) : (
        '--'
      )}
      {showLegalCurrency ? ` ${currency}` : ''}
    </React.Fragment>
  );
};

export default MoneyAmountFormat;
