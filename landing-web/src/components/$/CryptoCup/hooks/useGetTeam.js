/**
 * Owner: tom@kupotech.com
 */

import { useSelector } from 'dva';
import { get, remove, find, groupBy, maxBy } from 'lodash';
import useGetSelectedSeason from './useGetSelectedSeason';

function useGetTeam(isDetail) {
  const { registInfo, detailTeam, teamRecords, isJoin } = useSelector(
    state => state.cryptoCup,
  );
  const { curSelectedSeasonTeams } = useGetSelectedSeason();
  const teamsData = [...curSelectedSeasonTeams];

  const maxRecord = maxBy(teamRecords, 'totalScore') || {};
  const maxRecordTeam = find(teamsData, el => el.id === maxRecord?.teamId) || {};

  const myTeam = isJoin ? get(registInfo, 'seasons[0].teams[0]', {}) || {} : maxRecordTeam;
  const guestTeam =
    find(teamsData, el => el.groupCode === myTeam.groupCode && el.id !== myTeam.id) || {};
  const otherTeams = remove(teamsData, el => el.groupCode !== myTeam.groupCode) || [];
  const otherGroup = groupBy(otherTeams, 'groupCode');

  return {
    otherGroup,
    myTeam: isDetail ? detailTeam[0] : myTeam,
    guestTeam: isDetail ? detailTeam[1] : guestTeam,
  };
}

export default useGetTeam;
