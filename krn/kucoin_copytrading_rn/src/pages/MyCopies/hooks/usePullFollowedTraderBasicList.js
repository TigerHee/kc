import {useSelector} from 'react-redux';

import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {queryFollowedTraderBasicInfo} from 'services/copy-trade';
import {RANGE_LIST_TYPE} from '../constant';

export const usePullFollowedTraderBasicList = ({rangeValue}) => {
  const isLogin = useSelector(state => state.app.isLogin);

  const {data, isLoading} = useQuery({
    queryKey: [QueryKeys.pullBasicFollowedTraders, rangeValue],
    queryFn: async () =>
      await queryFollowedTraderBasicInfo({
        isCurrent: rangeValue === RANGE_LIST_TYPE.current,
      }),
    enabled: !!isLogin,
  });

  return {
    list: data?.data,
    loading: isLoading,
  };
};
