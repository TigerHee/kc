/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { numberFormat } from '@kux/mui/utils';
import { divide } from 'helper';

import React from 'react';

const formateOptions = { maximumFractionDigits: 2 };

export const handleMarkCap = (target, lang) => {
  let markCap;
  if (target < 10 ** 9) {
    markCap = Math.floor(target);
    return numberFormat({ number: markCap, lang, options: formateOptions });
  }
  if (target < 10 ** 12) {
    markCap = divide(target, 10 ** 9, 2);
    markCap = numberFormat({ number: markCap, options: formateOptions, lang });
    return markCap + 'B';
  }
  if (target < 10 ** 15) {
    markCap = divide(target, 10 ** 12, 2);
    markCap = numberFormat({ number: markCap, options: formateOptions, lang });
    return markCap + 'T';
  }
  markCap = divide(target, 10 ** 15, 2);
  markCap = numberFormat({ number: markCap, options: formateOptions, lang });
  return markCap + 'P';
};

export default ({ value }) => {
  const { currentLang } = useLocale();
  return <React.Fragment>{value ? handleMarkCap(value, currentLang) : '--'}</React.Fragment>;
};
