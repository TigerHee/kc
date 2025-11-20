import {useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {QueryKeys} from 'constants/queryKeys';
import useInfiniteItems, {
  convertResp2InfiniteData,
} from 'hooks/react-query/useInfiniteItems';
import {queryMyLeadCopyFollowersList} from 'services/copy-trade';
import {makeListAppendNo} from 'utils/helper';

export const useDataSource = ({isShowCumulativeProfit}) => {
  const {uid: subUID, configId: leadConfigId} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const {
    list: paginationList,
    loadMore,
    isLoading: isPaginationLoading,
    data: infiniteQueryData,
  } = useInfiniteItems({
    queryKey: [
      QueryKeys.pullMyTraderPositionSummaryList,
      {leadConfigId, isShowCumulativeProfit},
    ],
    queryFn: async params => {
      return convertResp2InfiniteData(
        await queryMyLeadCopyFollowersList({
          subUID,
          currentPage: params.pageParam || 1,
          pageSize: 10,
          leadConfigId,
          scope: isShowCumulativeProfit ? 'all' : 'currently',
        }),
      );
    },
    enabled: !!(leadConfigId && subUID),
  });

  const onEndReached = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const myCopyFollowersCount = useMemo(() => {
    return infiniteQueryData?.pages?.[0]?.totalNum;
  }, [infiniteQueryData]);

  return {
    dataSource: makeListAppendNo(paginationList),
    onEndReached,
    isLoading: isPaginationLoading,
    myCopyFollowersCount,
  };
};
