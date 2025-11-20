/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { futuresSensors } from 'src/trade4.0/meta/sensors';

import { AdaptiveModal as Dialog, useI18n } from '@/pages/Futures/import';
import { namespace } from '../../config';

const LiquidationPLWarningDialog = () => {
  const { _t } = useI18n();
  const dispatch = useDispatch();
  const visible = useSelector((state) => state[namespace].liquidationPLWarningVisible);
  const liquidationData = useSelector((state) => state[namespace].liquidationData);
  const loading = useSelector(
    (state) => state.loading.effects[`${namespace}/createStopOrderFromShortcut`],
  );

  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: `${namespace}/update`,
      payload: {
        liquidationPLWarningVisible: false,
        liquidationData: {},
      },
    });
  };

  const handleSubmit = async () => {
    const { type, symbol, price, side, size, isTrialFunds, marginMode } = liquidationData;
    // futuresSensors.position.stopLPCancel.click();
    // 撤销止盈止损单
    await dispatch({
      type: `${namespace}/cancelStopOrderFromShortcut`,
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
      type: `${namespace}/createCloseOrder`,
      payload: {
        type,
        symbol,
        price,
        side,
        size,
        isTrialFunds,
        marginMode,
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
