/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import { sensors } from 'utils/sensors';
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
        dispatch({
          type: 'kcCommon/getInviteCode', // 获取邀请码
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
          type: 'func',
          params: { name: 'updateBackgroundColor', color: '#00142a' }, // webview背景色
        });
        JsBridge.open({
          type: 'func',
          params: { name: 'enableBounces', isEnable: false }, // webview 取消弹性效果
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
      //浏览埋点
      sensors.trackClick([isMobile ? 'ViewsH5' : 'ViewsWeb', '1'], { language: currentLang });
    },
    [dispatch, isInApp, isMobile, currentLang],
  );

  return <EventProxy>{children}</EventProxy>;
};
