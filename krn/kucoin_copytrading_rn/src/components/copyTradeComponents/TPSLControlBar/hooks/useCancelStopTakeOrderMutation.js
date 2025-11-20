import {MY_COPY_RENDER_ITEM_TYPE} from 'pages/MyCopies/constant';
import {MY_LEADING_RENDER_ITEM_TYPE} from 'pages/MyLeading/constant';

import {queryClient} from 'config/queryClient';
import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import {cancelStopTakeOrder} from 'services/copy-trade';
import {delayShowToast} from '../helper';

export const useCancelStopTakeOrderMutation = ({isLeadPosition}) => {
  const {_t} = useLang();
  return useMutation({
    mutationFn: async ({orderId, subUid}) =>
      cancelStopTakeOrder({orderId, subUid}),
    onSuccess: () => {
      // 触发重新请求 我的带单当前仓位 / 我的跟单当前仓位
      queryClient.refetchQueries({
        queryKey: isLeadPosition
          ? [MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent]
          : ['myCopiesIndex', MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent],
      });

      delayShowToast(_t('9fb997d484e94000ac6e'));
    },
  });
};
