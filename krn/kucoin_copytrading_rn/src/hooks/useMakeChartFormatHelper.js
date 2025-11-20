import {useMemoizedFn} from 'ahooks';
import {useMemo} from 'react';

import useLang from 'hooks/useLang';
import {numberFixed} from 'utils/helper';
import {useGetUSDTCurrencyInfo} from './useGetUSDTCurrencyInfo';

export const useMakeChartFormatHelper = () => {
  const {dateTimeFormat, numberFormat, _t} = useLang();

  const {displayPrecision} = useGetUSDTCurrencyInfo();

  const profitNumberOption = useMemo(
    () => ({
      minimumFractionDigits: 0,
      maximumFractionDigits: displayPrecision,
    }),
    [displayPrecision],
  );

  const amountFormat = useMemoizedFn((val, options = {}) => {
    // 跟单收益全部向下取整
    const floorDecimalValue = numberFixed(val, +displayPrecision);

    return numberFormat(floorDecimalValue, {
      isPositive: true,
      currency: '',
      options: {...profitNumberOption, ...options},
    });
  });

  const helper = useMemo(
    () => ({
      _t,
      dateTimeFormat: val =>
        dateTimeFormat(+val, {
          options: {
            hour: undefined,
            minute: undefined,
            second: undefined,
          },
        }),
      amountFormat,
      percentFormat: (val, options = {}) =>
        numberFormat(val, {
          isPositive: true,
          options: {
            style: 'percent',
            ...profitNumberOption,
            ...options,
          },
        }),
    }),
    [dateTimeFormat, amountFormat, _t, profitNumberOption, numberFormat],
  );

  return helper;
};
