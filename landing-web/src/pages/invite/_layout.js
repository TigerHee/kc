/**
 * Owner: terry@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import KuFoxThemeProvider from '@kufox/mui/ThemeProvider';
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import { useIsMobile } from 'components/Responsive';
import EventProxy from 'components/EventProxy';

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isInApp, currentLang } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const isMobile = useIsMobile();
  // 需要登录后需要获取的信息
  useEffect(
    () => {
      if (isLogin) {
        dispatch({ type: 'kcCommon/updateUserNick', payload: { maxLen: 2 } });
        dispatch({ type: 'kcCommon/getUserIsSignUp' });
        dispatch({
          type: 'invite/getInviteCode',
          payload: {},
        });
      }
    },
    [dispatch, isLogin],
  );
  // 所有页面用h5的header, 将app的header隐藏， 首页的返回， 需要返回app
  useEffect(
    () => {
      if (isInApp) {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'updateHeader',
            statusBarTransparent: true,
            statusBarIsLightMode: false, // 状态栏文字颜色为白色
            visible: false,
          },
        });
        JsBridge.open({
          type: "func",
          params: { name: "updateBackgroundColor", color: "#00142a" }, // webview背景色
        });
      }
    },
    [isInApp],
  );
  useEffect(
    () => {
      if (isInApp) {
        window.onListenEvent('onLogin', () => {
          dispatch({ type: 'app/init' });
        });
      }
    },
    [dispatch, isInApp],
  );

  return (
    <EventProxy>
      <KuFoxThemeProvider>
        {children}
      </KuFoxThemeProvider>
    </EventProxy>
  );
};
