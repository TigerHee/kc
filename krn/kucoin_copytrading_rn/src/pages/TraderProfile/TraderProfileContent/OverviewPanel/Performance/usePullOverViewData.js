import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailOverview} from 'services/copy-trade';

export const usePullOverViewData = () => {
  const {leadConfigId, subUID} = useParams();

  const {data} = useQuery({
    queryKey: ['queryTraderDetailOverview', leadConfigId],
    queryFn: async () =>
      await queryTraderDetailOverview({subUID, leadConfigId}),
  });

  return {
    overViewData: data?.data,
  };
};
