/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { searchToJson } from 'helper';
import JsBridge from 'utils/jsBridge';
import useGetRaceAward from 'components/$/CryptoCup/hooks/useGetRaceAward';

const query = searchToJson();
const { scode } = query || {};

export default ({ children }) => {
  useGetRaceAward();
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const { campaigns } = useSelector(state => state.cryptoCup);

  const init = async () => {
    dispatch({ type: 'app/getServerTime' });
    try {
      const [campaignsData] = await Promise.all([
        dispatch({
          type: 'cryptoCup/getCampaigns',
          payload: { name: 'sjb' },
        }),
      ]);

      // 获取当前赛季的队伍
      dispatch({
        type: 'cryptoCup/getCampaignTeams',
        payload: {
          campaignId: campaignsData?.id,
          // seasonIds: campaignsData?.currentSeasonId ? [campaignsData?.currentSeasonId] : [],
          // 改为取全量
          seasonIds: (campaignsData?.seasons || []).map(el => el.id) || [],
          pageSize: 40,
        },
      });
    } catch (e) {
      console.log('crypto-cup page init err:', e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(
    () => {
      if (isLogin) {
        dispatch({ type: 'kcCommon/updateUserNick', payload: { maxLen: 2 } });
        dispatch({ type: 'cryptoCup/getInviteCode' });
      }
    },
    [dispatch, isLogin],
  );

  useEffect(
    () => {
      const campaignId = get(campaigns, 'id', undefined);
      const currentSeasonId = get(campaigns, 'currentSeasonId', undefined);

      // 获取被邀请者
      if (scode) {
        dispatch({
          type: 'cryptoCup/queryInvitor',
          payload: {
            scode,
          },
        });
      }

      // 我的报名信息
      if (isLogin && campaignId && currentSeasonId) {
        // 获取分享码
        dispatch({
          type: 'cryptoCup/getShareCode',
          payload: {
            campaignId,
            seasonId: currentSeasonId,
          },
        });
        // 我的报名信息
        dispatch({
          type: 'cryptoCup/getRegistInfo',
          payload: {
            campaignId,
            seasonIds: [currentSeasonId],
          },
        });
      }
      // 上报首次进入
      if (isLogin && campaignId) {
        dispatch({
          type: 'cryptoCup/uploadBehavior',
          payload: {
            campaignId,
            event: 1,
          },
        });
      }
      // 获取订阅状态
      if (isLogin && campaignId) {
        dispatch({
          type: 'cryptoCup/getBehavior',
          payload: {
            campaignId,
            event: 2,
          },
        });
      }
    },
    [dispatch, isLogin, campaigns],
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

        window.onListenEvent('onLogin', () => {
          dispatch({ type: 'app/init' });
        });
      }
    },
    [dispatch, isInApp],
  );

  return <React.Fragment>{children}</React.Fragment>;
};
