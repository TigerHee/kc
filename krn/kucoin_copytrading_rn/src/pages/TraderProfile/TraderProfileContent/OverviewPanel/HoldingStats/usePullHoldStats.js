import {useSetState} from 'ahooks';

import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailPositionDistribution} from 'services/copy-trade';

export const usePullDistributionData = () => {
  const {leadConfigId, subUID} = useParams();

  const [state, setState] = useSetState({
    period: '30d',
  });

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['queryTraderDetailPositionDistribution', leadConfigId, state],
    queryFn: async () =>
      await queryTraderDetailPositionDistribution({
        leadConfigId,
        period: state.period,
        subUID,
      }),
  });

  const onChangePeriod = value => {
    setState({period: value});
  };

  return {
    isLoading,
    distributionData: data?.data,
    period: state.period,
    onChangePeriod,
  };
};
