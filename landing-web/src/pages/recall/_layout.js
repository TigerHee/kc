/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import JsBridge from 'utils/jsBridge';
import { useSelector, useDispatch } from 'dva';

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);
  // 监听app登录成功事件
  useEffect(() => {
    window.onListenEvent('onLogin', () => {
      dispatch({ type: 'app/init' });
    });
  }, []);

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
      }
    },
    [isInApp],
  );


  return <React.Fragment>{children}</React.Fragment>;
};
