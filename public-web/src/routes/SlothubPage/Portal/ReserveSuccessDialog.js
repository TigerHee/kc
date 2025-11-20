/*
 * owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import TipDialog from '../components/TipDialog';
import { LINKS } from '../constant';
import { jumpTo } from '../utils';

const ReserveSuccessDialog = () => {
  const dispatch = useDispatch();
  const userSummary = useSelector((state) => state.slothub.userSummary);
  const reserveVisible = useSelector((state) => state.slothub.reserveVisible);
  const isKyc = userSummary?.kycLevel === 3;

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'slothub/update',
      payload: {
        reserveVisible: false,
      },
    });
  }, []);

  const handleOk = useCallback(() => {
    handleCancel();
    jumpTo(LINKS.kyc());
  }, [handleCancel]);

  return (
    <TipDialog
      open={reserveVisible}
      title={_t('hmMdg7DMuLwHvqys1H1QpT')}
      {...(isKyc
        ? {
            cancelText: null,
            onOk: handleCancel,
            onCancel: handleCancel,
            okText: _t('2e7e916fa6934000a923'),
          }
        : {
            onOk: handleOk,
            onCancel: handleCancel,
            okText: _t('8e065a11446c4000ad8f'),
            cancelText: _t('8bf5d85f78e64000aaa8'),
          })}
    >
      {isKyc ? _t('249b631dcfe24000a29c') : _t('f10b58fb21fe4000a66f')}
    </TipDialog>
  );
};

export default React.memo(ReserveSuccessDialog);
