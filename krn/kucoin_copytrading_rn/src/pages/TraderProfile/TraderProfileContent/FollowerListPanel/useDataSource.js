import useInfiniteItems, {
  convertResp2InfiniteData,
} from 'hooks/react-query/useInfiniteItems';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailCopyTraders} from 'services/copy-trade';
import {makeListAppendNo} from 'utils/helper';

export const useDataSource = () => {
  const {leadConfigId} = useParams();

  const {
    list: paginationList,
    loadMore,
    isFetching: isPaginationLoading,
  } = useInfiniteItems({
    queryKey: ['queryTraderDetailCopyTraders', leadConfigId],
    staleTime: 10 * 1000, // 10秒内重复请求 预留数据新鲜
    queryFn: async params => {
      return convertResp2InfiniteData(
        await queryTraderDetailCopyTraders({
          currentPage: params.pageParam || 1,
          pageSize: 10,
          leadConfigId,
        }),
      );
    },
  });
  return {
    dataSource: makeListAppendNo(paginationList),
    onEndReached: loadMore,
    isLoading: isPaginationLoading,
  };
};
