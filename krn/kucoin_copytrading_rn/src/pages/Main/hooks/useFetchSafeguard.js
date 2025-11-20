import {useLockFn} from 'ahooks';
import {useCallback, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {refreshAppSession, userCenterBridge} from '@krn/bridge';
import * as Sentry from '@sentry/react-native';

import {SUPPORT_GET_USER_INFO_VERSION} from 'constants/version';
import {useMutation} from 'hooks/react-query';
import {useIsVersionGreater} from 'hooks/useIsVersionGreater';
import {useIsLogin} from 'hooks/useWithLoginFn';
import {queryUserInfo} from 'services/app';
import {QueryClientCacheController} from 'utils/query-client-cache-controller';
import {delay, generateQueryUserInfoErrorMsg} from '../helper';

const {getUserInfo} = userCenterBridge;

export const useFetchSafeguard = () => {
  const isLogin = useIsLogin();
  const dispatch = useDispatch();
  const networkType = useSelector(state => state.app.networkType);
  const checkVersionGreater = useIsVersionGreater();

  const isSupportGetUserInfo = useMemo(
    () => checkVersionGreater(SUPPORT_GET_USER_INFO_VERSION),
    [checkVersionGreater],
  );

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
      dispatch({type: 'leadInfo/pullUserLeadInfo'});
    },
  });

  const lockQueryUserInfoAndTriggerCallback = useLockFn(
    queryUserInfoAndTriggerCallback,
  );

  const handleRefreshSessionAndUserInfo = useCallback(async () => {
    // app 新包 提供getUserInfo 时 && 无 uid 表示未登录或者需要指纹登录 不调用刷新 session
    if (isSupportGetUserInfo) {
      const {uid} = (await getUserInfo()) || {};
      if (!uid) {
        return;
      }
    }
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const {success} = (await refreshAppSession()) || {};
        if (success) {
          // refreshAppSession 后 cookie不一定同步更新，此处延迟 1 秒 等待
          await delay(1000);

          await lockQueryUserInfoAndTriggerCallback();
          return; // 如果成功，则退出循环
        }
        // 支持新版登录态获取协议  此处漏斗上报
        if (isSupportGetUserInfo) {
          Sentry.captureEvent({
            message: 'useFetchSafeguard-refreshAppSession-isFail',
            tags: {
              fatal_type: 'network',
            },
            extra: {
              attempt,
              success,
            },
          });
        }
      } catch (error) {
        const message = generateQueryUserInfoErrorMsg({
          error,
          attempt,
          maxAttempts,
        });

        if (!message) {
          return;
        }

        Sentry.captureEvent({
          message,
          tags: {
            fatal_type: 'network',
          },
          extra: {
            errorCode: error?.code,
            errMessage: error?.msg || error?.message || error,
            attempt,
          },
        });
      }

      attempt++;
      // 支持新版登录态获取协议  此处漏斗上报 登录态存在 三次刷新token 并请求 userInfo 接口 仍然失败场景
      if (isSupportGetUserInfo && attempt === maxAttempts) {
        Sentry.captureEvent({
          message: 'useFetchSafeguard-handle-maxLimit-stop',
          tags: {
            fatal_type: 'network',
          },
        });
      }
    }
  }, [isSupportGetUserInfo, lockQueryUserInfoAndTriggerCallback]);

  useEffect(() => {
    // 网络状态不为飞行模式 && isLogin === false 才会执行
    if (isLogin !== false || networkType === 'NONE') return;
    // 执行一次
    handleRefreshSessionAndUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, networkType]);
};
