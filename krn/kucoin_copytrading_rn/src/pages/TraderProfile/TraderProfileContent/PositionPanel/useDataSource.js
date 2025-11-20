import {useCallback, useMemo} from 'react';

import {useQuery} from 'hooks/react-query';
import useInfiniteItems, {
  convertResp2InfiniteData,
} from 'hooks/react-query/useInfiniteItems';
import {useParams} from 'hooks/useParams';
import {
  queryMyLeadCurrentPositionList,
  queryMyLeadHistoryPositionList,
} from 'services/copy-trade';
import {RANGE_LIST_TYPE} from '../constant';

export const useDataSource = ({rangeValue}) => {
  const {leadConfigId} = useParams();

  const isQueryHistory = rangeValue === RANGE_LIST_TYPE.history;

  const {
    list: paginationList,
    loadMore,
    isLoading: isPaginationLoading,
  } = useInfiniteItems({
    enabled: !!(isQueryHistory && leadConfigId),
    queryKey: [leadConfigId, 'queryMyLeadHistoryPositionList'],
    queryFn: async params => {
      return convertResp2InfiniteData(
        await queryMyLeadHistoryPositionList({
          currentPage: params.pageParam || 1,
          pageSize: 10,
          leadConfigId,
        }),
      );
    },
  });

  const {data, isLoading: isFullListLoading} = useQuery({
    enabled: !!(!isQueryHistory && leadConfigId),
    queryKey: [leadConfigId, 'queryMyLeadCurrentPositionList'],
    queryFn: async () =>
      await queryMyLeadCurrentPositionList({
        leadConfigId,
      }),
  });

  const dataSource = useMemo(() => {
    return isQueryHistory ? paginationList : data?.data || [];
  }, [data?.data, isQueryHistory, paginationList]);

  const onEndReached = useCallback(() => {
    if (!isQueryHistory) return;
    loadMore();
  }, [isQueryHistory, loadMore]);

  const isLoading = useMemo(
    () => (isQueryHistory ? isPaginationLoading : isFullListLoading),
    [isQueryHistory, isPaginationLoading, isFullListLoading],
  );

  return {dataSource, onEndReached, isLoading};
};
