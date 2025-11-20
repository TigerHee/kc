import {useLockFn, useMemoizedFn} from 'ahooks';
import {noop} from 'lodash';
import {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {refreshAppSession} from '@krn/bridge';
import * as Sentry from '@sentry/react-native';

import {queryUserInfo} from 'services/app';
import {gotoLoginPage} from 'utils/native-router-helper';
import {QueryClientCacheController} from 'utils/query-client-cache-controller';
import showError from 'utils/showError';
import {useMutation} from './react-query';

export const useIsLogin = () => {
  const isLogin = useSelector(state => state.app.isLogin);

  return isLogin;
};

export const useLoginStatusLoading = () => {
  const isLogin = useIsLogin();
  return isLogin === null;
};

/** 增强函数 登录校验未通过引导登录 preClick 为 校验前执行函数（埋点场景） */
export const useWithLoginFn = (callback = noop, preClick = noop) => {
  const isLogin = useIsLogin();
  const dispatch = useDispatch();
  const networkType = useSelector(state => state.app.networkType);
  const {mutateAsync: queryUserInfoAndTriggerCallback} = useMutation({
    mutationFn: queryUserInfo,
    onSuccess: ({data}) => {
      const {uid} = data || {};
      QueryClientCacheController.resetQueriesByParentUid(uid);
      dispatch({
        type: 'app/update',
        payload: {
          isLogin: true,
          userInfo: data,
        },
      });
    },
    onError: e => {
      Sentry.captureEvent({
        message: `useWithLoginFn-queryUserInfoAndTriggerCallback-error:${e?.message}`,
        tags: {
          fatal_type: 'network',
        },
      });
      showError(e, dispatch);
      if (networkType !== 'NONE') {
        gotoLoginPage();
      }
    },
  });

  const lockQueryUserInfoAndTriggerCallback = useLockFn(
    queryUserInfoAndTriggerCallback,
  );

  const backToLogin = useCallback(
    async val => {
      const {success} = (await refreshAppSession()) || {};
      if (success) {
        await lockQueryUserInfoAndTriggerCallback();
        preClick(val);
        callback(val);
        return;
      }
      // 刷新 session 失败 打开登录页
      gotoLoginPage();
    },
    [callback, lockQueryUserInfoAndTriggerCallback, preClick],
  );

  const doCallback = useMemoizedFn(val => {
    preClick?.(val);
    callback?.(val);
  });

  const withFn = useMemo(() => {
    if (isLogin === false) {
      return backToLogin;
    }
    return doCallback;
  }, [isLogin, doCallback, backToLogin]);

  return {
    run: withFn,
    isLogin,
  };
};
