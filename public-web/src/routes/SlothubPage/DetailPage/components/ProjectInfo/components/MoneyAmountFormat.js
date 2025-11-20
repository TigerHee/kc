/*
 * @Date: 2024-06-17 17:19:09
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-21 16:04:12
 */
/**
 * Owner: odan.ou@kupotech.com
 */
import { CURRENCY_CHARS } from 'config/base';
import { multiplyFloor } from 'helper';
import React from 'react';
import { useSelector } from 'src/hooks/useSelector';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';

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
