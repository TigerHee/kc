import {useToggle} from 'ahooks';

import {
  CURRENT_LIST_REFRESH_INTERVAL,
  HIGH_FREQ_REFRESH_INTERVAL,
} from 'constants/index';
import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {getCopyTraderPositionSummaryInfo} from 'services/copy-trade';
import {MATCH_URL_PARAMS} from '../constant';

export const usePullTraderAndProfitQuery = () => {
  const [isHighFrequencyPolling, {toggle: toggleHighFrequencyPolling}] =
    useToggle(false);
  const {
    copyConfigId,
    isHistoryCopyTrader: paramIsHistoryCopyTrader = 'false',
  } = useParams();
  const isHistoryCopyTrader = paramIsHistoryCopyTrader === MATCH_URL_PARAMS;
  const query = useQuery({
    queryKey: [
      'getCopyTraderPositionSummaryInfo',
      copyConfigId,
      isHistoryCopyTrader,
    ],
    queryFn: async () =>
      await getCopyTraderPositionSummaryInfo({
        copyConfigId,
        isActive: !isHistoryCopyTrader,
      }),
    enabled: !!copyConfigId,
    refetchInterval: !isHighFrequencyPolling
      ? CURRENT_LIST_REFRESH_INTERVAL
      : HIGH_FREQ_REFRESH_INTERVAL,
  });

  return {...query, toggleHighFrequencyPolling};
};
