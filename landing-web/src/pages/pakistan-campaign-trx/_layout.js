/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { PAKISTAN_CAMPAIGN_CODE } from 'components/$/MarketCommon/config';

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);

  useEffect(() => {
    dispatch({
      type: 'pakistanCampaign/getConfig',
      payload: { code: PAKISTAN_CAMPAIGN_CODE },
    });
  }, [dispatch]);

  // 监听app登录成功事件
  useEffect(() => {
    window.onListenEvent('onLogin', () => {
      dispatch({ type: 'app/init' });
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'pakistanCampaign/getRegStatus',
        payload: { activityName: PAKISTAN_CAMPAIGN_CODE },
      });
      dispatch({
        type: 'pakistanCampaign/getInviteCode',
        payload: {},
      });
    }
  }, [dispatch, isLogin]);

  return <React.Fragment>{children}</React.Fragment>;
};
