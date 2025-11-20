import {StaleTimeMap} from 'config/queryClient';
import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailShowInfoSummary} from 'services/copy-trade';

export const usePullSummaryQuery = () => {
  const {leadConfigId} = useParams();

  return useQuery({
    queryKey: [QueryKeys.queryTraderDetailShowInfoSummary, `${leadConfigId}`],
    queryFn: async () => {
      return await queryTraderDetailShowInfoSummary({leadConfigId});
    },
    refetchOnFocus: true,
    slateTime: StaleTimeMap.preload,
  });
};
