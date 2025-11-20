/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);

  useEffect(
    () => {
      // 活动详情
      dispatch({
        type: 'cryptoCup/getCampaigns',
        payload: { name: 'sjb' },
      });
    },
    [dispatch],
  );

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
    [dispatch, isInApp],
  );

  return <React.Fragment>{children}</React.Fragment>;
};
