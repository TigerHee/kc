/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { useCallback, useEffect } from 'react';
import { gotoAppLogin } from '@knb/native-bridge/lib/BizBridge';
import jsBridge from 'utils/jsBridge';
import usePrevious from './usePrevious';

/**
 * 登录 登出 hooks
 */
const useLogin = onLoginChange => {
  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.user.isLogin);
  const isInApp = useSelector(state => state.app.isInApp);
  const isLoginPrev = usePrevious(isLogin);

  const handleLogin = useCallback(
    appLoginParams => {
      // 在App里面，同时支持注入Cookie登录
      if (isInApp) {
        gotoAppLogin();
        return;
      }

      dispatch({
        type: 'user/update',
        payload: {
          showLoginDrawer: true,
        },
      });
    },
    [dispatch, isInApp],
  );

  const handleLogout = useCallback(
    () => {
      if (isInApp) {
        // APP 需要回调
        jsBridge.open({ type: 'func', params: { name: 'logout' } }, async ({ code }) => {
          if (code === 0)
            await dispatch({
              type: 'user/update',
              payload: {
                user: null,
                isLogin: false,
              },
            });
        });
        return;
      }
      dispatch({
        type: 'user/logout',
      });
    },
    [dispatch, isInApp],
  );

  // 登录登出状态变化之后的回调
  useEffect(
    () => {
      if (isLogin !== undefined && isLoginPrev !== undefined && isLogin !== isLoginPrev) {
        onLoginChange && onLoginChange();
      }
    },
    [isLogin, isLoginPrev, onLoginChange],
  );

  return {
    isLogin,
    handleLogin,
    handleLogout,
  };
};

export default useLogin;
