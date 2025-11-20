/**
 * Owner: kevyn.yu@kupotech.com
 */
import React from 'react';
import { divide } from '@/tools/math';
import { numberFormat } from '@kux/mui-next/utils';
import { useLang } from 'gbiz-next/hooks';

const formateOptions = { maximumFractionDigits: 2 };

export const handleMarkCap = (_target: number | string, lang?: string) => {
  let markCap;
  const target = Number(_target);

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
  const { currentLang } = useLang();
  return <React.Fragment>{value ? handleMarkCap(value, currentLang) : '--'}</React.Fragment>;
};
