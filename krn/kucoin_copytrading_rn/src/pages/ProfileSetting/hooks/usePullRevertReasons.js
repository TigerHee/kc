import {useQuery} from 'hooks/react-query';
import {getRevertLeadCancelReasonOptions} from 'services/copy-trade';

export const usePullRevertReasons = () => {
  return useQuery({
    queryKey: ['getRevertLeadCancelReasonOptions'],
    queryFn: getRevertLeadCancelReasonOptions,
  });
};
