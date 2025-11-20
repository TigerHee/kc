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
        dispatch({ type: 'kcCommon/updateUserNick', payload: { maxLen: 2 } });
        dispatch({ type: 'kcCommon/getUserIsSignUp', payload: {activity: 'guess_eth'} });
        dispatch({
          type: 'prediction/getInviteCode',
          payload: {},
        });
        // 获取用户是否有中奖信息
        dispatch({
          type: 'prediction/getWinnerTip',
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
            statusBarIsLightMode: true, // 状态栏文字颜色为黑色
            visible: false,
          },
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

  return (
    <EventProxy>
      {children}
    </EventProxy>
  );
};
