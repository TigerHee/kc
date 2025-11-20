import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryLeadAccountBalance} from 'services/copy-trade';

export const usePullBalance = () => {
  const {subUID} = useParams();

  const {
    data: leadAccountBalanceResp,
    isFetching: isQueryLoading,
    refetch: refresh,
  } = useQuery({
    queryKey: ['queryLeadAccountBalance'],
    cacheTime: 0,
    queryFn: async () => await queryLeadAccountBalance(subUID),
    refetchOnMount: true,
  });

  const {
    parentAvailableBalance,
    subAvailableBalance,
    minInitAmount,
    subToMainAvailableTransfer,
  } = leadAccountBalanceResp?.data || {};

  return {
    parentAvailableBalance,
    subAvailableBalance,
    config: {
      subToMainAvailableTransfer,
      minInitAmount,
    },
    refresh,
    isQueryLoading,
  };
};
