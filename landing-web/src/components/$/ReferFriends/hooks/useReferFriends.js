/**
 * Owner: jesse.shao@kupotech.com
 */
import qs from 'qs';
import { useDispatch, useSelector } from 'dva';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { _t } from 'utils/lang';
import { useState } from 'react';
import { getIsInApp } from 'helper';
import { addLangToPath } from 'utils/lang';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { isFunction } from 'lodash';
import { useCallback } from 'react';
import Toast from '../../CryptoCup/common/Toast';
import { referFriendExpose } from '../config';

const useReferFriends = () => {
  const isInApp = getIsInApp();
  // const currentSearch = window.location.search;
  // const pageParams = qs.parse(currentSearch.slice(1));
  const { isLogin } = useSelector((state) => state.user);
  // 是否禁用助力
  const [diabledUserAssist, setDiabledUserAssist] = useState(false);
  const referInfo = useSelector((state) => state.referFriend.referInfo);
  const invitationCode = useSelector((state) => state.referFriend.invitationCode);
  const userByRcode = useSelector((state) => state.referFriend.userByRcode);
  const getPlatformAssist = useSelector((state) => state.referFriend.getPlatformAssist);
  const gift = useSelector((state) => state.referFriend.gift);

  // const { rcode, utm_source } = pageParams || {};
  const { totalSupportAmount, supportRule, firstTradeCompleted } = referInfo;
  const rcode = queryPersistence.getPersistenceQuery('rcode');
  const utm_source = queryPersistence.getPersistenceQuery('utm_source');
  const dispatch = useDispatch();
  // 缓存中有rcode说明url中有rcode，是被邀请人
  const isBeInvitedMan = !!rcode;

  // 判断若邀请人未登陆： 引导用户完成登陆，登陆后需要返回邀请助力活动，继续上述邀请人已登陆流程。
  const handleLogin = () => {
    try {
      // app
      if (isInApp) {
        import('@knb/native-bridge').then(({ default: jsBridge }) => {
          jsBridge.open({
            type: 'jump',
            params: {
              url: `/user/login?rcode=${rcode}&utm_source=${utm_source}`,
            },
          });
        });

        return;
      }
      // web
      const loginBackUrl = encodeURIComponent(window.location.href);
      // const loginBackUrl = window.location.href;
      const searchValue = `?backUrl=${loginBackUrl}`;
      window.location.href = addLangToPath(`${KUCOIN_HOST}/ucenter/signin${searchValue}`);
    } catch (e) {
      if (e.message) {
        Toast(e.message);
      }
      window.location.href = addLangToPath(`${KUCOIN_HOST}/ucenter/signin`);
    }
  };

  const triggerPlatformAssist = useCallback(() => {
    dispatch({
      type: 'referFriend/getPlatformAssist',
    });
  }, []);

  const clearPlatformAssist = useCallback(() => {
    dispatch({
      type: 'referFriend/update',
      payload: {
        getPlatformAssist: '',
      },
    });
  }, []);

  const userAssist = useCallback(
    async (cb) => {
      const res = await dispatch({
        type: 'referFriend/userAssist',
        payload: {
          rcode,
        },
      });
      if (res?.code === '200') {
        referFriendExpose(['ResultToast', '1']);
        Toast(_t('5hLPUKVFwoiSpkn6DpLRnw'));
        cb && cb();
        return;
      }
      // 已经帮好友助力过啦～ （后置灰） 助力次数已达上限～（后置灰） 活动已结束～（后置灰）
      if (['500030', '500031', '500006'].includes(res?.code)) {
        setDiabledUserAssist(true);
        return;
      }
    },
    [dispatch, setDiabledUserAssist, rcode],
  );

  // 未登录会去登录
  // 已登录会执行回调
  const loginOrAct = (cb) => {
    if (isLogin) {
      if (isFunction(cb)) {
        cb();
      }
    } else {
      handleLogin();
    }
  };

  return {
    isLogin,
    isBeInvitedMan,
    rcode,
    handleLogin,
    utm_source,
    triggerPlatformAssist,
    clearPlatformAssist,
    loginOrAct,
    isInApp,
    invitationCode,
    getPlatformAssist,
    userByRcode,
    referInfo,
    gift,
    userAssist,
    diabledUserAssist,
    firstTradeCompleted,
    hasGotFinalAward: totalSupportAmount >= 10000,
    supportRule,
  };
};

export default useReferFriends;
