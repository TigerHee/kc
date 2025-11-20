import {useMemo} from 'react';
import {useWatch} from 'react-hook-form';

import {dividedBy, multiply} from 'utils/operation';

export const useCalcDueLossPrice = ({control}) => {
  const stopLossPercentVal = useWatch({
    control,
    name: 'stopLossPercent',
  });

  const maxAmountVal = useWatch({
    control,
    name: 'maxAmount', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });

  const dueLossPrice = useMemo(() => {
    if (!stopLossPercentVal || !maxAmountVal) return '';

    if (stopLossPercentVal > 100) return '';
    return multiply(stopLossPercentVal)(dividedBy(maxAmountVal)(100));
  }, [maxAmountVal, stopLossPercentVal]);

  return dueLossPrice;
};
