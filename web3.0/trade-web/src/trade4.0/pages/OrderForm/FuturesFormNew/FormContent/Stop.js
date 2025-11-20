/**
 * Owner: garuda@kupotech.com
 */

import React, { memo, forwardRef, useMemo, useCallback } from 'react';

import Form from '@mui/Form';

import CloseOnlyForm from './CloseOnlyForm';
import OrderInfo from './OrderInfo';
import SubmitButton from './SubmitButton';

import { _t, greaterThan, lessThanOrEqualTo, styled, thousandPointed } from '../builtinCommon';
import { FormWrapper } from '../builtinComponents';

import { FormItemLabel } from '../components/commonStyle';
import InfoTools from '../components/OrderInfo/InfoTools';
import PriceField from '../components/PriceField';
import SetRetentionData from '../components/SetRetentionData';
import SizeField from '../components/SizeField';
import StopPriceTypeField from '../components/StopPriceTypeField';
import TradeButton from '../components/TradeButton';

import { useGetSymbolInfo } from '../hooks/useGetData';
import useStopProps from '../hooks/useStopProps';

const StopLabel = styled.span`
  margin-right: 2px;
`;

const { useWatch, useFormInstance } = Form;

const SizeFieldWrapper = memo(
  forwardRef(({ isStopLimit }, ref) => {
    const form = useFormInstance();
    const price = useWatch('price', form);
    const stopPrice = useWatch('stopPrice', form);
    const closeOnly = useWatch('closeOnly', form);

    const triggerPrice = isStopLimit ? price : stopPrice;
    return <SizeField ref={ref} name="size" price={triggerPrice} closeOnly={closeOnly} />;
  }),
);

const OrderInfoWrapper = memo(({ isStopLimit }) => {
  const form = useFormInstance();
  const price = useWatch('price', form);
  const stopPrice = useWatch('stopPrice', form);
  const closeOnly = useWatch('closeOnly', form);
  const size = useWatch('size', form);

  const triggerPrice = isStopLimit ? price : stopPrice;
  return <OrderInfo price={triggerPrice} size={size} closeOnly={closeOnly} />;
});

const StopPriceField = memo(() => {
  const form = useFormInstance();
  const { symbolInfo: contract } = useGetSymbolInfo();

  const stopType = useWatch('stopPriceType', form);

  const step = useMemo(() => {
    if (stopType && stopType !== 'TP') {
      return contract.indexPriceTickSize;
    }

    return contract.tickSize;
  }, [contract, stopType]);

  const validator = useCallback(
    (__, value) => {
      if (!value) {
        return Promise.reject(_t('contact.input.stopPrice.check'));
      }

      if (lessThanOrEqualTo(value)(0) || greaterThan(value)(contract?.maxPrice)) {
        return Promise.reject(
          _t('contract.stopPrice.check', { price: thousandPointed(contract.maxPrice) }),
        );
      }

      return Promise.resolve();
    },
    [contract],
  );

  return (
    <PriceField
      validator={validator}
      name="stopPrice"
      label={
        <FormItemLabel>
          <StopLabel>{_t('assets.OrderHistory.stopPrice')}</StopLabel>
          <StopPriceTypeField name="stopPriceType" priceName="price" stopPriceName="stopPrice" />
        </FormItemLabel>
      }
      ShowYSmall={
        <StopPriceTypeField name="stopPriceType" priceName="price" stopPriceName="stopPrice" />
      }
      step={step}
    />
  );
});

const Stop = () => {
  const { form, handleSubmitFinish, handleSubmit, eventName, isStopLimit, qtyRef } = useStopProps();

  return (
    <FormWrapper form={form} onSubmit={handleSubmitFinish} eventName={eventName} errorVoice>
      <SetRetentionData />
      <StopPriceField />

      {isStopLimit ? (
        <PriceField name="price" label={<FormItemLabel>{_t('trade.order.price')}</FormItemLabel>} />
      ) : null}

      <SizeFieldWrapper isStopLimit={isStopLimit} ref={qtyRef} />
      <InfoTools />
      <TradeButton>
        <CloseOnlyForm notShowOther={!isStopLimit} />
        <SubmitButton onSubmit={handleSubmit} />
        <OrderInfoWrapper isStopLimit={isStopLimit} />
      </TradeButton>
    </FormWrapper>
  );
};

export default React.memo(Stop);
