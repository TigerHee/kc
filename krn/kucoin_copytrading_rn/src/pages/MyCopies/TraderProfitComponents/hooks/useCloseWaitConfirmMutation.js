import {showToast} from '@krn/bridge';

import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import {closeCopyConfigId} from 'services/copy-trade';
import {useStore} from '../../hooks/useStore';

export const useCloseWaitConfirmMutation = ({copyConfigId}) => {
  const {dispatch} = useStore();
  const {_t} = useLang();
  return useMutation({
    mutationFn: async () => closeCopyConfigId({copyConfigId}),
    onSuccess: () => {
      dispatch({
        type: 'addClosedWaitConfirmCopyConfigId',
        payload: copyConfigId,
      });

      showToast(_t('531d7cf9a2694000a84d'));
    },
  });
};
