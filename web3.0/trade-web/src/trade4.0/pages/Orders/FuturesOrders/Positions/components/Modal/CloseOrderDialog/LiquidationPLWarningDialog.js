/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { _t } from 'utils/lang';
import Dialog from '@/components/AdaptiveModal';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const LiquidationPLWarningDialog = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futures_orders.liquidationPLWarningVisible);
  const liquidationData = useSelector((state) => state.futures_orders.liquidationData);
  const loading = useSelector(
    (state) => state.loading.effects['futures_orders/createStopOrderFromShortcut'],
  );

  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: 'futures_orders/update',
      payload: {
        liquidationPLWarningVisible: false,
        liquidationData: {},
      },
    });
  };

  const handleSubmit = async () => {
    const { type, symbol, price, side, size, isTrialFunds } = liquidationData;

    futuresSensors.position.stopLPCancel.click();
    // 撤销止盈止损单
    await dispatch({
      type: 'futures_orders/cancelStopOrderFromShortcut',
      payload: {
        upPrice: undefined,
        downPrice: undefined,
        symbol,
        isTrialFunds,
      },
    });
    // 关闭弹框
    handleCloseDialog();
    // 撤单成功发起创建
    dispatch({
      type: 'futures_orders/createCloseOrder',
      payload: {
        type,
        symbol,
        price,
        side,
        size,
        isTrialFunds,
      },
    });
  };

  return (
    <Dialog
      open={visible}
      okText={_t('stopClose.cancel.order')}
      onOk={handleSubmit}
      onClose={handleCloseDialog}
      okButtonProps={{ loading, disabled: loading }}
      title={_t('stopClose.cancel.title')}
    >
      {_t('stopClose.cancel.tip')}
    </Dialog>
  );
};

export default React.memo(LiquidationPLWarningDialog);
