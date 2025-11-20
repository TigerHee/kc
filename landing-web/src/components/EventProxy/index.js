/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'dva';

import JsBridge from 'utils/jsBridge';

export default (props) => {
  const dispatch = useDispatch();
  const { isInApp, supportCookieLogin } = useSelector(state => state.app);

  useEffect(() => {
    document.body.addEventListener(
      'click',
      (e) => {
        if (e && e.target && e.target.getAttribute('data-key') === 'login') {
          // 在App里面，同时支持注入Cookie登录
          if (isInApp && supportCookieLogin) {
            JsBridge.open({
              type: 'jump',
              params: {
                url: '/user/login',
              },
            });
            return;
          }
          dispatch({
            type: 'user/update',
            payload: {
              showLoginDrawer: true,
            },
          });
        }
      },
      false,
    );
  }, []);
  return <React.Fragment>{props.children}</React.Fragment>;
};
