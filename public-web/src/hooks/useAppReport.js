/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import _ from 'lodash';
import Report from 'tools/ext/kc-report';

export default () => {
  React.useEffect(() => {
    _.delay(Report.logWebNetwork, 3000);
    if (document.referrer) Report.logSelfDefined('page-referrer', document.referrer);
  }, []);
};
