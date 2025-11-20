import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderCopyFormConfig} from 'services/copy-trade';

export const usePullCopyFormConfig = () => {
  const {leadConfigId} = useParams();
  return (
    useQuery({
      queryKey: ['queryTraderCopyFormConfig', leadConfigId],
      queryFn: async () => {
        return (await queryTraderCopyFormConfig({leadConfigId})) || {};
      },
      enabled: !!leadConfigId,
    }) || {}
  );
};
