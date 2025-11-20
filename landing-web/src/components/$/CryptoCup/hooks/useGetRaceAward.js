/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';

const useGetRaceAward = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);

  // 领取所有奖励
  const obtainAllAwards = useCallback(
    async () => {
      const unclaimedList = await dispatch({
        type: 'cryptoCup/getRaceResult',
        payload: {
          campaignNameEn: 'sjb',
        },
      });
      if (Array.isArray(unclaimedList)) {
        let _acc = [];
        for (let item of unclaimedList) {
          const { campaignId, seasonId } = item || {};
          // 获取比赛奖励
          const data = await dispatch({
            type: 'cryptoCup/obtainReward',
            payload: {
              campaignId,
              seasonId,
            },
          });
          _acc.push({ ...data, ...item });
        }
        dispatch({ type: 'cryptoCup/update', payload: { obtainedList: _acc } });
      }
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (isLogin) {
        obtainAllAwards();
      }
    },
    [isLogin, obtainAllAwards],
  );

  // 离开页面清除掉数据
  useEffect(
    () => {
      return () => {
        dispatch({
          type: 'cryptoCup/update',
          payload: { unclaimedList: [], obtainedList: [], curIndex: 0 },
        });
      };
    },
    [dispatch],
  );

  return {};
};

export default useGetRaceAward;
