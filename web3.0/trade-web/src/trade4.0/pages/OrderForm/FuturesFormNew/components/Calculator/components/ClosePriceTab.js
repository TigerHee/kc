/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import Form from '@mui/Form';

import PriceField from './PriceField';
import ROEField from './ROEField';
import SubmitButton from './SubmitButton';

import {
  MARGIN_MODE_ISOLATED,
  START_CALC,
  evtEmitter,
  getDigit,
  trackClick,
} from '../../../builtinCommon';
import { FormWrapper } from '../../../builtinComponents';
import { getCalculatorProps } from '../../../hooks/useCalculatorProps';
import { EVENT_NAME } from '../config';
import { useReset } from '../useReset';
import { calcClosePrice } from '../utils';

const event = evtEmitter.getEvt('futures-calculator');
const ClosePriceTab = () => {
  const [form] = Form.useForm();
  useReset(form);

  const handleSubmit = useCallback(() => {
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitFinish = useCallback((values) => {
    const { btnType, leverage, symbolInfo: contract } = getCalculatorProps();

    const params = { ...values, leverage, btnType };
    const fixed = getDigit(contract?.tickSize);
    const calcPrice = calcClosePrice(contract, params, fixed);

    event.emit(EVENT_NAME, { ...values, closePrice: calcPrice, fixed });
    // 埋点
    trackClick([START_CALC, '1'], {
      calculateType: 'ClosePrice',
      marginType: 'isolated',
    });
  }, []);

  return (
    <FormWrapper form={form} onSubmit={handleSubmitFinish} eventName={EVENT_NAME}>
      <PriceField name="openPrice" showLast />
      <ROEField />
      <SubmitButton onSubmit={handleSubmit} />
    </FormWrapper>
  );
};

export default React.memo(ClosePriceTab);
