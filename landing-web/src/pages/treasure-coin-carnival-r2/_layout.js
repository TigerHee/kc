/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);

  useEffect(() => {
    dispatch({
      type: 'newCoinCarnival/getConfig',
      payload: { code: 'KUCOIN_TREASURE_COIN_CARNIVAL_2' },
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
        type: 'newCoinCarnival/getRegStatus',
        payload: { activityName: 'KUCOIN_TREASURE_COIN_CARNIVAL_2' },
      });
      dispatch({
        type: 'newCoinCarnival/getInviteCode',
        payload: {},
      });
    }
  }, [dispatch, isLogin]);

  return <React.Fragment>{children}</React.Fragment>;
};
