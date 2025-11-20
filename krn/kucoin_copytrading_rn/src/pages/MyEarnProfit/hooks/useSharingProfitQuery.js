import {useSelector} from 'react-redux';

import {useQuery} from 'hooks/react-query';
import {getProfitShareSummary} from 'services/copy-trade';

export const useSharingProfitQuery = () => {
  const {configId: leadConfigId, uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  return useQuery({
    queryKey: ['getProfitShareSummary', leadConfigId, subUID],
    queryFn: async () => await getProfitShareSummary({leadConfigId, subUID}),

    enabled: !!(leadConfigId && subUID),
  });
};
