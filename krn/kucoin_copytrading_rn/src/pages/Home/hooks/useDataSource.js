import {useCallback, useMemo} from 'react';

import {QueryKeys} from 'constants/queryKeys';
import useInfiniteItems, {
  convertResp2InfiniteData,
} from 'hooks/react-query/useInfiniteItems';
import {queryLeaderBoard} from 'services/copy-trade';
import {generateRankListPayload} from '../helper';

export const useDataSource = ({formState}) => {
  const payload = useMemo(
    () => generateRankListPayload(formState) || {},
    [formState],
  );

  const {
    list: paginationList,
    loadMore,
    isLoading: isPaginationLoading,
    isFetching,
  } = useInfiniteItems({
    queryKey: [QueryKeys.queryLeaderBoard, JSON.stringify(payload)],
    cacheTime: 0,
    queryFn: async params => {
      return convertResp2InfiniteData(
        await queryLeaderBoard({
          currentPage: params.pageParam || 1, // 排行榜分页从 1 开始
          pageSize: 10,
          ...payload,
        }),
      );
    },
    staleTime: 10 * 1000, // 10秒内重复请求 预留数据新鲜
    // 缓存 5 分钟
  });

  const onEndReached = useCallback(() => {
    if (isFetching) {
      return;
    }
    loadMore();
  }, [isFetching, loadMore]);

  return {
    dataSource: paginationList,
    isLoading: isPaginationLoading,
    onEndReached,
    isFetching,
  };
};
