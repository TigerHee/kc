import {useQuery} from 'hooks/react-query';
import {getCopyTraderPositionSummaryInfo} from 'services/copy-trade';
import {useRewriteFormDetail} from './useRewriteFormDetail';
export const useGetTraderPositionSummaryInfo = () => {
  const {data: configInfo} = useRewriteFormDetail();
  const {copyConfigId} = configInfo || {};

  return useQuery({
    queryKey: ['getCopyTraderPositionSummaryInfo', copyConfigId],
    queryFn: async () =>
      await getCopyTraderPositionSummaryInfo({
        copyConfigId,
        isActive: true,
      }),
    enabled: !!copyConfigId,
    cacheTime: 0,
  });
};
