/**
 * Owner: mike@kupotech.com
 */
import React, { Suspense, lazy } from 'react';

const CreatePageChartLazy = lazy(() =>
  import(/* webpackChunkName: "Bot_CreatePageChart" */ './CreatePageChart.js'),
);

export default (props) => {
  return (
    <Suspense fallback={<div />}>
      <CreatePageChartLazy {...props} />
    </Suspense>
  );
};
