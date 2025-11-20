import {useLockFn} from 'ahooks';
import {useDispatch} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';

import {useMutation} from 'hooks/react-query';
import useTracker from 'hooks/useTracker';
import {transferCopyMaxAmount} from 'services/copy-trade';
import showError from 'utils/showError';

export const useTransferCopyMaxAmount = () => {
  const dispatch = useDispatch();
  const {onClickTrack} = useTracker();

  const {mutateAsync, isLoading} = useMutation({
    mutationFn: ({direction, amount, currency, copyConfigId}) =>
      transferCopyMaxAmount({
        direction,
        amount,
        currency: currency || getBaseCurrency(),
        copyConfigId,
      }),
    onError: e => {
      showError(e, dispatch);
    },
    onSettled: (data, err) => {
      const {success, code, msg} = data || err || {};
      try {
        onClickTrack({
          blockId: 'copy',
          locationId: 'confirm',
          properties: {
            is_success: success,
            fail_reason: success ? 'none' : `${code || ''}:${msg || ''}`,
            fail_reason_code: success ? 'none' : code || '',
          },
        });
      } catch (error) {
        console.error('mylog ~ follow-setting track ~ error:', error);
      }
    },
  });

  const submitConfigForm = useLockFn(mutateAsync);

  return {submit: submitConfigForm, isLoading};
};
