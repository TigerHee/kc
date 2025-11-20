/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import InitComponent from './InitComponent';
import RealizedPNLTable from './RealizedPNLTable';
import OnlySymbolCheck from './OnlySymbolCheck';
import { OrderHeadBarWrapper } from '@/pages/Orders/Common/style';
import { name } from './config';
import { _t } from 'src/utils/lang';
import { Contract } from '../style';
import LoginPanel from '../../Common/LoginPanel';
import Detail from './components/Modal/Detail';

const RealizedPNL = () => {
  return (
    <>
      <ComponentWrapper name={name} breakPoints={[280, 580, 768, 1024, 1280]}>
        <Detail />
        <OrderHeadBarWrapper>
          <Contract>{_t('tradeType.kumex')}</Contract>
          <OnlySymbolCheck />
        </OrderHeadBarWrapper>
        <LoginPanel>
          <div style={{ flex: 1 }}>
            <RealizedPNLTable />
          </div>
        </LoginPanel>
        <InitComponent />
      </ComponentWrapper>
    </>
  );
};

export default memo(RealizedPNL);
