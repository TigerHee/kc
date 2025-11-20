import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '@krn/bridge';

import {BUS_RESP_CODE_MAP} from 'constants/businessType';
import {useMutation} from 'hooks/react-query';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import {modifyMyLeadTraderInfo} from 'services/copy-trade';
import showError from 'utils/showError';

export const useHandleSaveForm = () => {
  const {uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const goBack = useGoBack();
  const {_t} = useLang();
  const dispatch = useDispatch();

  const {mutate, isLoading} = useMutation({
    mutationFn: async formValue =>
      await modifyMyLeadTraderInfo({subUID, ...formValue}),
    onSuccess: () => {
      goBack();
      showToast(_t('a5201d05be5a4000a338'));
    },
    onError: e => {
      if (+e?.code === BUS_RESP_CODE_MAP.EditNickNameReplyError) {
        showToast(_t('0049cd3755f74000a32b'));
        return;
      }
      showError(e, dispatch);
    },
  });

  return {
    changeMyTraderInfo: mutate,
    isLoading,
  };
};
