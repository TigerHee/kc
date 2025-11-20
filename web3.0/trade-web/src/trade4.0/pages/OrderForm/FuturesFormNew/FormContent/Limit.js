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

import { _t, styled } from '../builtinCommon';
import { FormWrapper, NewGuide } from '../builtinComponents';

import { FormItemLabel } from '../components/commonStyle';
import DefaultLastPrice from '../components/DefaultLastPrice';
import InfoTools from '../components/OrderInfo/InfoTools';
import PriceField from '../components/PriceField';
import SetRetentionData from '../components/SetRetentionData';
import SizeField from '../components/SizeField';
import TradeButton from '../components/TradeButton';

import useLimitProps from '../hooks/useLimitProps';

const GuidePlaceHolder = styled.div`
  position: relative;
  width: 1px;
  height: 1px;
  top: 10px;
`;

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

const Limit = () => {
  const {
    form,
    handleSubmitFinish,
    handleSubmit,
    orderStopRef,
    qtyRef,
    eventName,
    isLogin,
  } = useLimitProps();

  return (
    <FormWrapper form={form} onSubmit={handleSubmitFinish} eventName={eventName} errorVoice>
      <DefaultLastPrice name="price" />
      <SetRetentionData orderStopRef={orderStopRef} qtyRef={qtyRef} />
      <NewGuide defaultOpen={isLogin} type="order" path="/trade" placement="left">
        <GuidePlaceHolder />
      </NewGuide>

      <PriceField
        showLast
        name="price"
        label={<FormItemLabel>{_t('trade.order.price')}</FormItemLabel>}
      />
      <SizeFieldWrapper ref={qtyRef} />
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

export default React.memo(Limit);
