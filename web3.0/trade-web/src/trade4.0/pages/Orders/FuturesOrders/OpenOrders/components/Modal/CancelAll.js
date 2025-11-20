/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useEffect } from 'react';
import useActiveOrder from '@/hooks/futures/useActiveOrder';
import { _t } from 'utils/lang';
import AdaptiveModal from '@/components/AdaptiveModal';
import { BIClick, OPEN_ORDER } from 'src/trade4.0/meta/futuresSensors/list';

export default memo(() => {
  const { handleCancelAllOrders, hideCancelConfirm, cancelAllVisible } = useActiveOrder();
  useEffect(() => {
    if (cancelAllVisible) {
      BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_ALL_EXPOSE]);
    }
  }, [cancelAllVisible]);
  return (
    <AdaptiveModal
      onCancel={hideCancelConfirm}
      okText={_t('security.form.btn')}
      onOk={handleCancelAllOrders}
      open={cancelAllVisible}
      title={_t('trade.positionsOrders.cancelAll')}
    >
      <div>{_t('cancel.stopOrder.confirm')}</div>
    </AdaptiveModal>
  );
});
