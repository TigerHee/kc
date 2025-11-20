/**
 * Owner: garuda@kupotech.com
 * 单个表单组件
 */
import React from 'react';

import { FormContentWrapper, OrderTypesWrapper } from './commonStyle';
import FormCont from './FormCont';

import { styled } from '../builtinCommon';

import HeaderTool from '../components/HeaderTool';
import { PluralFormNotTradeButton } from '../components/TradeButton';
import TradeConfirmDialog from '../components/TradeConfirmDialog';
import { BUY, SELL, FuturesFormContext } from '../config';

const PluralFormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  .KuxForm-form {
    flex: 1;
  }
`;

const PluralForm = () => {
  return (
    <FormContentWrapper>
      <HeaderTool />
      <OrderTypesWrapper />
      <PluralFormWrapper>
        <FuturesFormContext.Provider value={{ side: BUY, eventName: 'pluralForm_buy' }}>
          <FormCont />
        </FuturesFormContext.Provider>
        <FuturesFormContext.Provider value={{ side: SELL, eventName: 'pluralForm_sell' }}>
          <FormCont />
        </FuturesFormContext.Provider>
        <TradeConfirmDialog />
      </PluralFormWrapper>
      <PluralFormNotTradeButton />
    </FormContentWrapper>
  );
};

export default React.memo(PluralForm);
