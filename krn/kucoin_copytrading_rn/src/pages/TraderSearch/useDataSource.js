import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {queryLeadTrader} from 'services/copy-trade';

export const useDataSource = ({nickNameSearch}) => {
  const {data, isLoading} = useQuery({
    queryKey: [QueryKeys.queryLeadTrader, JSON.stringify(nickNameSearch)],
    queryFn: async () => {
      return await queryLeadTrader({
        nickNameSearch,
      });
    },
    getNextPageParam: lastPage => {
      // 首页排行榜 数据源是 es es 分页模型currentPage为 0 开始 totalPage 为 1 开始
      // 因此此处 totalPage 需-1
      if (lastPage.totalPage - 1 > lastPage.currentPage) {
        return lastPage.currentPage + 1;
      }

      return undefined;
    },

    enabled: !!nickNameSearch,
    cacheTime: 0,
  });

  return {
    dataSource: data?.data || [],
    isLoading,
  };
};
