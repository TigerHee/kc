/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import JsBridge from 'utils/jsBridge';
import { useSelector } from 'dva';

export default ({ children }) => {
  const { isInApp } = useSelector(state => state.app);

  useEffect(
    () => {
      if (isInApp) {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'updateHeader',
            visible: false,
            statusBarTransparent: true,
            statusBarIsLightMode: false,
          },
        });
        JsBridge.open({ type: 'event', params: { name: 'onPageMount' } });
      }
    },
    [isInApp],
  );

  useEffect(() => {
    document.body.style = `background-color: #3ce1aa`;
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};
