/**
 * Owner: solar.xia@kupotech.com
 */
import React, { useCallback } from 'react';

import { _t } from 'utils/lang';
import Dialog from '@mui/Dialog';
import { useSelector, useDispatch } from 'dva';

export default function PublicDialog() {
  const dispatch = useDispatch();
  const {
    content,
    title,
    buttonText,
    buttonLink,
    visible,
    cancelText = '',
    confirmAction = () => {},
    cancelAction = () => {},
    closeAction = () => {},
  } = useSelector((state) => state.dialog);
  const handleCancel = useCallback(() => {
    closeAction();
    dispatch({ type: 'dialog/closeDialog' });
  }, [closeAction]);
  const handleOk = useCallback(() => {
    if (buttonLink) {
      confirmAction();
      window.location.href = buttonLink;
    } else {
      cancelAction();
      dispatch({ type: 'dialog/closeDialog' });
    }
  }, [buttonLink, confirmAction, cancelAction]);
  return (
    <Dialog
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={buttonText || _t('ujNoFGRzi475x6ADnkkquG')}
      cancelText={cancelText}
      title={title}
      destroyOnClose
    >
      {content}
    </Dialog>
  );
}
