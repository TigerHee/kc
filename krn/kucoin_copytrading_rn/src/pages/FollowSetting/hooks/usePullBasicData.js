import {useMemoizedFn} from 'ahooks';
import {useDispatch, useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';
import {useFocusEffect} from '@react-navigation/native';

import {QueryKeys} from 'constants/queryKeys';
import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailShowInfoSummary} from 'services/copy-trade';
import {useRefreshAvailableBalance} from './useRefreshAvailableBalance';

export const usePullBasicData = () => {
  const dispatch = useDispatch();
  const {leadConfigId} = useParams();
  useRefreshAvailableBalance();
  const tradeMap = useSelector(state => state.assets.tradeMap) || {};
  const settleSymbol = getBaseCurrency();

  const {availableBalance: tradeAmount = 0} = tradeMap[settleSymbol] || {};

  const {data: showInfoResp} = useQuery({
    queryKey: [QueryKeys.queryTraderDetailShowInfoSummary, `${leadConfigId}`],
    queryFn: async () => await queryTraderDetailShowInfoSummary({leadConfigId}),
  });

  const pullAssets = useMemoizedFn(() => {
    dispatch({type: 'assets/pullAccountCoins'});
  });
  useFocusEffect(pullAssets);

  return {
    availableBalance: tradeAmount,
    traderInfo: showInfoResp?.data,
  };
};
