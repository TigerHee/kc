import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryLeadThirtyDaySummary} from 'services/copy-trade';

export const usePullThirtyDayDataQuery = () => {
  const {leadConfigId} = useParams();

  return useQuery({
    queryKey: ['queryLeadThirtyDaySummary', leadConfigId],
    queryFn: async () => await queryLeadThirtyDaySummary({leadConfigId}),
    enabled: !!leadConfigId,
  });
};
