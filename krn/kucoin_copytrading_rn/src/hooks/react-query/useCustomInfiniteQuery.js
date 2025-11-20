// 自定义无限滚动查询 Hook
import {useDeepCompareEffect, useMemoizedFn} from 'ahooks';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

// 空页面数据的默认值
const EMPTY_PAGES = {
  pages: [],
};

// 生成查询键的哈希值
const hashKey = queryKey => JSON.stringify(queryKey);

export const useCustomInfiniteQuery = ({
  queryKey, // 查询键数组
  queryFn, // 获取数据的函数
  getNextPageParam, // 获取下一页参数的函数
  initialPageParam = null, // 初始页参数
  enabled, // 是否启用查询
}) => {
  // 保存所有页合并的数据
  const [pages, setPages] = useState([]);

  // 当前页面参数
  const [currentPageParam, setCurrentPageParam] = useState(
    initialPageParam || 0,
  );
  // 是否还有更多数据可加载
  const [hasMore, setHasMore] = useState(true);

  // 标记是否正在加载下一页，避免重复触发
  const isFetchingNext = useRef(false);

  // 标记是否已更新第一页数据
  const [isUpdateFirstPageFlag, setIsUpdateFirstPageFlag] = useState(false);
  // 使用 useQuery 请求当前页数据
  const queryResults = useQuery({
    queryKey: [...queryKey, currentPageParam],
    queryFn: async () => {
      const result = await queryFn({pageParam: currentPageParam});
      return result;
    },
    enabled,
    onSuccess: data => {
      // 更新对应页码的数据
      pages[currentPageParam || 0] = data;
      setPages([...pages]);
      if (!isUpdateFirstPageFlag) {
        setIsUpdateFirstPageFlag(true);
      }
    },
  });
  // 计算当前查询键的哈希值
  const curHashQueryKey = useMemo(() => hashKey(queryKey), [queryKey]);

  // 保存当前最新的查询键哈希值
  const latestQueryKeyRef = useRef(curHashQueryKey);

  // 加载下一页数据的函数
  const fetchNextPage = useMemoizedFn(() => {
    // 如果没有更多数据或正在加载，则不执行
    if (!hasMore || queryResults.isFetching || isFetchingNext.current) return;

    isFetchingNext.current = true;
    const nextPageParam = getNextPageParam(queryResults.data);
    if (nextPageParam !== undefined && nextPageParam !== null) {
      setCurrentPageParam(nextPageParam);
    } else {
      setHasMore(false);
    }
  });

  // 请求完成后重置加载状态
  useEffect(() => {
    if (!queryResults.isFetching) {
      isFetchingNext.current = false;
    }
  }, [queryResults.isFetching]);

  // 查询键或初始页参数变化时重置所有状态
  useDeepCompareEffect(() => {
    setIsUpdateFirstPageFlag(false);
    setPages([]);
    setCurrentPageParam(initialPageParam);
    setHasMore(true);
    isFetchingNext.current = false;
    latestQueryKeyRef.current = curHashQueryKey;
  }, [curHashQueryKey, initialPageParam]);

  // 根据状态返回数据
  const data = useMemo(() => {
    if (latestQueryKeyRef.current !== curHashQueryKey) {
      return EMPTY_PAGES;
    }
    return {
      pages: isUpdateFirstPageFlag ? pages : [queryResults.data],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateFirstPageFlag, pages, queryResults.data]);

  // 判断是否正在加载
  const isLoading = useMemo(() => {
    if (latestQueryKeyRef.current !== curHashQueryKey) {
      return true;
    }
    return queryResults.isLoading;
  }, [curHashQueryKey, queryResults]);

  return {
    data,
    fetchNextPage,
    hasMore,
    isFetching: queryResults.isFetching,
    isLoading,
    error: queryResults.error,
  };
};
