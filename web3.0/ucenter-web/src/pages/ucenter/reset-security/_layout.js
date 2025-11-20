/**
 * Owner: vijay.zhou@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';

export default ({ children }) => {
  const isInApp = JsBridge.isApp();

  useEffect(() => {
    isInApp && _.delay(handleJSOpen, 300);
  }, [isInApp, handleJSOpen]);

  const handleJSOpen = useCallback(() => {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'onPageMount',
        dclTime: window.DCLTIME,
        pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
      },
    });
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};
