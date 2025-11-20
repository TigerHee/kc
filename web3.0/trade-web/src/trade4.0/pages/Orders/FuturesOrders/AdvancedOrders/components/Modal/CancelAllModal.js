/**
 * Owner: clyne@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { _t } from 'utils/lang';
import AdaptiveModal from '@/components/AdaptiveModal';
import { BIClick, STOP_ORDER } from 'src/trade4.0/meta/futuresSensors/list';

const CancelAllModal = () => {
  const dispatch = useDispatch();
  const cancelAllVisible = useSelector((state) => state.futures_orders.cancelAllVisibleStop);
  useEffect(() => {
    if (cancelAllVisible) {
      BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_ALL_EXPOSE]);
    }
  }, [cancelAllVisible]);
  const hideCancelConfirm = () => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        cancelAllVisibleStop: false,
      },
    });
  };

  const handleCancelAllOrders = () => {
    BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_ALL_CONFIRM]);
    dispatch({
      type: 'futures_orders/cancelAllStopOrders',
    });
    hideCancelConfirm();
  };

  return (
    <AdaptiveModal
      onCancel={hideCancelConfirm}
      onOk={handleCancelAllOrders}
      okText={_t('security.form.btn')}
      open={cancelAllVisible}
      title={_t('trade.positionsOrders.cancelAll')}
    >
      <div>{_t('cancel.activeOrder.confirm')}</div>
    </AdaptiveModal>
  );
};

export default React.memo(CancelAllModal);
