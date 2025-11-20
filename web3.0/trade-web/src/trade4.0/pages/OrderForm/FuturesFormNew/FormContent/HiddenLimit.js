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

import { _t } from '../builtinCommon';
import { FormWrapper } from '../builtinComponents';

import SizeShow from '../components/Advanced/SizeShow';
import { FormItemLabel } from '../components/commonStyle';
import DefaultLastPrice from '../components/DefaultLastPrice';
import InfoTools from '../components/OrderInfo/InfoTools';
import PriceField from '../components/PriceField';
import SizeField from '../components/SizeField';
import TradeButton from '../components/TradeButton';

import useLimitProps from '../hooks/useLimitProps';

const { useWatch, useFormInstance } = Form;

const SizeFieldWrapper = memo(
  forwardRef((_, ref) => {
    const form = useFormInstance();
    const price = useWatch('price', form);
    const closeOnly = useWatch('closeOnly', form);

    return <SizeField ref={ref} name="size" price={price} closeOnly={closeOnly} />;
  }),
);

const OrderInfoWrapper = memo(() => {
  const form = useFormInstance();
  const price = useWatch('price', form);
  const closeOnly = useWatch('closeOnly', form);
  const size = useWatch('size', form);
  return <OrderInfo price={price} size={size} closeOnly={closeOnly} />;
});

const TradePNLFormWrapper = memo(
  forwardRef((_, ref) => {
    const form = useFormInstance();
    const price = useWatch('price', form);
    return <TradePNLForm openPrice={price} ref={ref} />;
  }),
);

const SizeShowWrapper = memo(() => {
  const form = useFormInstance();
  const price = useWatch('price', form);
  const size = useWatch('size', form);
  return <SizeShow name="visibleSize" price={price} size={size} />;
});

const HiddenLimit = () => {
  const {
    form,
    handleSubmitFinish,
    handleSubmit,
    orderStopRef,
    qtyRef,
    eventName,
  } = useLimitProps();

  return (
    <FormWrapper form={form} onSubmit={handleSubmitFinish} eventName={eventName} errorVoice>
      <DefaultLastPrice name="price" />
      <PriceField
        showLast
        name="price"
        label={<FormItemLabel>{_t('trade.order.price')}</FormItemLabel>}
      />
      <SizeFieldWrapper ref={qtyRef} />
      <SizeShowWrapper />
      <InfoTools />
      <TradeButton>
        <TradePNLFormWrapper ref={orderStopRef} />
        <DividerWrapper />
        <CloseOnlyForm />
        <SubmitButton onSubmit={handleSubmit} />
        <OrderInfoWrapper />
      </TradeButton>
    </FormWrapper>
  );
};

export default React.memo(HiddenLimit);
