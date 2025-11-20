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
      type: 'newTurkey/getConfig',
      payload: { code: 'TURKY_NEW' },
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
        type: 'newTurkey/getRegStatus',
        payload: { activityName: 'TURKY_NEW' },
      });
      dispatch({
        type: 'newTurkey/getInviteCode',
        payload: {},
      });
    }
  }, [dispatch, isLogin]);

  return <React.Fragment>{children}</React.Fragment>;
};
