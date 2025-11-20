import {useLockFn} from 'ahooks';
import {MY_COPY_RENDER_ITEM_TYPE} from 'pages/MyCopies/constant';
import {showToast} from '@krn/bridge';

import {queryClient} from 'config/queryClient';
import {useMutation} from 'hooks/react-query';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {doCancelCopyConfig} from 'services/copy-trade';
import {useRewriteFormDetail} from './useRewriteFormDetail';

export const useCancelCopyConfig = ({toggle}) => {
  const goBack = useGoBack();
  const {data} = useRewriteFormDetail();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const {mutateAsync: doCancel, isLoading: isCancelLoading} = useMutation({
    mutationFn: () =>
      doCancelCopyConfig({
        copyConfigId: data?.copyConfigId,
      }),
    onSuccess: () => {
      showToast(_t('72931779f8764000a283'));
      toggle(false);
      setTimeout(() => goBack(), 1000);
    },
    onSettled: (data, err) => {
      const {success, code, msg} = data || err || {};
      onClickTrack({
        blockId: 'stop',
        locationId: 'confirm',
        properties: {
          is_success: success,
          fail_reason: success ? 'none' : `${code || ''}:${msg || ''}`,
          fail_reason_code: success ? 'none' : code || '',
        },
      });
      queryClient.removeQueries([
        'myCopiesIndex',
        MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent,
      ]);
      queryClient.removeQueries([
        'myCopiesIndex',
        MY_COPY_RENDER_ITEM_TYPE.myTradeHistory,
      ]);
    },
  });

  const cancelCopyConfig = useLockFn(doCancel);

  return {
    cancelCopyConfig,
    isCancelLoading,
  };
};
