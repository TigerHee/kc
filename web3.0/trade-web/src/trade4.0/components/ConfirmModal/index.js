/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-01-07 16:39:08
 * @Description: 确认框
 */
import React from 'react';
import Dialog from '@mui/Dialog';
import { _t } from 'utils/lang';

const ConfirmModal = ({ title, content, ...otherProps }) => {
  return (
    <Dialog
      title={title}
      cancelText={_t('cancel')}
      okText={_t('open.sure')}
      {...otherProps}
    >
      <div>{content}</div>
    </Dialog>
  );
};

export default ConfirmModal;
