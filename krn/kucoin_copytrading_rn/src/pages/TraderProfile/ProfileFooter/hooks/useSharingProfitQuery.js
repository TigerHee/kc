import {useSelector} from 'react-redux';

import {useQuery} from 'hooks/react-query';
import {getLeadOrderPositionInfo} from 'services/copy-trade';

export const usePullLeadOrderPositionInfo = () => {
  const {configId: leadConfigId} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  return useQuery({
    queryKey: ['getLeadOrderPositionInfo', {leadConfigId}],
    queryFn: async () => await getLeadOrderPositionInfo({leadConfigId}),
    enabled: !!leadConfigId,
    cacheTime: 0,
  });
};
