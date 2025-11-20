import {useCallback, useMemo} from 'react';

import {
  CURRENT_LIST_HIGH_FREQ_REFRESH_INTERVAL,
  CURRENT_LIST_REFRESH_INTERVAL,
} from 'constants/index';
import {useQuery} from 'hooks/react-query';
import useInfiniteItems, {
  convertResp2InfiniteData,
} from 'hooks/react-query/useInfiniteItems';
import {useIsLogin} from 'hooks/useWithLoginFn';
import {
  queryCurrentMyCopyTraderList,
  queryHistoryMyCopyTraderList,
  queryMyCopyCurrentPositionList,
  queryMyCopyHistoryPositionList,
  queryMyFollowTraderList,
} from 'services/copy-trade';
import {deduplicateByContent} from 'utils/helper';
import {MY_COPY_RENDER_ITEM_TYPE} from '../constant';
import {convertMyCopiesFilterValue2Payload} from '../helper';
import {useFilterHelper} from './useFilterHelper';
import {useStore} from './useStore';

const REQUEST_SERVICE_CONFIG_BY_ITEM_TYPE = {
  [MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent]: {
    requestApi: queryCurrentMyCopyTraderList,
    usePagination: false,
    queryOption: {
      refetchInterval: CURRENT_LIST_HIGH_FREQ_REFRESH_INTERVAL,
    },
    keyExtractor: item =>
      `${MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent}_${item?.traderInfoResponse?.leadConfigId}_${item?.copyConfigId}`,
  },
  [MY_COPY_RENDER_ITEM_TYPE.myTradeHistory]: {
    requestApi: queryHistoryMyCopyTraderList,
    usePagination: true,
    keyExtractor: (item, idx) => {
      const {traderInfoResponse, copyConfigId} = item || {};
      return `${MY_COPY_RENDER_ITEM_TYPE.myTradeHistory}_${traderInfoResponse?.leadConfigId}_${copyConfigId}_${idx}`;
    },
  },
  [MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent]: {
    requestApi: queryMyCopyCurrentPositionList,
    usePagination: false,
    queryOption: {
      refetchInterval: CURRENT_LIST_REFRESH_INTERVAL,
    },
    keyExtractor: item => {
      const {symbol, startTime, traderInfoResponse} = item || {};
      return `${MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent}_${symbol}_${startTime}_${traderInfoResponse?.leadConfigId}`;
    },
  },
  [MY_COPY_RENDER_ITEM_TYPE.myPositionHistory]: {
    requestApi: queryMyCopyHistoryPositionList,
    usePagination: true,
    keyExtractor: (item, idx) =>
      // eslint-disable-next-line max-len
      `${MY_COPY_RENDER_ITEM_TYPE.myPositionHistory}_${item?.symbol}_${item?.startTime}_${item?.traderInfoResponse?.leadConfigId}`,
  },
  [MY_COPY_RENDER_ITEM_TYPE.myAttention]: {
    requestApi: queryMyFollowTraderList,
    usePagination: false,
    keyExtractor: (item, idx) => {
      const {nickName, leadConfigId} = item?.traderInfoResponse || {};
      return `${MY_COPY_RENDER_ITEM_TYPE.myAttention}_${nickName}_${leadConfigId}_${idx}`;
    },
  },
};

export const useDataSource = () => {
  const {state} = useStore();
  const isLogin = useIsLogin();
  const {filterValues} = useFilterHelper();
  const {renderCardType, isClosedWaitConfirmCopyConfigIdMap} = state;

  const {requestApi, usePagination, queryOption, keyExtractor} = useMemo(
    () => REQUEST_SERVICE_CONFIG_BY_ITEM_TYPE[renderCardType] || {},
    [renderCardType],
  );

  const queryOptions = useMemo(() => {
    const payload = convertMyCopiesFilterValue2Payload(filterValues);
    return {
      queryKey: ['myCopiesIndex', renderCardType, payload],
      queryFn: !usePagination
        ? () => requestApi(payload)
        : async params => {
            return convertResp2InfiniteData(
              await requestApi({
                currentPage: params.pageParam || 1,
                pageSize: 10,
                ...payload,
              }),
            );
          },
    };
  }, [renderCardType, usePagination, requestApi, filterValues]);

  const {
    list: paginationList,
    loadMore,
    isLoading: isPaginationLoading,
    isFetching: isPaginationFetching,
  } = useInfiniteItems({
    ...queryOptions,
    enabled: Boolean(isLogin && usePagination),
  });

  const {
    data,
    isLoading: isFullListLoading,
    isFetching: isFullListFetching,
    refetch: refetchFullList,
  } = useQuery({
    ...queryOptions,
    enabled: Boolean(isLogin && !usePagination),
    refetchOnMount: true,
    ...queryOption,
  });

  const dataSource = useMemo(() => {
    const list = (usePagination ? paginationList : data?.data) || [];
    let result = list;
    // 当前交易员 过滤已完成 待处理已撤销交易员 名单
    if (renderCardType === MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent) {
      result = list?.filter(
        i => !isClosedWaitConfirmCopyConfigIdMap[String(i?.copyConfigId)],
      );
    }
    return deduplicateByContent(result);
  }, [
    usePagination,
    paginationList,
    data?.data,
    renderCardType,
    isClosedWaitConfirmCopyConfigIdMap,
  ]);
  const onEndReached = useCallback(() => {
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
    filterValues,
    dataSource,
    onEndReached,
    isLoading,
    isFetching,
    keyExtractor,
    refetch,
  };
};
