import {PersistTimeMap} from 'config/queryClient';
import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {getTraderCopyDurationAndProfit} from 'services/copy-trade';

export const useTraderCopyDurationAndProfitQuery = () => {
  const {leadConfigId} = useParams();

  return useQuery({
    queryKey: ['getTraderCopyDurationAndProfit'],
    queryFn: async () => await getTraderCopyDurationAndProfit({leadConfigId}),
    enabled: !!leadConfigId,
    refetchOnFocus: true, // 返回路由刷新
    // 查询跟单状态 与收益 无需缓存
    cacheTime: PersistTimeMap.disabled,
  });
};
