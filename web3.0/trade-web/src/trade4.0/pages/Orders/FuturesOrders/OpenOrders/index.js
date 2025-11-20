/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useEffect } from 'react';
import InitComponent from './InitComponent';
import OpenOrdersTable from './OpenOrdersTable';
import CancelAllModal from './components/Modal/CancelAll';
import LoginPanel from '../../Common/LoginPanel';
import { futuresSensors } from 'src/trade4.0/meta/sensors';
import { BIClick, OPEN_ORDER } from '@/meta/futuresSensors/list';

const { BLOCK_ID, LIST_EXPOSE } = OPEN_ORDER;

const OrderHistory = () => {
  useEffect(() => {
    futuresSensors.activeOrder.expose.click();
    BIClick([BLOCK_ID, LIST_EXPOSE]);
  }, []);

  return (
    <>
      <LoginPanel>
        <OpenOrdersTable />
      </LoginPanel>
      <InitComponent />
      <CancelAllModal />
    </>
  );
};

export default memo(OrderHistory);
