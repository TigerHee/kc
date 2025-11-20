/*
 * owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { useResponsive, useSnackbar } from '@kux/mui';
import Dialog from '@mui/Dialog';
import { _t, _tHTML } from 'src/utils/lang';
import { sensorFunc } from '@/hooks/useSensorFunc';
import { event } from '@/utils/event';

const CancelClosePositionModal = React.memo(() => {
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { visible, tag } = useSelector((state) => state.isolated.cancelClosePositionModalConfig);
  const confirmLoading = useSelector(
    state => state.loading.effects['isolated/cancelOneClickLiquidation'],
  );
  const { message } = useSnackbar();

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'isolated/updateCancelClosePositionModalConfig',
      payload: {
        visible: false,
      },
    });
  }, [dispatch]);

  const handleOk = useCallback(() => {
    dispatch({
      type: 'isolated/cancelOneClickLiquidation',
      payload: {
        symbol: tag,
      },
    }).then((res) => {
      if (res?.success) {
        message.success(_t('operation.succeed'));
        event.emit('cancelClosePosition.success', { tag });
        handleCancel();
      } else {
        res.msg && message.error(res.msg);
      }
    });
    sensorFunc(['assetDisplayArea', 'canelClosePositionEnsure']);

  }, [dispatch, handleCancel, message, sensorFunc, tag]);

  return (
    <Dialog
      // size="small"
      destroyOnClose
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={_t('confirm')}
      title={_t('39KvvPYFBnvWh6j94CgdqD')}
      cancelText={sm ? _t('cancel') : null}
      okButtonProps={{
        loading: confirmLoading,
      }}
    >
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {_tHTML('r1GBbmr4VB3vNyW2qopkBL')}
      </div>
    </Dialog>
  );
});

export default CancelClosePositionModal;
