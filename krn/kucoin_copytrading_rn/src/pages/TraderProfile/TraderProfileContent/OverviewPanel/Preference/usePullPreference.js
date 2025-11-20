import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailCurrencyPreference} from 'services/copy-trade';
import {safeArray} from 'utils/helper';

export const usePullPreference = () => {
  const {leadConfigId, subUID} = useParams();

  const {data, isLoading} = useQuery({
    queryKey: ['queryTraderDetailCurrencyPreference', leadConfigId],
    queryFn: async () =>
      await queryTraderDetailCurrencyPreference({leadConfigId, subUID}),
  });
  return {
    isLoading,
    currencyPreferenceData: safeArray(data?.data),
  };
};
