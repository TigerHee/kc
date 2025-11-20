/**
 * Owner: garuda@kupotech.com
 */

import React, { memo, forwardRef } from 'react';

import Form from '@mui/Form';

import CloseOnlyForm from './CloseOnlyForm';
import { DividerWrapper } from './commonStyle';
import OrderInfo from './OrderInfo';
import SubmitButton from './SubmitButton';
import TradePNLForm from './TradePNLForm';

import { FormWrapper } from '../builtinComponents';

import InfoTools from '../components/OrderInfo/InfoTools';
import SetRetentionData from '../components/SetRetentionData';
import SizeField from '../components/SizeField';
import TradeButton from '../components/TradeButton';

import { useGetLastPrice, useGetMarketPrice } from '../hooks/useGetData';
import useMarketProps from '../hooks/useMarketProps';

const { useWatch, useFormInstance } = Form;

const SizeFieldWrapper = memo(
  forwardRef((_, ref) => {
    const form = useFormInstance();
    const closeOnly = useWatch('closeOnly', form);
    const price = useGetMarketPrice();

    return <SizeField ref={ref} name="size" price={price} closeOnly={closeOnly} />;
  }),
);

const OrderInfoWrapper = memo(() => {
  const form = useFormInstance();
  const closeOnly = useWatch('closeOnly', form);
  const size = useWatch('size', form);
  const price = useGetMarketPrice();

  return <OrderInfo price={price} size={size} closeOnly={closeOnly} />;
});

const TradePNLFormWrapper = memo(
  forwardRef((_, ref) => {
    const price = useGetLastPrice();
    return <TradePNLForm openPrice={price} ref={ref} isMarket />;
  }),
);

const Market = () => {
  const {
    form,
    handleSubmitFinish,
    handleSubmit,
    orderStopRef,
    qtyRef,
    eventName,
  } = useMarketProps();

  return (
    <FormWrapper form={form} onSubmit={handleSubmitFinish} eventName={eventName} errorVoice>
      <SetRetentionData orderStopRef={orderStopRef} qtyRef={qtyRef} />
      <SizeFieldWrapper ref={qtyRef} />
      <InfoTools />
      <TradeButton>
        <TradePNLFormWrapper ref={orderStopRef} />
        <DividerWrapper />
        <CloseOnlyForm notShowOther />
        <SubmitButton onSubmit={handleSubmit} />
        <OrderInfoWrapper />
      </TradeButton>
    </FormWrapper>
  );
};

export default React.memo(Market);
