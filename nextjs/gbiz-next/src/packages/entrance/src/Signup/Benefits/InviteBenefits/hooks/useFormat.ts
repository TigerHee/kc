/**
 * Owner: sean.shi@kupotech.com
 */
import { useEventCallback } from '@kux/mui/hooks';
import storage from 'tools/storage';
import useKuxFormat from './useKuxFormat';
import { nFormatter } from '../../../../common/tools';

export const minCoverNum = 1000;

export const numOptions = { maximumFractionDigits: 2 } as const;

export const useFormat = () => {
  const currentLang = storage.getItem('kucoinv2_lang');
  const { numberFormat } = useKuxFormat();
  const formatNum = useEventCallback((num: number, options: any = {}) => {
    const _options = { ...numOptions, ...(options || {}) };
    return numberFormat({ lang: currentLang, number: Number(num), options: _options });
  });
  const formatNumInt = useEventCallback((num: number) => {
    return formatNum(Math.floor(num), { maximumFractionDigits: 0 });
  });
  return {
    formatNum,
    formatNumInt,
    nFormatterK: useEventCallback((amount: number, precision = 0, { minCoverNum: _minCoverNum = minCoverNum } = {}) => {
      return nFormatter(Number(amount), precision, { minCoverNum: _minCoverNum });
    }),
  };
};
