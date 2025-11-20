/**
 * Owner: garuda@kupotech.com
 * 单个表单组件
 */
import React from 'react';

import { FormContentWrapper, OrderTypesWrapper } from './commonStyle';
import FormCont from './FormCont';

import HeaderTool from '../components/HeaderTool';
import TradeConfirmDialog from '../components/TradeConfirmDialog';
import { FuturesFormContext } from '../config';

const SingleForm = () => {
  return (
    <FormContentWrapper>
      <HeaderTool />
      <OrderTypesWrapper />
      <FuturesFormContext.Provider value={{ eventName: 'singleForm' }}>
        <FormCont />
        <TradeConfirmDialog />
      </FuturesFormContext.Provider>
    </FormContentWrapper>
  );
};

export default React.memo(SingleForm);
