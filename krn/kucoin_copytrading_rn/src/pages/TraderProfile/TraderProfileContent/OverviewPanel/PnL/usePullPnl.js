import {useSetState} from 'ahooks';

import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {queryTraderDetailPnl} from 'services/copy-trade';
import {ShowPnlSwitchType} from '../constant';

export const usePullPnl = () => {
  const {leadConfigId, subUID} = useParams();

  const [state, setState] = useSetState({
    showType: ShowPnlSwitchType.yield,
    period: '30d',
  });

  const {data: pnlListResp, isLoading} = useQuery({
    queryKey: ['queryTraderDetailPnl', leadConfigId, state.period],
    queryFn: async () =>
      await queryTraderDetailPnl({leadConfigId, subUID, period: state.period}),
  });

  const onChangeShowType = value => {
    setState({showType: value});
  };

  const onChangePeriod = value => {
    setState({period: value});
  };

  return {
    isLoading,
    pnlList: pnlListResp?.data,
    state,
    onChangeShowType,
    onChangePeriod,
  };
};
