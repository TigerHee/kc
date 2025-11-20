/**
 * Owner: tom@kupotech.com
 */

import { useSelector } from 'dva';
import { find, last } from 'lodash';

function useGetTeamRecord(teamId) {
  const { teamRecords } = useSelector(state => state.cryptoCup);

  const record = find(teamRecords, e => e.teamId === teamId) || {};
  const todayRecord = last(record?.pointDetailList) || {};

  return {
    record,
    todayRecord,
  };
}

export default useGetTeamRecord;
