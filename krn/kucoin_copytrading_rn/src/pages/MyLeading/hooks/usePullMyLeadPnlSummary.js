import {useSelector} from 'react-redux';

import {CURRENT_LIST_REFRESH_INTERVAL} from 'constants/index';
import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {queryMyLeadShowPnlSummary} from 'services/copy-trade';

export const usePullMyLeadPnlSummary = () => {
  const activeLeadSubAccountInfo = useSelector(
    state => state.leadInfo.activeLeadSubAccountInfo,
  );

  const {configId: leadConfigId, uid: subUID} = activeLeadSubAccountInfo || {};
  const enabledFetch = !!(leadConfigId && subUID);
  const {
    isFetched,
    data,
    isLoading,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: [QueryKeys.PullMyLeadSummaryPnl, {leadConfigId, subUID}],
    queryFn: () => {
      return queryMyLeadShowPnlSummary({
        leadConfigId,
        subUID,
      });
    },
    enabled: enabledFetch,
    refetchInterval: CURRENT_LIST_REFRESH_INTERVAL,
    refetchOnMount: 'always', //“always”，查询将始终在挂载时重新获取。
    cacheTime: 0,
  });

  const refetch = async () => {
    // 无带单员权限不刷新
    if (!enabledFetch) {
      return;
    }
    await queryRefetch();
  };

  return {
    data: data?.data || {},
    loading: isLoading,
    isFetched,
    refetch,
  };
};
