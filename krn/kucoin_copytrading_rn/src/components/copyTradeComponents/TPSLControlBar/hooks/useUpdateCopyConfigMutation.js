import {MY_COPY_RENDER_ITEM_TYPE} from 'pages/MyCopies/constant';

import {queryClient} from 'config/queryClient';
import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import {updateCopyConfig} from 'services/copy-trade';
import {delayShowToast} from '../helper';

export const useUpdateCopyConfigMutation = () => {
  const {_t} = useLang();
  return useMutation({
    mutationFn: updateCopyConfig,
    onSuccess: () => {
      // 触发我的跟单 当前交易员重新请求
      queryClient.refetchQueries({
        queryKey: ['myCopiesIndex', MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent],
      });
      delayShowToast(_t('e0bad6d090bb4000a048'));
    },
  });
};
