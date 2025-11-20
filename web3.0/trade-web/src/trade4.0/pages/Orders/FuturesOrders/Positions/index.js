/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useEffect } from 'react';
import InitComponent from './InitComponent';
import PositionsTable from './PositionsTable';
import { futuresSensors } from 'src/trade4.0/meta/sensors';
import loadable from '@loadable/component';

const OperatorMargin = loadable(() =>
  import(
    /* webpackChunkName: 'futures-order-dialog' */ '@/pages/Futures/components/OperatorMargin'
  ),
);

const Positions = () => {
  useEffect(() => {
    futuresSensors.position.expose.click();
  }, []);
  return (
    <>
      <PositionsTable />
      <InitComponent />
      <OperatorMargin />
    </>
  );
};

export default memo(Positions);
