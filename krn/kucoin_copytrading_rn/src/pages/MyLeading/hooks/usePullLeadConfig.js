import {useSelector} from 'react-redux';

import {useQuery} from 'hooks/react-query';
import {queryLeadAccountBalance} from 'services/copy-trade';

export const usePullLeadConfig = () => {
  const {uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const {data: leadAccountBalanceResp, isFetched} = useQuery({
    queryKey: ['queryLeadAccountBalance'],
    queryFn: async () => await queryLeadAccountBalance(subUID),
    enabled: !!subUID,
  });

  const {minInitAmount} = leadAccountBalanceResp?.data || {};

  return {
    minInitAmount,
    isFetched,
  };
};
