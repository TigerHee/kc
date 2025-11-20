import {useLockFn, useMemoizedFn} from 'ahooks';
import {getBaseCurrency} from 'site/tenant';
import {showToast} from '@krn/bridge';

import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import {copyTradeLeaderTransfer} from 'services/copy-trade';
import {gotoTransferPageByCoin} from 'utils/native-router-helper';

export const useClick = ({refresh, handleResetValue, onPressBack}) => {
  const {subUID, currency = getBaseCurrency()} = useParams();
  const {_t} = useLang();

  const gotoNativeTransferPage = () => gotoTransferPageByCoin(currency);
  const {mutateAsync: transfer, isLoading} = useMutation({
    mutationFn: params => copyTradeLeaderTransfer(subUID, params),
    onSuccess: () => {
      refresh();
      handleResetValue?.();
      showToast(_t('3f8e482cdd4f4000aad4'));
      onPressBack();
    },
  });

  const lockDoTransfer = useLockFn(transfer);

  const submitTransfer = useMemoizedFn(({amount, direction}) => {
    lockDoTransfer({
      direction,
      amount,
      currency: currency || getBaseCurrency(),
    });
  });

  return {
    submitTransfer,
    isSubmitTransferLoading: isLoading,
    gotoNativeTransferPage,
  };
};
