import {useSelector} from 'react-redux';

import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {queryMyLeadPnlHistoryList} from 'services/copy-trade';

export const usePullMyLeadHistoryPnlList = () => {
  const {configId: leadConfigId, uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const {data, isLoading} = useQuery({
    queryKey: [QueryKeys.PullMyLeadPnlHistoryList, {leadConfigId, subUID}],
    queryFn: async () => {
      return await queryMyLeadPnlHistoryList({
        leadConfigId,
        subUID,
      });
    },
    enabled: !!(leadConfigId && subUID),
  });

  return {
    data: data?.data,
    loading: isLoading,
  };
};
