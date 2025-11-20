/**
 * Owner: ella.wang@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { numberFormat } from '@kux/mui/utils';
import { CURRENCY_CHARS } from 'config/base';
import { divide, multiplyFloor } from 'helper';
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';

const formateOptions = { maximumFractionDigits: 2 };

export default ({ needTransfer, value, showChar = true }) => {
  const { currency, prices, rates } = useSelector((state) => state.currency);
  const rate = prices['USDT'];
  const currencyRate = rates[currency];
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];
  const { currentLang } = useLocale();

  const val = useMemo(() => {
    if (value) {
      let target = needTransfer
        ? multiplyFloor(rate, value, 2) * 1
        : multiplyFloor(currencyRate, value, 2);
      let markCap;
      const char = showChar ? (selected ? selected.char : '--') : '';
      // let _number;
      if (target < 1000000) {
        markCap = numberFormat({
          number: Math.floor(target),
          lang: currentLang,
          options: formateOptions,
        }); // 小于1000000的数字需要增加千分位展示
        return char + '' + markCap;
      }
      if (target < 10 ** 9) {
        markCap = divide(target, 1000000, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
        return char + '' + markCap + 'M';
      }
      if (target < 10 ** 12) {
        markCap = divide(target, 10 ** 9, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
        return char + '' + markCap + 'B';
      }
      if (target < 10 ** 15) {
        markCap = divide(target, 10 ** 12, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
        return char + '' + markCap + 'T';
      }
      markCap = divide(target, 10 ** 15, 2);
      markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
      return char + '' + markCap + 'P';
    }
  }, [value, selected, rate, needTransfer, showChar, currencyRate, currentLang]);

  return val;
};
