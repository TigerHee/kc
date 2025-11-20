/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useEffect } from 'react';
import InitComponent from './InitComponent';
import AdvancedOrdersTable from './AdvancedOrdersTable';
import CancelAllModal from './components/Modal/CancelAllModal';
import LoginPanel from '../../Common/LoginPanel';
import { futuresSensors } from 'src/trade4.0/meta/sensors';
import { BIClick, STOP_ORDER } from 'src/trade4.0/meta/futuresSensors/list';

const AdvancedOrders = () => {
  useEffect(() => {
    BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.LIST_EXPOSE]);
    futuresSensors.stopOrder.expose.click();
  }, []);
  return (
    <>
      <LoginPanel>
        <AdvancedOrdersTable />
      </LoginPanel>
      <InitComponent />
      <CancelAllModal />
    </>
  );
};

export default memo(AdvancedOrders);
