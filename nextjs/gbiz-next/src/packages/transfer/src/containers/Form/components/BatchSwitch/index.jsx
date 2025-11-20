/**
 * Owner: solar@kupotech.com
 */
import { Switch } from '@kux/mui';
import { useTranslation } from 'tools/i18n';
import { useCallback, useEffect } from 'react';
import { useTransferSelector, useTransferDispatch } from '@transfer/utils/redux';
import { StyledBatchSwitch } from './style';

export default function BatchSwitch() {
  const { t: _t } = useTranslation('transfer');
  const dispatchTransfer = useTransferDispatch();

  const isSupportBatch = useTransferSelector((state) => state.isSupportBatch);
  const isBatchEnable = useTransferSelector((state) => state.isBatchEnable);

  useEffect(() => {
    return () => {
      dispatchTransfer({
        type: 'update',
        payload: {
          isBatchEnable: false,
        },
      });
    };
  }, [dispatchTransfer]);

  const handleSwitchChange = useCallback(
    (isBatchEnable) => {
      dispatchTransfer({
        type: 'update',
        payload: {
          isBatchEnable,
        },
      });
    },
    [dispatchTransfer],
  );
  useEffect(() => {
    if (!isSupportBatch) {
      dispatchTransfer({
        type: 'update',
        payload: {
          isBatchEnable: false,
        },
      });
    }
  }, [isSupportBatch, dispatchTransfer]);
  if (!isSupportBatch) {
    return null;
  }
  return (
    <StyledBatchSwitch>
      <span>{_t('transfer.batch.switch')}</span>
      <Switch size="small" checked={isBatchEnable} onChange={handleSwitchChange} />
    </StyledBatchSwitch>
  );
}
