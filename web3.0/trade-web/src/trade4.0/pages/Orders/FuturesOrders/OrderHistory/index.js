/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import InitComponent from './InitComponent';
import OrderHistoryTable from './OrderHistoryTable';
import DetailModal from './components/Modal/Detail';
import LoginPanel from '../../Common/LoginPanel';

const OrderHistory = () => {
  return (
    <>
      <LoginPanel>
        <OrderHistoryTable />
      </LoginPanel>
      <InitComponent />
      <DetailModal />
    </>
  );
};

export default memo(OrderHistory);
