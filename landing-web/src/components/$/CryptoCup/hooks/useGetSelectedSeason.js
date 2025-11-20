/*
 * @Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';

function useGetSelectedSeason() {
  const { campaigns, curSelectedSeasonIndex, campaignTeams } = useSelector(
    state => state.cryptoCup,
  );

  const season = (campaigns?.seasons || [])[curSelectedSeasonIndex] || {};
  const seasonId = season?.id;
  const curSelectedSeasonTeams = (campaignTeams || []).filter(el => el.seasonId === seasonId) || [];

  // 当前赛季倒计时开始时间
  const seasonBeginTime = useMemo(
    () => {
      if (season?.status === 1) return season?.startTime;
      if (season?.status === 2) return season?.endTime;
      return false;
    },
    [season],
  );

  return {
    season,
    seasonId,
    curSelectedSeasonIndex,
    curSelectedSeasonTeams,
    seasonBeginTime,
  };
}

export default useGetSelectedSeason;
