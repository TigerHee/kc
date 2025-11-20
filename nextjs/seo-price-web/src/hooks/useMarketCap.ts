/**
 * Owner: ella.wang@kupotech.com
 */
import { numberFormat } from '@kux/mui-next/utils';
import { CURRENCY_CHARS } from '@/config/base';
import { useCurrencyStore } from '@/store/currency';
import { divide } from '@/tools/math';
import multiplyFloor from '@/tools/math/multiplyFloor';
import { useLang } from 'gbiz-next/hooks';

import { useEffect, useRef } from 'react';
import { bootConfig } from 'kc-next/boot';

const formateOptions = { maximumFractionDigits: 2 };

export default ({ needTransfer, value, showChar = true }) => {
  const currency = useCurrencyStore((state) => state.currency);
  const prices = useCurrencyStore((state) => state.prices);
  const rates = useCurrencyStore((state) => state.rates);

  const rate = prices[bootConfig._BASE_CURRENCY_];
  const currencyRate = rates[currency];
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];
  const ref = useRef<string>('');
  const { currentLang } = useLang();

  useEffect(() => {
    if (value) {
      let target = needTransfer
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ? +multiplyFloor(rate, value, 2) * 1
        : +multiplyFloor(currencyRate, value, 2);
      let markCap;
      const char = showChar ? (selected ? selected.char : '--') : '';
      // let _number;
      if (target < 1000000) {
        markCap = numberFormat({
          number: Math.floor(target),
          lang: currentLang,
          options: formateOptions,
        }); // 小于1000000的数字需要增加千分位展示
         ref.current = char + '' + markCap;
         return
      }
      if (target < 10 ** 9) {
        markCap = divide(target, 1000000, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
         ref.current = char + '' + markCap + 'M';
         return
      }
      if (target < 10 ** 12) {
        markCap = divide(target, 10 ** 9, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
         ref.current = char + '' + markCap + 'B';
         return
      }
      if (target < 10 ** 15) {
        markCap = divide(target, 10 ** 12, 2);
        markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
         ref.current = char + '' + markCap + 'T';
         return
      }
      markCap = divide(target, 10 ** 15, 2);
      markCap = numberFormat({ number: markCap, lang: currentLang, options: formateOptions });
       ref.current = char + '' + markCap + 'P';
       return
    }
  }, [value, selected, rate, needTransfer, showChar, currencyRate, currentLang]);

  return ref.current;
};
