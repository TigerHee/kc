/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { useLocale } from '@kucoin-base/i18n';
import { numberFormat } from '@kux/mui/utils';
import { CURRENCY_CHARS } from 'config/base';
import { divide, multiplyFloor } from 'helper';
import { useSelector } from 'src/hooks/useSelector';

const formateOptions = { maximumFractionDigits: 2 };

const MoneyAmountFormat = ({
  value,
  showChar = true,
  showLegalCurrency = false,
  needTransfer = true,
}) => {
  const [markcap, setMarkcap] = useState();
  const { currency, prices, rates } = useSelector((state) => state.currency);
  const rate = prices['USDT'];
  const currencyRate = rates[currency];
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];
  const { currentLang } = useLocale();

  useEffect(() => {
    if (value) {
      let target = needTransfer
        ? multiplyFloor(rate, value, 2) * 1
        : multiplyFloor(currencyRate, value, 2);
      let markCap;
      const char = showChar ? (selected ? selected.char : '--') : '';
      if (target < 1000000) {
        markCap = numberFormat({
          number: Math.floor(target),
          lang: currentLang,
          options: formateOptions,
        }); // 小于1000000的数字需要增加千分位展示
        setMarkcap(char + '' + markCap);
        return;
      }
      if (target < 10 ** 9) {
        markCap = divide(target, 1000000, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
        setMarkcap(char + '' + markCap + 'M');
        return;
      }
      if (target < 10 ** 12) {
        markCap = divide(target, 10 ** 9, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
        setMarkcap(char + '' + markCap + 'B');
        return;
      }
      if (target < 10 ** 15) {
        markCap = divide(target, 10 ** 12, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
        setMarkcap(char + '' + markCap + 'T');
        return;
      }
      markCap = divide(target, 10 ** 15, 2);
      markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
      setMarkcap(char + '' + markCap + 'P');
    }
  }, [value, selected, rate, needTransfer, showChar, currencyRate, currentLang]);

  return (
    <React.Fragment>
      {markcap ? markcap : '--'}
      &nbsp;
      {showLegalCurrency ? currency : ''}
    </React.Fragment>
  );
};

export default MoneyAmountFormat;
