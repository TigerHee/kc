/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

export default () => {
  React.useEffect(() => {
    window.requestIdleCallback(() => {
      import('tools/ext/kc-report').then(({ default: Report }) => {
        Report.logWebNetwork();
        if (document.referrer) Report.logSelfDefined('page-referrer', document.referrer);
      });
    });
  }, []);
};
