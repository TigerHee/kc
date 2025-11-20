/**
 * Owner: clyne@kupotech.com
 */

import React, { memo } from 'react';
import useI18n from '@/hooks/futures/useI18n';
import Dialog from '@mui/Dialog';
import Form from '@mui/Form';
import PNLForm from './PNLForm';
import { useDialog } from './hooks/usePnlForm';

const { useForm } = Form;

const PNLSetDialog = () => {
  const { _t } = useI18n();
  const [form] = useForm();
  const { visible, onCancel, alertInfo } = useDialog(form);
  const isEdit = !!alertInfo.id;
  const dialogTitle = _t(isEdit ? 'setting.pnl.edit' : 'setting.pnl.add');
  return (
    <Dialog
      title={dialogTitle}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      cancelText={null}
      className="pnl-alert-dialog"
    >
      <PNLForm form={form} />
    </Dialog>
  );
};

export default memo(PNLSetDialog);
