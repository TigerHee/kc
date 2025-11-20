/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import InitComponent from './InitComponent';
import TradeHistoryTable from './TradeHistoryTable';
import LoginPanel from '../../Common/LoginPanel';

const TradeHistory = () => {
  return (
    <>
      <LoginPanel>
        <TradeHistoryTable />
      </LoginPanel>
      <InitComponent />
    </>
  );
};

export default memo(TradeHistory);
