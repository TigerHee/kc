import {useMemoizedFn} from 'ahooks';
import {useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {CURRENT_LIST_HIGH_FREQ_REFRESH_INTERVAL} from 'constants/index';
import {useQuery} from 'hooks/react-query';
import useInfiniteItems, {
  convertResp2InfiniteData,
} from 'hooks/react-query/useInfiniteItems';
import {
  queryMyLeadCopyFollowersList,
  queryMyLeadCurrentPositionList,
  queryMyLeadHistoryPositionList,
} from 'services/copy-trade';
import {makeListAppendNo} from 'utils/helper';
import {MY_LEADING_RENDER_ITEM_TYPE} from '../constant';
import {useStore} from './useStore';

const REQUEST_SERVICE_CONFIG_BY_ITEM_TYPE = {
  [MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent]: {
    requestApi: queryMyLeadCurrentPositionList,
    usePagination: false,
    queryOption: {
      refetchInterval: CURRENT_LIST_HIGH_FREQ_REFRESH_INTERVAL,
    },
  },
  [MY_LEADING_RENDER_ITEM_TYPE.myPositionHistory]: {
    requestApi: queryMyLeadHistoryPositionList,
    usePagination: true,
  },

  [MY_LEADING_RENDER_ITEM_TYPE.myFollower]: {
    requestApi: queryMyLeadCopyFollowersList,
    keyExtractor: item => `${item?.nickName}_${item?.uid}_${item.no}`,

    usePagination: true,
    basicPayload: {
      scope: 'currently',
      isSortTotalRevenueAmount: true,
    },
  },
};

export const useDataSource = () => {
  const {state} = useStore();
  const {renderCardType} = state;
  const {uid: subUID, configId: leadConfigId} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const {
    requestApi,
    usePagination,
    basicPayload = {},
    queryOption,
    keyExtractor,
  } = useMemo(
    () => REQUEST_SERVICE_CONFIG_BY_ITEM_TYPE[renderCardType],
    [renderCardType],
  );

  const queryOptions = useMemo(() => {
    const reqPayload = {
      subUID,
      // 当前仓位入参
      leadConfigId,
    };
    return {
      // 分页数据不缓存
      // 缓存 key 包含带单人subUID 与leadConfigId ，因为带单人重新申请带单员 会变更leadConfigId 缓存数据需不一致
      queryKey: [renderCardType, JSON.stringify({subUID, leadConfigId})],
      queryFn: !usePagination
        ? () => requestApi(reqPayload)
        : async params => {
            return convertResp2InfiniteData(
              await requestApi({
                ...basicPayload,
                ...reqPayload,
                currentPage: params.pageParam || 1,
                pageSize: 10,
              }),
            );
          },
      enabled: !!subUID,
    };
  }, [
    renderCardType,
    usePagination,
    requestApi,
    subUID,
    leadConfigId,
    basicPayload,
  ]);

  const {
    data: infiniteQueryData,
    list: paginationList,
    isLoading: isPaginationLoading,
    isFetching: isPaginationFetching,
    loadMore,
  } = useInfiniteItems({
    ...queryOptions,
    enabled: queryOptions.enabled !== false && usePagination,
  });

  const {
    data,
    isLoading: isFullListLoading,
    isFetching: isFullListFetching,
    refetch: refetchFullList,
  } = useQuery({
    ...queryOptions,
    enabled: queryOptions.enabled !== false && !usePagination,
    refetchOnMount: true,
    ...queryOption,
  });

  const myCopyFollowersCount = useMemo(() => {
    if (renderCardType !== MY_LEADING_RENDER_ITEM_TYPE.myFollower) return;

    return infiniteQueryData?.pages?.[0]?.totalNum;
  }, [infiniteQueryData, renderCardType]);

  const dataSource = useMemo(() => {
    const list = usePagination ? paginationList : data?.data;

    if (renderCardType === MY_LEADING_RENDER_ITEM_TYPE.myFollower) {
      return makeListAppendNo(list);
    }
    return list;
  }, [data, paginationList, renderCardType, usePagination]);

  const onEndReached = useMemoizedFn(() => {
    if (!usePagination) return;
    loadMore();
  }, [loadMore, usePagination]);

  const isLoading = useMemo(
    () => (usePagination ? isPaginationLoading : isFullListLoading),
    [isPaginationLoading, usePagination, isFullListLoading],
  );

  const isFetching = useMemo(
    () => (usePagination ? isPaginationFetching : isFullListFetching),
    [usePagination, isPaginationFetching, isFullListFetching],
  );

  const refetch = useCallback(async () => {
    if (usePagination) {
      return;
    }
    await refetchFullList();
  }, [refetchFullList, usePagination]);

  return {
    myCopyFollowersCount,
    dataSource,
    onEndReached,
    keyExtractor,
    isFetching,
    isLoading,
    refetch,
  };
};
