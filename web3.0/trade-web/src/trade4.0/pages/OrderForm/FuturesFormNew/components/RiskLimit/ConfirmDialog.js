/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import Dialog from '@mui/Dialog';

import { DialogContent } from './style';

import { _t } from '../../builtinCommon';

const ConfirmDialog = ({ open, onOk, onCancel }) => {
  return (
    <Dialog
      title={_t('risk.limit.confirm.title')}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText={_t('risk.limit.confirm.btn')}
      cancelText={_t('cancel')}
    >
      <DialogContent>{_t('risk.limit.confirm.content')}</DialogContent>
    </Dialog>
  );
};

export default React.memo(ConfirmDialog);
