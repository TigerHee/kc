import {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {CURRENT_LIST_REFRESH_INTERVAL} from 'constants/index';
import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {queryMyCopyShowPnlSummary} from 'services/copy-trade';
import {delay, safeArray} from 'utils/helper';

export const usePullMyCopyPnlSummary = () => {
  const isLogin = useSelector(state => state.app.isLogin);
  const userInfo = useSelector(state => state.app.userInfo);
  const enabledFetch = !!isLogin;

  const {
    data,
    isLoading,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: [QueryKeys.PullMyCopySummaryPnl, {isLogin, uid: userInfo?.uid}],
    queryFn: async () => await queryMyCopyShowPnlSummary(),
    refetchInterval: CURRENT_LIST_REFRESH_INTERVAL,
    enabled: enabledFetch,
    refetchOnMount: 'always', //“always”，查询将始终在挂载时重新获取。
    cacheTime: 0,
  });

  const formatData = useMemo(() => {
    const totalPnlDateList = safeArray(data?.data?.totalPnlDateList);
    const totalPnl = totalPnlDateList[totalPnlDateList.length - 1]?.totalPnl;

    return {
      ...(data?.data || {}),
      totalPnl,
      totalPnlDateList,
    };
  }, [data?.data]);
  const refetch = async () => {
    // 未登录 不真实请求 只出加载动画
    if (!enabledFetch) {
      await delay(1500);
      return;
    }
    await queryRefetch();
  };

  return {
    data: formatData,
    loading: isLoading,
    refetch,
  };
};
