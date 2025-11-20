/**
 * Owner: garuda@kupotech.com
 * 余额不足弹框
 */

import React, { useState, useCallback, useEffect } from 'react';

import Dialog from '@mui/Dialog';

import { _t, formatCurrency, styled, evtEmitter } from '../../builtinCommon';

import { useTransfer } from '../../builtinHooks';
import { getSymbolInfo } from '../../hooks/useGetData';
import { tradeTransferSensors } from '../../utils';
import { Alert } from '../commonStyle';

const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    // min-height: 340px;
  }

  .KuxDialog-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-bottom: 32px;
  }
  .KuxModalFooter-root {
    padding: 20px 32px;
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
  }
`;

const ContentBox = styled(Alert)`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
`;

const eventHandle = evtEmitter.getEvt();

const BalanceInsufficientDialog = () => {
  const [visible, setVisible] = useState(false);
  const openTransfer = useTransfer();

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const onOk = useCallback(() => {
    onClose();
    const { symbolInfo } = getSymbolInfo();
    openTransfer(formatCurrency(symbolInfo?.settleCurrency));
    // 埋点
    tradeTransferSensors('2');
  }, [onClose, openTransfer]);

  const openDialog = useCallback(() => {
    setVisible(true);
    // 埋点
    tradeTransferSensors('1');
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    // 埋点
    tradeTransferSensors('3');
  }, [onClose]);

  useEffect(() => {
    eventHandle.on('event/order@balanceInsufficient', openDialog);
    return () => {
      eventHandle.off('event/order@balanceInsufficient', openDialog);
    };
  }, [openDialog]);

  return (
    <DialogWrapper
      title={_t('order.toTrans.title')}
      open={visible}
      onCancel={handleClose}
      cancelText={_t('cancel')}
      okText={_t('order.toTrans.confirm')}
      onOk={onOk}
    >
      <ContentBox showIcon type="info" title={_t('order.toTrans.content')} />
    </DialogWrapper>
  );
};

export default React.memo(BalanceInsufficientDialog);
