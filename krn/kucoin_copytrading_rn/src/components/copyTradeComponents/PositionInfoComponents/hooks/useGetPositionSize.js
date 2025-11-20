import {isNil} from 'lodash';
import {useMemo} from 'react';

import {useGetFuturesInfoBySymbol} from 'hooks/useGetFuturesInfoBySymbol';
import useLang from 'hooks/useLang';
import {formatCurrency} from 'utils/futures-helper';
import {getDigit} from 'utils/helper';
import {multiply} from 'utils/operation';

export const useGetPositionSize = ({symbol, value}) => {
  const {baseCurrency, multiplier} = useGetFuturesInfoBySymbol(symbol) || {};
  const {numberFormat} = useLang();

  const formatSize = useMemo(() => {
    if (isNil(value)) {
      return '--';
    }
    const formatUnitSize = numberFormat(multiply(value)(multiplier), {
      options: {
        maximumFractionDigits: getDigit(multiplier, true),
      },
    });
    return formatUnitSize;
  }, [multiplier, numberFormat, value]);

  return {
    baseCurrency: formatCurrency(baseCurrency),
    size: !multiplier ? '--' : formatSize,
  };
};
