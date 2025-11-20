/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';

function useGetTimeInfo() {
  const { serverTime } = useSelector(state => state.app);
  const { campaigns } = useSelector(state => state.cryptoCup);
  const currentSeason =
    (campaigns?.seasons || []).find(el => el.id === campaigns?.currentSeasonId) || {};
  // 赛事倒计时时间
  const timeLeft = useMemo(
    () => {
      if (currentSeason?.status === 1) return currentSeason?.startTime - serverTime;
      if (currentSeason?.status === 2) return currentSeason?.endTime - serverTime;
      return 0;
    },
    [currentSeason, serverTime],
  );

  // 倒计时开始时间
  const beginTime = useMemo(
    () => {
      if (currentSeason?.status === 1) return currentSeason?.startTime;
      if (currentSeason?.status === 2) return currentSeason?.endTime;
      return serverTime;
    },
    [currentSeason, serverTime],
  );

  const status = useMemo(
    () => {
      return currentSeason?.status;
    },
    [currentSeason],
  );

  return {
    timeLeft,
    status,
    beginTime,
  };
}

export default useGetTimeInfo;
