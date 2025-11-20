import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTransferRecords} from 'services/copy-trade';

export const usePullBalanceHistory = () => {
  const {subUID} = useParams();
  const {
    data: resp,
    isLoading,
    refetch: refresh,
  } = useQuery({
    queryKey: [QueryKeys.pullTransferHistoryList, {subUID}],
    queryFn: async () => await queryTransferRecords(subUID),
    refetchOnFocus: true,
    enabled: !!subUID,
  });

  return {
    data: resp?.data || [],
    refresh,
    loading: isLoading,
  };
};
