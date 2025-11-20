import JsBridge from 'gbiz-next/bridge';
import { useRouter } from 'kc-next/router';
import { IS_SERVER_ENV } from 'kc-next/env';
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { matchPath } from 'react-router';
import { replace } from 'utils/router';
import { getIsApp } from 'kc-next/boot';

const NO_BACK_URL_ROUTS = ['/account-sub/assets/:sub', '/account-sub/api-manager/:sub'];
const ALLOW_NO_LOGIN_PATHS = [
  '/ucenter/reset-security/address/:address',
  '/ucenter/reset-security/token/:token',
  '/oauth',
];

const UserRoot = ({ children, path = '/ucenter/signin' }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isApp = getIsApp();
  const isLogin = useSelector((state: any) => state.user?.isLogin);
  const user = useSelector((state: any) => state.user?.user);
  const pathname = router?.asPath || '';
  const needRedirect = !ALLOW_NO_LOGIN_PATHS.some((routePath) => !!matchPath(routePath, pathname));

  const onListenAppLogin = useCallback(() => {
    dispatch({ type: 'app/initApp' });
  }, [dispatch]);

  useEffect(() => {
    const handleJumpAppLogin = async () => {
      await JsBridge.open({ type: 'jump', params: { url: '/user/login' } });
      await JsBridge.open({ type: 'func', params: { name: 'exit' } });
    };
    const { status } = user || {};
    if (isLogin === false) {
      if (!needRedirect) return;
      if (isApp) {
        handleJumpAppLogin();
      } else {
        const backUrl = (() => {
          if (IS_SERVER_ENV) {
            return '';
          }

          let initialBackUrl = window.location.href;
          if (NO_BACK_URL_ROUTS.some((routePath) => !!matchPath(routePath, pathname))) {
            initialBackUrl = '';
          }
          return initialBackUrl;
        })();
        // web默认统一去登录页面
        window.location.href = `${path}?backUrl=${encodeURIComponent(
          backUrl,
        )}`;
      }
    } else if (isLogin && status === 9) {
      console.warn('check 1: 进入UserRoot，status=9');
      if (pathname !== '/utransfer') {
        replace('/utransfer');
      }
    }
  }, [needRedirect, isApp, isLogin, user, pathname]);

  useEffect(() => {
    if (JsBridge.isApp()) {
      JsBridge.listenNativeEvent.on('onLogin', onListenAppLogin);
    }

    return () => {
      if (JsBridge.isApp()) {
        JsBridge.listenNativeEvent.off('onLogin', onListenAppLogin);
      }
    };
  }, [onListenAppLogin]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default UserRoot;
