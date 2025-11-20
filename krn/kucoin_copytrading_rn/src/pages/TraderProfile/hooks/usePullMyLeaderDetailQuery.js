import {useSelector} from 'react-redux';

import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {queryMyLeaderDetail} from 'services/copy-trade';

export const usePullMyLeaderDetailQuery = (options = {}) => {
  const {configId: leadConfigId, uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  return useQuery({
    queryKey: [QueryKeys.pullMyLeaderDetailQuery, {leadConfigId, subUID}],
    queryFn: () => {
      if (!leadConfigId || !subUID) {
        return;
      }
      return queryMyLeaderDetail({
        leadConfigId,
        subUID,
      });
    },
    enabled: !!(leadConfigId && subUID),
    refetchOnFocus: true,
    ...options,
  });
};
