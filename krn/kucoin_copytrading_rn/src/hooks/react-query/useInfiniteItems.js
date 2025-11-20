import {useMemoizedFn} from 'ahooks';
import {useMemo} from 'react';

import {safeArray} from 'utils/helper';
import {useCustomInfiniteQuery} from './useCustomInfiniteQuery';

export const convertResp2InfiniteData = resp => {
  const {items, pageSize, totalNum, totalPage, currentPage} = resp?.data || {};
  return {
    items: safeArray(items),
    currentPage,
    pageSize,
    totalNum,
    totalPage,
  };
};

const useInfiniteItems = options => {
  const queryResult = useCustomInfiniteQuery({
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    getNextPageParam: lastPage => {
      if (lastPage && lastPage.currentPage < lastPage.totalPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    ...options,
  });

  const loadMore = useMemoizedFn(() => {
    if (queryResult.hasMore) {
      queryResult.fetchNextPage();
    }
  });

  const list = useMemo(
    () =>
      queryResult?.data?.pages?.reduce?.(
        (a, b) => [...a, ...(b?.items || [])],
        [],
      ),
    [queryResult.data],
  );
  return {
    ...queryResult,
    list,
    loadMore,
  };
};

export default useInfiniteItems;
