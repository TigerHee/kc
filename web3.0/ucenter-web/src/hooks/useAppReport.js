/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import Report from 'tools/ext/kc-report';

export default () => {
  React.useEffect(() => {
    _.delay(Report.logWebNetwork, 3000);
    if (document.referrer) Report.logSelfDefined('page-referrer', document.referrer);
  }, []);
};
