/**
 * Owner: clyne@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Form } from '@kux/mui';
import { debounce, isNil } from 'lodash';

import ProfitLossTips from './ProfitLossTips';

const { useWatch } = Form;

const PLTipsInfo = ({ type, form, stopPriceType }) => {
  const price = useWatch(type, form);
  const [priceError, setPriceError] = useState(true);

  // 获取是否 price 有异常
  const checkPriceError = useCallback(
    debounce(() => {
      const error = form.getFieldError(type);
      setPriceError(Boolean(error && error?.length));
    }, 16),
    [],
  );

  useEffect(() => {
    if (price != null && price !== '') {
      checkPriceError();
    }
  }, [price]);

  if (priceError) return null;
  return <ProfitLossTips price={price} stopPriceType={stopPriceType} type={type} />;
};

export default PLTipsInfo;
