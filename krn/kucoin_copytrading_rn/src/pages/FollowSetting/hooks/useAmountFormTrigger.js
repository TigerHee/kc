import {useEffect} from 'react';
import {useWatch} from 'react-hook-form';

export const useAmountFormTrigger = formMethods => {
  const amountValList = useWatch({
    control: formMethods.control,
    name: ['maxAmount', 'perAmount'],
  });

  useEffect(() => {
    const [maxAmount, perAmount] = amountValList;
    if (!maxAmount || !perAmount) {
      return;
    }

    formMethods.trigger(['perAmount', 'maxAmount']);
  }, [amountValList, formMethods]);
};
