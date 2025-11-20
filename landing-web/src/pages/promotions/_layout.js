/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { debounce } from 'lodash';

const initInfo = func => debounce(() => {
  if (typeof func === 'function') {
    func();
  }
}, 10000, { leading: true, trailing: false });

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);

  // 监听app登录成功事件
  useEffect(() => {
    const appInit = initInfo(() => {
      dispatch({ type: 'app/init' });
    });
    window.onListenEvent('onLogin', appInit);
  }, []);

  // 获取邀请码
  useEffect(
    () => {
      if (isLogin) {
        dispatch({
          type: 'lego/getInviteCode',
        });
      }
    },
    [isLogin],
  );

  return <React.Fragment>{children}</React.Fragment>;
};
