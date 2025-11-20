/**
 * Owner: mike@kupotech.com
 */
import React, { Suspense, lazy } from 'react';

const ProfitsLazy = lazy(() => import(/* webpackChunkName: "Bot_Profits" */ './index'));

export default (props) => {
  return (
    <Suspense fallback={<div />}>
      <ProfitsLazy {...props} />
    </Suspense>
  );
};
